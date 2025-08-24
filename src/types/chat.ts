export interface ChatMessage {
  id: string;
  content: string;
  role: "user" | "assistant" | "system";
  timestamp: Date;
  functionCall?: FunctionCall;
  functionResult?: FunctionResult;
}

export interface FunctionCall {
  name: string;
  parameters: Record<string, any>;
  status: "pending" | "executing" | "completed" | "error";
}

export interface FunctionResult {
  success: boolean;
  data?: any;
  error?: string;
  imageUrl?: string;
  videoUrl?: string;
}

export interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  isTyping: boolean;
}
