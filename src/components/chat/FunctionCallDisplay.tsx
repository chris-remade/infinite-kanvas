"use client";

import React from "react";
import { cn } from "@/lib/utils";
import {
  SpinnerIcon,
  CheckCircleIcon,
  AlertCircleIcon,
} from "@/components/icons";
import type { FunctionCall, FunctionResult } from "@/types/chat";

interface FunctionCallDisplayProps {
  functionCall: FunctionCall;
  functionResult?: FunctionResult;
}

export function FunctionCallDisplay({
  functionCall,
  functionResult,
}: FunctionCallDisplayProps) {
  const getStatusIcon = () => {
    switch (functionCall.status) {
      case "pending":
      case "executing":
        return <SpinnerIcon className="h-4 w-4 animate-spin" />;
      case "completed":
        return <CheckCircleIcon className="h-4 w-4 text-green-500" />;
      case "error":
        return <AlertCircleIcon className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusText = () => {
    switch (functionCall.status) {
      case "pending":
        return "Preparing...";
      case "executing":
        return "Processing...";
      case "completed":
        return "Completed";
      case "error":
        return "Error";
      default:
        return "";
    }
  };

  return (
    <div className="mt-3 p-3 bg-surface-alpha/50 rounded-lg border border-stroke-strong">
      {/* Function call header */}
      <div className="flex items-center gap-2 mb-2">
        {getStatusIcon()}
        <span className="font-medium text-sm">{functionCall.name}</span>
        <span className="text-xs text-content-lighter">{getStatusText()}</span>
      </div>

      {/* Parameters */}
      {Object.keys(functionCall.parameters).length > 0 && (
        <div className="text-xs text-content-lighter mb-2">
          <strong>Parameters:</strong>
          <pre className="mt-1 text-xs font-mono bg-surface-alpha/30 p-2 rounded overflow-x-auto">
            {JSON.stringify(functionCall.parameters, null, 2)}
          </pre>
        </div>
      )}

      {/* Result */}
      {functionResult && (
        <div className="text-xs">
          {functionResult.success ? (
            <div className="text-green-600 dark:text-green-400">
              ✓ Operation completed successfully
              {functionResult.imageUrl && (
                <div className="mt-2">
                  <img
                    src={functionResult.imageUrl}
                    alt="Result"
                    className="max-w-full h-auto rounded border"
                    style={{ maxHeight: "200px" }}
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="text-red-600 dark:text-red-400">
              ✗ Error: {functionResult.error}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
