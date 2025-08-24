"use client";

import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import type { ChatMessage as ChatMessageType } from "@/types/chat";
import { ChatMessage } from "./ChatMessage";

interface ChatHistoryProps {
  messages: ChatMessageType[];
  isLoading?: boolean;
  className?: string;
}

export function ChatHistory({
  messages,
  isLoading = false,
  className,
}: ChatHistoryProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <div className={cn("flex-1 overflow-y-auto p-4 space-y-2", className)}>
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full text-center">
          <div className="max-w-sm">
            <div className="text-content-lighter mb-2">
              Welcome to AI Canvas Assistant!
            </div>
            <div className="text-sm text-content-lighter/80">
              I can help you with:
              <ul className="mt-2 space-y-1 text-left">
                <li>• Remove backgrounds from images</li>
                <li>• Isolate objects from photos</li>
                <li>• Apply artistic styles</li>
                <li>• Generate new images</li>
                <li>• Create videos from images</li>
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <>
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-surface-alpha border border-stroke-strong rounded-xl px-4 py-2">
                <div className="flex items-center gap-2 text-content-lighter">
                  <div className="flex gap-1">
                    <div className="w-1 h-1 bg-current rounded-full animate-pulse" />
                    <div className="w-1 h-1 bg-current rounded-full animate-pulse delay-75" />
                    <div className="w-1 h-1 bg-current rounded-full animate-pulse delay-150" />
                  </div>
                  Thinking...
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </>
      )}
    </div>
  );
}
