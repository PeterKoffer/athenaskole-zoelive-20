import OpenAI from 'openai';
import { Universe } from './UniverseGenerator';

const openai = new OpenAI({
    apiKey: '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',
    dangerouslyAllowBrowser: true
});

export const AIUniverseGenerator = {
    generateUniverse: async (prompt: string): Promise<Universe> => {
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'system',
                    content: 'You are a creative and engaging storyteller for children. Your task is to generate a short, one-paragraph story that can be used as a "Universe" in an educational application. The story should be imaginative, age-appropriate, and have a clear theme or problem that can be used as a basis for educational activities. The story should have a title and a description. The output should be a JSON object with the following format: {"title": "...", "description": "..."}'
                },
                {
                    role: 'user',
                    content: prompt
                }
            ]
        });

        const content = response.choices[0].message.content;
        if (!content) {
            throw new Error('No content returned from the API');
        }

        const universeData = JSON.parse(content);

        return {
            id: `ai-${Date.now()}`,
            ...universeData
        };
    }
};
