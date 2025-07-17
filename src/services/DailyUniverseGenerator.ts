
import { CurriculumNode } from '../types/curriculum/CurriculumNode';
import { openAIService } from './OpenAIService';

interface DailyUniverse {
    id: string;
    title?: string;
    description?: string;
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

    private createMockObjectives(): CurriculumNode[] {
        return [
            {
                id: '1',
                name: 'Mathematical Problem Solving',
                description: 'Solve real-world and mathematical problems by writing and solving equations of the form x + p = q and px = q for cases in which p, q and x are all nonnegative rational numbers.',
                subjectName: 'Math',
                educationalLevel: 'Grade 6',
            },
            {
                id: '2',
                name: 'Reading Comprehension',
                description: 'Analyze literary texts to understand character development, theme, and plot structure.',
                subjectName: 'Language Arts',
                educationalLevel: 'Grade 6',
            },
            {
                id: '3',
                name: 'Scientific Method',
                description: 'Apply the scientific method to design and conduct experiments, analyze data, and draw conclusions.',
                subjectName: 'Science',
                educationalLevel: 'Grade 6',
            }
        ];
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

            const universe: DailyUniverse = {
                id: `universe-${Date.now()}`,
                title: aiResponse?.title || 'A Day of Discovery',
                description: aiResponse?.description || 'Explore a variety of subjects and challenges to expand your knowledge.',
                theme: 'interdisciplinary',
                objectives: this.createMockObjectives(),
                learningAtoms: [],
            };

            return universe;
        } catch (error) {
            console.error('Error generating daily universe:', error);
            // Return fallback universe
            return this.createFallbackUniverse();
        }
    }

    private createFallbackUniverse(): DailyUniverse {
        return {
            id: `fallback-universe-${Date.now()}`,
            title: 'Learning Adventure',
            description: 'Embark on an educational journey across multiple subjects.',
            theme: 'adventure',
            objectives: this.createMockObjectives(),
            learningAtoms: [],
        };
    }
}

export const dailyUniverseGenerator = new DailyUniverseGeneratorService();
