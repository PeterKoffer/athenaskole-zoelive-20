import { Universe } from './UniverseGenerator';
import { StudentProfile } from '../types/student';
import { AIUniverseGenerator } from './AIUniverseGenerator';

export const PersonalizationEngine = {
    personalizeUniverse: async (universe: Universe, student: StudentProfile): Promise<Universe> => {
        const prompt = `${universe.description} The story should incorporate the following interests: ${student.interests.join(', ')}.`;
        const personalizedUniverse = await AIUniverseGenerator.generateUniverse(prompt);
        return personalizedUniverse;
    }
};
