
import { Universe } from './UniverseGenerator';
import { openAIService } from './OpenAIService';

export const AIUniverseGenerator = {
    generateUniverse: async (prompt: string): Promise<Universe> => {
        try {
            const universe = await openAIService.generateUniverse(prompt);
            return universe;
        } catch (error) {
            console.error('AI Universe generation failed:', error);
            return mockGeneration(prompt);
        }
    }
};

function mockGeneration(prompt: string): Universe {
    return {
        id: Math.random().toString(36).substr(2, 9),
        title: 'Generated Adventure',
        description: prompt || 'An exciting learning adventure awaits!',
        characters: ['You', 'Adventure Guide'],
        locations: ['Learning Hub'],
        activities: ['Interactive challenges', 'Knowledge exploration']
    };
}
