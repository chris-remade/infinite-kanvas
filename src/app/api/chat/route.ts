import { openai } from "@ai-sdk/openai";
import { convertToModelMessages, streamText, UIMessage } from "ai";
import { z } from "zod";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: openai("gpt-4o-mini"),
    system:
      "You are a helpful assistant that can generate images. When the user asks you to create or generate an image, use the generateTextToImage tool. Otherwise reply as a helpful assistant",
    messages: convertToModelMessages(messages),
    tools: {
      // Client-side tool - no execute function
      generateTextToImage: {
        description: "Generate an image from a text prompt",
        inputSchema: z.object({
          prompt: z
            .string()
            .describe("The text prompt to generate an image from"),
          imageSize: z
            .enum([
              "landscape_4_3",
              "portrait_4_3",
              "square",
              "landscape_16_9",
              "portrait_16_9",
            ])
            .optional()
            .describe("The aspect ratio of the generated image"),
        }),
      },
    },
  });

  return result.toUIMessageStreamResponse();
}
