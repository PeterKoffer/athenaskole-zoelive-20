import OpenAI from 'openai';
import { Universe } from './UniverseGenerator';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
});

export const openAIService = {
  async generateUniverse(prompt: string): Promise<Universe> {
    const completion = await openai.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'gpt-3.5-turbo',
    });

    const content = completion.choices[0].message.content;
    if (!content) {
      throw new Error('No content received from OpenAI');
    }
    return JSON.parse(content);
  },
};
