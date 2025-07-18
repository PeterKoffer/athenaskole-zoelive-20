
import { Universe } from './UniverseGenerator';
import { openAIService } from './OpenAIService';

class AIUniverseGenerator {
    public loading: boolean = false;

    public async generateUniverse(prompt: string | any, signal?: AbortSignal): Promise<Universe | null> {
        console.log('🤖 AIUniverseGenerator: Starting generation...');
        this.loading = true;
        
        try {
            const universe = await openAIService.generateUniverse(prompt, signal);
            console.log('✅ AIUniverseGenerator: Successfully generated universe');
            return universe;
        } catch (error) {
            if (error.name === 'AbortError') {
                console.log('🛑 AIUniverseGenerator: Generation aborted');
                return null;
            }
            
            console.error('❌ AIUniverseGenerator: Error generating universe:', error);
            
            // Don't return null - let the error propagate so the user knows what went wrong
            throw error;
        } finally {
            this.loading = false;
        }
    }
}

export const aiUniverseGenerator = new AIUniverseGenerator();
