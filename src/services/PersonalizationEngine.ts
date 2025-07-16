
import { Universe } from './UniverseGenerator';
import { StudentProfile } from '../types/student';

export const PersonalizationEngine = {
    personalizeUniverse: async (universe: Universe, student: StudentProfile): Promise<Universe> => {
        // Enhanced personalization logic
        const personalizedUniverse: Universe = {
            ...universe,
            description: `${universe.description} This adventure is specially designed for ${student.name}, who loves ${student.interests.join(' and ')}.`
        };

        // Add personalized activities based on interests
        if (student.interests.includes('space')) {
            personalizedUniverse.activities.push('Explore the cosmos and learn about planets');
        }
        
        if (student.interests.includes('dinosaurs')) {
            personalizedUniverse.activities.push('Discover ancient creatures and fossils');
        }

        // Adjust difficulty based on abilities
        if (student.abilities.math === 'advanced') {
            personalizedUniverse.activities.push('Solve complex mathematical puzzles');
        } else if (student.abilities.math === 'beginner') {
            personalizedUniverse.activities.push('Practice basic math concepts through fun games');
        }

        // Add grade-appropriate content
        if (student.gradeLevel <= 5) {
            personalizedUniverse.activities.push('Interactive storytelling and creative expression');
        } else {
            personalizedUniverse.activities.push('Critical thinking challenges and problem-solving');
        }

        // Simulate processing time for realistic experience
        await new Promise(resolve => setTimeout(resolve, 100));

        return personalizedUniverse;
    },

    getPersonalizationSuggestions: (student: StudentProfile): string[] => {
        const suggestions = [];
        
        suggestions.push(`Incorporate ${student.interests.join(' and ')} themes`);
        suggestions.push(`Adjust difficulty for grade ${student.gradeLevel}`);
        
        if (student.abilities.math) {
            suggestions.push(`Include ${student.abilities.math}-level math activities`);
        }

        return suggestions;
    },

    adaptContentDifficulty: (content: any, targetLevel: string): any => {
        // Adapt content difficulty based on student level
        return {
            ...content,
            difficulty: targetLevel,
            adaptedFor: 'student_level'
        };
    }
};
