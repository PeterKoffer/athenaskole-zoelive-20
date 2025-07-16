
import { Universe } from './UniverseGenerator';
import { openAIService } from './OpenAIService';

export const AIUniverseGenerator = {
    generateUniverse: async (prompt: string): Promise<Universe> => {
        const universe = await openAIService.generateUniverse(prompt);
        return universe;
    }
};
