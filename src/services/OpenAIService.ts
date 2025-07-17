
import { Universe } from './UniverseGenerator';

interface UniverseResponse {
  title: string;
  description: string;
}

class OpenAIService {
  public async generateUniverse(prompt: string, signal?: AbortSignal): Promise<UniverseResponse | null> {
    console.log('🤖 OpenAI Service: Generating universe...');
    
    try {
      // For now, return a mock response since we don't have OpenAI configured
      console.log('⚠️ OpenAI not configured, using fallback response');
      
      // Simulate AI processing delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockTitles = [
        "The Great Learning Adventure",
        "Mystery of the Hidden Knowledge",
        "Quest for Wisdom",
        "The Learning Galaxy Explorer",
        "Adventures in Discovery Land"
      ];
      
      const mockDescriptions = [
        "Embark on an exciting journey where every challenge unlocks new knowledge and skills!",
        "Solve mysteries and discover amazing facts as you explore different subjects.",
        "Join a thrilling quest that combines learning with adventure and fun!",
        "Navigate through galaxies of knowledge and become a master learner.",
        "Explore magical lands where learning becomes the greatest adventure of all!"
      ];
      
      return {
        title: mockTitles[Math.floor(Math.random() * mockTitles.length)],
        description: mockDescriptions[Math.floor(Math.random() * mockDescriptions.length)]
      };
    } catch (error) {
      console.error('❌ OpenAI Service error:', error);
      return null;
    }
  }
}

export const openAIService = new OpenAIService();
