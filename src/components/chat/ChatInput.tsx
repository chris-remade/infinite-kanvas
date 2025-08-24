"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Square } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
  isTyping?: boolean;
  onStopGeneration?: () => void;
  disabled?: boolean;
}

export function ChatInput({
  onSendMessage,
  isLoading = false,
  isTyping = false,
  onStopGeneration,
  disabled = false,
}: ChatInputProps) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading && !disabled) {
      onSendMessage(message.trim());
      setMessage("");
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  return (
    <div className="border-t border-stroke-strong bg-background p-4">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            disabled
              ? "Chat is disabled"
              : "Ask me to transform images, remove backgrounds, or generate content..."
          }
          disabled={disabled}
          className={cn(
            "flex-1 resize-none min-h-[44px] max-h-32",
            "border-stroke-strong focus:border-primary",
            "placeholder:text-content-lighter",
          )}
          rows={1}
        />

        {isLoading || isTyping ? (
          <Button
            type="button"
            onClick={onStopGeneration}
            variant="secondary"
            size="sm"
            className="px-3 self-end"
          >
            <Square className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            type="submit"
            disabled={!message.trim() || disabled}
            variant="primary"
            size="sm"
            className="px-3 self-end"
          >
            <Send className="h-4 w-4" />
          </Button>
        )}
      </form>

      {isTyping && (
        <div className="flex items-center gap-2 mt-2 text-sm text-content-lighter">
          <div className="flex gap-1">
            <div className="w-1 h-1 bg-current rounded-full animate-pulse" />
            <div className="w-1 h-1 bg-current rounded-full animate-pulse delay-75" />
            <div className="w-1 h-1 bg-current rounded-full animate-pulse delay-150" />
          </div>
          AI is thinking...
        </div>
      )}
    </div>
  );
}
