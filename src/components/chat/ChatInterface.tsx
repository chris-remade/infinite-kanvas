"use client";

import React, { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { X, MessageSquare } from "lucide-react";
import type { ChatMessage, ChatState } from "@/types/chat";
import { ChatHistory } from "./ChatHistory";
import { ChatInput } from "./ChatInput";

interface ChatInterfaceProps {
  isOpen: boolean;
  onToggle: () => void;
  className?: string;
}

export function ChatInterface({
  isOpen,
  onToggle,
  className,
}: ChatInterfaceProps) {
  const [chatState, setChatState] = useState<ChatState>({
    messages: [],
    isLoading: false,
    isTyping: false,
  });

  const handleSendMessage = useCallback(async (content: string) => {
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      content,
      role: "user",
      timestamp: new Date(),
    };

    setChatState((prev) => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isLoading: true,
    }));

    try {
      // TODO: Implement actual chat API call
      // For now, just add a mock response
      setTimeout(() => {
        const assistantMessage: ChatMessage = {
          id: `assistant-${Date.now()}`,
          content:
            "I understand you want help with your canvas. This is a placeholder response. Soon I'll be able to help you with image transformations!",
          role: "assistant",
          timestamp: new Date(),
        };

        setChatState((prev) => ({
          ...prev,
          messages: [...prev.messages, assistantMessage],
          isLoading: false,
        }));
      }, 1000);
    } catch (error) {
      console.error("Error sending message:", error);
      setChatState((prev) => ({
        ...prev,
        isLoading: false,
      }));
    }
  }, []);

  const handleStopGeneration = useCallback(() => {
    setChatState((prev) => ({
      ...prev,
      isLoading: false,
      isTyping: false,
    }));
  }, []);

  if (!isOpen) {
    return (
      <Button
        onClick={onToggle}
        variant="primary"
        className="fixed bottom-4 right-4 z-30 rounded-full h-12 w-12 p-0 shadow-lg"
      >
        <MessageSquare className="h-5 w-5" />
      </Button>
    );
  }

  return (
    <div
      className={cn(
        "fixed right-0 top-0 h-full w-96 bg-background border-l border-stroke-strong z-20",
        "flex flex-col shadow-xl",
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-stroke-strong bg-surface-alpha/50">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          <h2 className="font-heading font-medium text-content-strong">
            AI Assistant
          </h2>
        </div>
        <Button
          onClick={onToggle}
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Chat History */}
      <ChatHistory
        messages={chatState.messages}
        isLoading={chatState.isLoading}
        className="flex-1"
      />

      {/* Input */}
      <ChatInput
        onSendMessage={handleSendMessage}
        isLoading={chatState.isLoading}
        isTyping={chatState.isTyping}
        onStopGeneration={handleStopGeneration}
      />
    </div>
  );
}
