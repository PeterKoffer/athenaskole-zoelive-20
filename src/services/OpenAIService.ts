import { Configuration, OpenAIApi } from "@openai/api";
import { Universe } from './UniverseGenerator';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

class OpenAIService {
  public async generateUniverse(prompt: string, signal?: AbortSignal): Promise<Universe> {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: prompt,
      max_tokens: 2048,
      temperature: 0.7,
    }, { signal });

    const universe = JSON.parse(response.data.choices[0].text);
    return universe;
  }
}

export const openAIService = new OpenAIService();
