import OpenAI from "openai";
import { Universe } from './UniverseGenerator';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

class OpenAIService {
  public async generateUniverse(prompt: string, signal?: AbortSignal): Promise<Universe> {
    const response = await openai.completions.create({
      model: "text-davinci-003",
      prompt: prompt,
      max_tokens: 2048,
      temperature: 0.7,
    }, { signal });

    const universe = JSON.parse(response.choices[0].text);
    return universe;
  }
}

export const openAIService = new OpenAIService();
