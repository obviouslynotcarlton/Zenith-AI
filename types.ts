
export enum AIModel {
  GEMINI_FLASH = 'gemini-3-flash-preview',
  GEMINI_PRO = 'gemini-3-pro-preview',
  GEMINI_THINKING = 'gemini-3-pro-preview-thinking'
}

export type Role = 'user' | 'assistant' | 'system';

export interface Message {
  id: string;
  role: Role;
  content: string;
  model?: AIModel;
  timestamp: number;
}

export interface AppState {
  sidebarOpen: boolean;
  activeModel: AIModel;
  messages: Message[];
  isTyping: boolean;
  contextEnabled: boolean;
  pageContent: string;
}

export interface ModelResponse {
  content: string;
  model: AIModel;
}
