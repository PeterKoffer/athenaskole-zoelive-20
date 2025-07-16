
import { Universe } from './UniverseGenerator';

export const AIUniverseGenerator = {
    generateUniverse: async (prompt: string): Promise<Universe> => {
        // Use environment variable for API key instead of hardcoding
        const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
        
        if (!apiKey) {
            console.warn('OpenAI API key not found, using mock generation');
            return mockGeneration(prompt);
        }

        try {
            // In a real implementation, this would call OpenAI API
            // For now, return enhanced mock version based on the prompt
            const baseUniverse: Universe = {
                id: Math.random().toString(36).substr(2, 9),
                title: 'AI Generated Adventure',
                description: prompt,
                characters: ['You', 'AI Generated Character'],
                locations: ['Generated Location'],
                activities: ['AI suggested activity based on interests']
            };

            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            return baseUniverse;
        } catch (error) {
            console.error('AI generation failed, falling back to mock:', error);
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
