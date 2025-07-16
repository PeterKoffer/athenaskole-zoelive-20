import { CurriculumNode } from '../types/curriculum/CurriculumNode';
import { OpenAIService } from './OpenAIService';

interface DailyUniverse {
    title: string;
    description: string;
    objectives: CurriculumNode[];
}

class DailyUniverseGeneratorService {
    async generate(studentProfile: any): Promise<DailyUniverse> {
        const openAIService = OpenAIService.getInstance();
        const prompt = `Generate a daily universe for a student with the following profile: ${JSON.stringify(studentProfile)}. The universe should have a title, a description, and a list of three learning objectives. The learning objectives should be in the following format: { "id": "string", "nodeType": "learning_objective", "name": "string", "description": "string", "subjectName": "string", "educationalLevel": "string" }`;
        const universe = await openAIService.generateUniverse(prompt);
        return universe;
    }
}

export const dailyUniverseGenerator = new DailyUniverseGeneratorService();
