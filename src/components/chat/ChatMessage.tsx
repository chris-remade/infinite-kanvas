"use client";

import React from "react";
import { cn } from "@/lib/utils";
import {
  SpinnerIcon,
  CheckCircleIcon,
  AlertCircleIcon,
} from "@/components/icons";
import type { ChatMessage as ChatMessageType } from "@/types/chat";
import { FunctionCallDisplay } from "./FunctionCallDisplay";

interface ChatMessageProps {
  message: ChatMessageType;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";
  const isSystem = message.role === "system";

  return (
    <div
      className={cn(
        "flex w-full mb-4",
        isUser ? "justify-end" : "justify-start",
      )}
    >
      <div
        className={cn(
          "max-w-[80%] rounded-xl px-4 py-2 text-sm",
          isUser && "bg-primary text-white",
          !isUser &&
            !isSystem &&
            "bg-surface-alpha border border-stroke-strong text-content-strong",
          isSystem &&
            "bg-yellow-500/10 border border-yellow-500/20 text-yellow-700 dark:text-yellow-300",
        )}
      >
        {/* Message content */}
        <div className="whitespace-pre-wrap">{message.content}</div>

        {/* Function call display */}
        {message.functionCall && (
          <FunctionCallDisplay
            functionCall={message.functionCall}
            functionResult={message.functionResult}
          />
        )}

        {/* Timestamp */}
        <div
          className={cn(
            "text-xs mt-2 opacity-60",
            isUser ? "text-right" : "text-left",
          )}
        >
          {message.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
    </div>
  );
}
