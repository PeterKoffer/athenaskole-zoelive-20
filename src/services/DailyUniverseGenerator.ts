import { CurriculumNode } from '../types/curriculum/CurriculumNode';
import { openAIService } from './OpenAIService';

interface DailyUniverse {
    id: string;
    title: string;
    description: string;
    theme: string;
    objectives: CurriculumNode[];
    learningAtoms: any[];
}

class DailyUniverseGeneratorService {
    private getSubjectsForInterests(interests: string[]): string[] {
        if (!interests || interests.length === 0) {
            return ['Math', 'Science', 'Reading'];
        }
        return interests.slice(0, 3);
    }

    private getDifficultyForSubject(subject: string, progress: any): number {
        return progress[subject] || 1; // Default to level 1
    }

    public async generate(studentProfile: any): Promise<DailyUniverse> {
        try {
            const gradeLevel = studentProfile.gradeLevel || 4;
            const preferredLearningStyle = studentProfile.preferredLearningStyle || 'mixed';
            const subjects = this.getSubjectsForInterests(studentProfile.interests || []);
            const difficulty = this.getDifficultyForSubject(subjects[0], studentProfile.progress || {});

            // Generate universe using OpenAI
            const prompt = `Generate a daily learning universe for a grade ${gradeLevel} student with interests in ${subjects.join(', ')}. Create an engaging theme with learning objectives for ${preferredLearningStyle} learning style at difficulty level ${difficulty}.`;
            
            const aiResponse = await openAIService.generateUniverse(prompt);
            
            // Convert AI response to our format
            const objectives = this.createObjectivesFromResponse(aiResponse, subjects, gradeLevel);

            const universe: DailyUniverse = {
                id: `universe-${Date.now()}`,
                title: aiResponse.title || 'A Day of Discovery',
                description: aiResponse.description || 'Explore a variety of subjects and challenges to expand your knowledge.',
                theme: 'interdisciplinary',
                objectives: objectives,
                learningAtoms: [],
            };

            return universe;
        } catch (error) {
            console.error('Error generating daily universe:', error);
            // Return fallback universe
            return this.createFallbackUniverse(studentProfile);
        }
    }

    private createObjectivesFromResponse(aiResponse: any, subjects: string[], gradeLevel: number): CurriculumNode[] {
        const objectives: CurriculumNode[] = [];
        
        subjects.forEach((subject, index) => {
            objectives.push({
                id: `obj-${subject.toLowerCase()}-${Date.now()}-${index}`,
                nodeType: 'learning_objective',
                name: `${subject} Exploration`,
                description: `Engage with ${subject} concepts through interactive activities and challenges.`,
                subjectName: subject,
                educationalLevel: `Grade ${gradeLevel}`,
            });
        });

        return objectives;
    }

    private createFallbackUniverse(studentProfile: any): DailyUniverse {
        const gradeLevel = studentProfile.gradeLevel || 4;
        const subjects = this.getSubjectsForInterests(studentProfile.interests || []);
        
        return {
            id: `fallback-universe-${Date.now()}`,
            title: 'Learning Adventure',
            description: 'Embark on an educational journey across multiple subjects.',
            theme: 'adventure',
            objectives: this.createObjectivesFromResponse({}, subjects, gradeLevel),
            learningAtoms: [],
        };
    }
}

export const dailyUniverseGenerator = new DailyUniverseGeneratorService();
