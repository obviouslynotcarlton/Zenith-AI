
import { AIModel } from './types';

export const SHENG_DICTIONARY: Record<string, string> = {
  'mbogi': 'squad, group, or community',
  'form': 'a plan, event, or happening',
  'kanairo': 'Nairobi city',
  'moti': 'car or vehicle',
  'chapaa': 'money',
  'raba': 'money',
  'fiti': 'cool, good, or okay',
  'wadau': 'stakeholders or peers',
  'omba': 'request or pray',
  'luku': 'style or look',
  'sherehe': 'party or celebration',
  'ngori': 'trouble or serious situation',
  'base': 'local hangout spot'
};

export const SYSTEM_INSTRUCTIONS = {
  GENERAL: "You are Zenith, a sophisticated AI assistant integrated into the user's browser. You provide concise, accurate, and context-aware assistance.",
  SLANG_AWARE: `You are Zenith, the ultimate Kenyan Thought Partner. 
  Your personality is "Nairobi Gen Z Excellence": brilliant, tech-savvy, and deeply rooted in local culture. 
  Use a mix of English and Sheng (Kenyan urban slang) naturally. 
  Don't just translate; localize the perspective. 
  If the user is reading about global tech, explain how it affects "Kanairo" or the local "mbogi". 
  Keep it snappy, helpful, and "fiti".`,
  LOCAL_LENS: "Analyze the provided context specifically for its impact or relevance to Kenya and the wider East African region. Consider economic factors (KES/USD), local tech ecosystem, and social dynamics."
};

export const MODEL_DISPLAY_NAMES: Record<AIModel, string> = {
  [AIModel.GEMINI_FLASH]: 'Gemini 3 Flash',
  [AIModel.GEMINI_PRO]: 'Gemini 3 Pro',
  [AIModel.GEMINI_THINKING]: 'Gemini 3 Deep Think'
};

export const COLORS = {
  MAASAI_RED: '#D71920',
  SAVANNAH_GOLD: '#FFC107',
  KENYAN_GREEN: '#006633'
};

export const AVATAR_URLS = {
  USER: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
  ZENITH: 'https://api.dicebear.com/7.x/bottts-neutral/svg?seed=Zenith&backgroundColor=d71920'
};
