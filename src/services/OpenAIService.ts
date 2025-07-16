
import OpenAI from "openai";
import { Universe } from './UniverseGenerator';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

class OpenAIService {
  public async generateUniverse(prompt: string, signal?: AbortSignal): Promise<Universe> {
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
  }
}

export const openAIService = new OpenAIService();
