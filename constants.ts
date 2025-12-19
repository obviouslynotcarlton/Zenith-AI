
import { AIModel } from './types';

export const SYSTEM_INSTRUCTIONS = {
  GENERAL: "You are Zenith, a sophisticated AI assistant integrated into the user's browser. You provide concise, accurate, and context-aware assistance.",
  SLANG_AWARE: "You are Zenith, a cool and localized AI assistant. You understand Sheng (Kenyan urban slang) and local East African context. Respond with a friendly, local vibe while maintaining high-quality information.",
  SUMMARIZER: "You are a specialized document analyst. Your goal is to extract the core 'Semantic Core' of any provided text, removing junk and presenting the most critical insights in bullet points."
};

export const MODEL_DISPLAY_NAMES: Record<AIModel, string> = {
  [AIModel.GEMINI_FLASH]: 'Gemini 3 Flash (Fast)',
  [AIModel.GEMINI_PRO]: 'Gemini 3 Pro (Smart)',
  [AIModel.GEMINI_THINKING]: 'Gemini 3 Thinking (Deep)'
};

export const AVATAR_URLS = {
  USER: 'https://picsum.photos/seed/user123/100/100',
  ZENITH: 'https://picsum.photos/seed/zenith-ai/100/100'
};
