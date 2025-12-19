
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { AIModel } from '../types';
import { SYSTEM_INSTRUCTIONS } from '../constants';

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async generateResponse(
    model: AIModel,
    prompt: string,
    context?: string,
    systemPrompt: string = SYSTEM_INSTRUCTIONS.GENERAL
  ): Promise<string> {
    const fullPrompt = context 
      ? `CONTEXT FROM PAGE:\n${context}\n\nUSER PROMPT:\n${prompt}`
      : prompt;

    const config: any = {
      systemInstruction: systemPrompt,
    };

    // If using thinking variant, we apply thinking budget
    if (model === AIModel.GEMINI_THINKING) {
      config.thinkingConfig = { thinkingBudget: 16000 };
    }

    try {
      const response: GenerateContentResponse = await this.ai.models.generateContent({
        model: model === AIModel.GEMINI_THINKING ? AIModel.GEMINI_PRO : model,
        contents: [{ parts: [{ text: fullPrompt }] }],
        config: config
      });

      return response.text || "I'm sorry, I couldn't generate a response.";
    } catch (error) {
      console.error("Gemini API Error:", error);
      throw error;
    }
  }

  async *generateStream(
    model: AIModel,
    prompt: string,
    context?: string,
    systemPrompt: string = SYSTEM_INSTRUCTIONS.GENERAL
  ) {
    const fullPrompt = context 
      ? `CONTEXT FROM PAGE:\n${context}\n\nUSER PROMPT:\n${prompt}`
      : prompt;

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
      yield "Error generating response.";
    }
  }
}

export const geminiService = new GeminiService();
