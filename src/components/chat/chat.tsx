"use client";

import { useChat } from "@ai-sdk/react";
import {
  DefaultChatTransport,
  lastAssistantMessageIsCompleteWithToolCalls,
} from "ai";
import { useState } from "react";
import { useTRPC } from "@/trpc/client";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";

interface ChatProps {
  onImageGenerated?: (imageUrl: string) => void;
  customApiKey?: string;
}

export default function Chat({ onImageGenerated, customApiKey }: ChatProps) {
  const { toast } = useToast();
  const trpc = useTRPC();
  const { mutateAsync: generateTextToImage } = useMutation(
    trpc.generateTextToImage.mutationOptions(),
  );

  const { messages, sendMessage, addToolResult, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),

    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,

    // Handle client-side tool calls
    async onToolCall({ toolCall }) {
      // Check if it's a dynamic tool first for proper type narrowing
      if (toolCall.dynamic) {
        return;
      }

      if (toolCall.toolName === "generateTextToImage") {
        try {
          // Extract the tool input with type safety
          const { prompt, imageSize } = toolCall.input as {
            prompt: string;
            imageSize?:
              | "landscape_4_3"
              | "portrait_4_3"
              | "square"
              | "landscape_16_9"
              | "portrait_16_9";
          };

          // Call the tRPC mutation
          const result = await generateTextToImage({
            prompt,
            imageSize: imageSize || "square",
            apiKey: customApiKey,
          });

          // Notify parent component if callback provided
          if (onImageGenerated) {
            onImageGenerated(result.url);
          }

          // Add the result to the chat - no await to avoid deadlocks
          addToolResult({
            tool: "generateTextToImage",
            toolCallId: toolCall.toolCallId,
            output: {
              url: result.url,
              width: result.width,
              height: result.height,
              seed: result.seed,
            },
          });
        } catch (error) {
          console.error("Error generating image:", error);

          // Add error result - no await
          addToolResult({
            tool: "generateTextToImage",
            toolCallId: toolCall.toolCallId,
            output: null,
            error:
              error instanceof Error
                ? error.message
                : "Failed to generate image",
          });

          toast({
            title: "Generation failed",
            description:
              error instanceof Error
                ? error.message
                : "Failed to generate image",
            variant: "destructive",
          });
        }
      }
    },
  });

  const [input, setInput] = useState("");

  return (
    <>
      {messages.map((message) => (
        <div key={message.id}>
          <strong>{`${message.role}: `}</strong>
          {message.parts.map((part, index) => {
            switch (part.type) {
              // Render text parts as simple text
              case "text":
                return <span key={index}>{part.text}</span>;

              // Handle tool parts for generateTextToImage
              case "tool-generateTextToImage": {
                const callId = part.toolCallId;

                switch (part.state) {
                  case "input-streaming":
                    return (
                      <div key={callId}>Preparing to generate image...</div>
                    );
                  case "input-available":
                    return (
                      <div key={callId}>
                        Generating image: "{part.input.prompt}"
                      </div>
                    );
                  case "output-available":
                    return (
                      <div key={callId}>
                        {part.output?.url ? (
                          <img
                            src={part.output.url}
                            alt="Generated image"
                            style={{ maxWidth: "100%", height: "auto" }}
                          />
                        ) : (
                          "No image generated"
                        )}
                      </div>
                    );
                  case "output-error":
                    return <div key={callId}>Error: {part.errorText}</div>;
                }
                break;
              }

              default:
                return null;
            }
          })}
          <br />
        </div>
      ))}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (input.trim()) {
            sendMessage({ text: input });
            setInput("");
          }
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={status !== "ready"}
          placeholder="Ask me to generate an image..."
        />
        <button type="submit" disabled={status !== "ready"}>
          Send
        </button>
      </form>
    </>
  );
}
