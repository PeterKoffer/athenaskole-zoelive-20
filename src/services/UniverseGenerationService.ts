import { CurriculumNode } from '../types/curriculum/CurriculumNode';
import { openAIService } from './OpenAIService';
import { NELIESubject } from '../types/curriculum/NELIESubjects';

interface DailyUniverse {
    id: string;
    title?: string;
    description?: string;
    theme: string;
    objectives: CurriculumNode[];
    learningAtoms: any[];
}

import curriculumSteps from '../../public/data/curriculum-steps.json';

class UniverseGenerationService {
    private themes = [
        {
            narrative: "You have to travel to China to help a man in his store.",
            subjects: [NELIESubject.GEOGRAPHY, NELIESubject.WORLD_LANGUAGES, NELIESubject.MATH]
        },
        {
            narrative: "All the power is out in your home, and you need to fix it.",
            subjects: [NELIESubject.SCIENCE, NELIESubject.MATH, NELIESubject.LIFE_ESSENTIALS]
        },
        {
            narrative: "Your local mall needs a sporting goods store, and you will open it.",
            subjects: [NELIESubject.MATH, NELIESubject.CREATIVE_ARTS, NELIESubject.PHYSICAL_EDUCATION]
        },
        {
            narrative: "Two cars crashed outside your house this morning, and you need to help the police with the investigation.",
            subjects: [NELIESubject.SCIENCE, NELIESubject.MATH, NELIESubject.LIFE_ESSENTIALS]
        }
    ];

    private getCurriculumObjectives(gradeLevel: number, subjects: NELIESubject[]): CurriculumNode[] {
        const gradeMap = {
            1: "1", 2: "2", 3: "3", 4: "4", 5: "5", 6: "6",
            7: "7", 8: "8", 9: "9", 10: "10", 11: "11", 12: "12"
        };
        const stepId = gradeMap[gradeLevel] || "1";

        const relevantStep = curriculumSteps.find(step => step.id === stepId);
        if (!relevantStep) {
            return [];
        }

        return relevantStep.curriculums
            .filter(curriculum => subjects.includes(curriculum.subject as NELIESubject))
            .map(curriculum => ({
                id: curriculum.id,
                name: curriculum.title,
                description: curriculum.description,
                subjectName: curriculum.subject,
                educationalLevel: `Grade ${gradeLevel}`
            }));
    }

    public async generate(studentProfile: any): Promise<DailyUniverse> {
        const themeData = this.themes[Math.floor(Math.random() * this.themes.length)];
        const { narrative, subjects } = themeData;
        const gradeLevel = studentProfile.gradeLevel || 4;
        const preferredLearningStyle = studentProfile.preferredLearningStyle || 'mixed';
        const objectives = this.getCurriculumObjectives(gradeLevel, subjects);

        const prompt = `
            Generate a daily learning universe for a grade ${gradeLevel} student.
            The theme of the universe is: "${narrative}".
            The student's preferred learning style is ${preferredLearningStyle}.
            Create a title and a short, engaging description for this universe.
            The universe should integrate the following learning objectives:
            ${objectives.map(obj => `- ${obj.name}: ${obj.description}`).join('\n')}
        `;

        try {
            const aiResponse = await openAIService.generateUniverse(prompt);

            const universe: DailyUniverse = {
                id: `universe-${Date.now()}`,
                title: aiResponse?.title || 'A Day of Discovery',
                description: aiResponse?.description || 'Explore a variety of subjects and challenges to expand your knowledge.',
                theme: narrative,
                objectives: objectives,
                learningAtoms: [],
            };

            return universe;
        } catch (error) {
            console.error('Error generating daily universe:', error);
            // Return fallback universe
            return this.createFallbackUniverse(narrative, objectives);
        }
    }

    private createFallbackUniverse(theme: string, objectives: CurriculumNode[]): DailyUniverse {
        return {
            id: `fallback-universe-${Date.now()}`,
            title: 'Learning Adventure',
            description: 'Embark on an educational journey across multiple subjects.',
            theme: theme,
            objectives: objectives,
            learningAtoms: [],
        };
    }
}

export const universeGenerationService = new UniverseGenerationService();
