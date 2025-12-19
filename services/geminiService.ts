
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { AIModel } from '../types';
import { SYSTEM_INSTRUCTIONS, SHENG_DICTIONARY } from '../constants';

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  private injectLexicalHints(prompt: string): string {
    const detectedSlang: string[] = [];
    const lowerPrompt = prompt.toLowerCase();

    Object.entries(SHENG_DICTIONARY).forEach(([word, definition]) => {
      if (lowerPrompt.includes(word.toLowerCase())) {
        detectedSlang.push(`"${word}" (${definition})`);
      }
    });

    if (detectedSlang.length === 0) return "";
    return `\n\n[LEXICAL HINTS DETECTED]: ${detectedSlang.join(", ")}`;
  }

  async *generateStream(
    model: AIModel,
    prompt: string,
    context?: string,
    systemPrompt: string = SYSTEM_INSTRUCTIONS.GENERAL
  ) {
    const lexicalHints = this.injectLexicalHints(prompt);
    
    const fullPrompt = context 
      ? `CONTEXT FROM PAGE:\n${context}\n\nUSER PROMPT:\n${prompt}${lexicalHints}`
      : `${prompt}${lexicalHints}`;

    const config: any = {
      systemInstruction: systemPrompt,
    };

    if (model === AIModel.GEMINI_THINKING) {
      config.thinkingConfig = { thinkingBudget: 16000 };
    }

    try {
      const responseStream = await this.ai.models.generateContentStream({
        model: model === AIModel.GEMINI_THINKING ? AIModel.GEMINI_PRO : model,
        contents: [{ parts: [{ text: fullPrompt }] }],
        config: config
      });

      for await (const chunk of responseStream) {
        yield chunk.text || "";
      }
    } catch (error) {
      console.error("Gemini Stream Error:", error);
      yield "Error generating response. Check your API key or connection.";
    }
  }
}

export const geminiService = new GeminiService();
