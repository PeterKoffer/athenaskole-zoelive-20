
import { Universe } from './UniverseGenerator';
import { openAIService } from './OpenAIService';

class AIUniverseGenerator {
    public loading: boolean = false;

    public async generateUniverse(prompt: string, signal?: AbortSignal): Promise<Universe | null> {
        this.loading = true;
        try {
            const universe = await openAIService.generateUniverse(prompt, signal);
            return universe;
        } catch (error) {
            if (error.name === 'AbortError') {
                console.log('Universe generation aborted');
                return null;
            }
            console.error('Error generating universe:', error);
            return null;
        } finally {
            this.loading = false;
        }
    }
}

export const aiUniverseGenerator = new AIUniverseGenerator();
