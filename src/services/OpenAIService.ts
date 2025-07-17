
import OpenAI from "openai";
import { Universe } from './UniverseGenerator';
import { supabase } from "@/integrations/supabase/client";

class OpenAIService {
  private openai: OpenAI | null = null;

  private async getOpenAI(): Promise<OpenAI> {
    if (!this.openai) {
      const { data, error } = await supabase.functions.invoke('elevenlabs-proxy', {
        method: 'POST',
        body: { action: 'get-openai-key' }
      });

      if (error) {
        throw new Error(`Failed to get OpenAI API key: ${error.message}`);
      }

      this.openai = new OpenAI({
        apiKey: data.apiKey,
        dangerouslyAllowBrowser: true
      });
    }
    return this.openai;
  }

  public async generateUniverse(prompt: string, signal?: AbortSignal): Promise<any> {
    try {
      const openai = await this.getOpenAI();
      
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a creative educational content generator. Always return valid JSON that matches the requested structure exactly. Be creative, engaging, and educational. Avoid repetitive themes and create truly unique content each time."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 2048,
        temperature: 0.9, // Higher temperature for more creativity
      }, { signal });

      const universeText = response.choices[0].message.content;
      if (!universeText) {
        throw new Error('No content generated from OpenAI');
      }

      try {
        // Clean the response to ensure it's valid JSON
        const cleanedText = universeText.replace(/```json\n?|\n?```/g, '').trim();
        const universe = JSON.parse(cleanedText);
        return universe;
      } catch (parseError) {
        console.error('Failed to parse OpenAI response as JSON:', universeText);
        console.error('Parse error:', parseError);
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
