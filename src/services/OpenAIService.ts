
import OpenAI from "openai";
import { Universe } from './UniverseGenerator';

class OpenAIService {
  private openai: OpenAI | null = null;

  private async getOpenAI(): Promise<OpenAI> {
    if (!this.openai) {
      // In production with Supabase, we'll get the API key from edge functions
      // For now, we'll use a placeholder that shows the proper error
      const apiKey = import.meta.env.VITE_OPENAI_API_KEY || 'placeholder';
      
      if (apiKey === 'placeholder') {
        throw new Error('OpenAI API key not configured. Please set up the OPENAI_API_KEY in Supabase secrets.');
      }

      this.openai = new OpenAI({
        apiKey: apiKey,
        dangerouslyAllowBrowser: true
      });
    }
    return this.openai;
  }

  public async generateUniverse(prompt: string, signal?: AbortSignal): Promise<Universe> {
    try {
      const openai = await this.getOpenAI();
      
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a creative universe generator. Generate a detailed universe based on the user's prompt. Return only valid JSON with the structure: {title: string, description: string, characters: string[], locations: string[], activities: string[]}"
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 2048,
        temperature: 0.7,
      }, { signal });

      const universeText = response.choices[0].message.content;
      if (!universeText) {
        throw new Error('No content generated from OpenAI');
      }

      try {
        const universe = JSON.parse(universeText);
        return universe;
      } catch (error) {
        console.error('Failed to parse OpenAI response as JSON:', universeText);
        throw new Error('Failed to parse universe data');
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        throw error;
      }
      console.error('OpenAI API Error:', error);
      throw new Error(`OpenAI service unavailable: ${error.message}`);
    }
  }
}

export const openAIService = new OpenAIService();
