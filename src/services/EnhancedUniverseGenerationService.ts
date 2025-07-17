
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

class EnhancedUniverseGenerationService {
    private getCurriculumObjectives(gradeLevel: number, subjects: NELIESubject[]): CurriculumNode[] {
        const gradeMap = {
            1: "1", 2: "2", 3: "3", 4: "4", 5: "5", 6: "6",
            7: "7", 8: "8", 9: "9", 10: "10", 11: "11", 12: "12"
        };
        const stepId = gradeMap[gradeLevel] || "4";

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

    private async generateAIObjectives(gradeLevel: number, universeContext: any, baseObjectives: CurriculumNode[]): Promise<CurriculumNode[]> {
        if (baseObjectives.length === 0) return [];

        const prompt = `
            Create engaging, contextual learning objectives for a grade ${gradeLevel} student based on this universe:
            
            Title: ${universeContext.title}
            Theme: ${universeContext.theme}
            Setting: ${universeContext.setting}
            Main Character: ${universeContext.mainCharacter}
            Conflict: ${universeContext.conflict}
            
            Transform these base curriculum objectives into exciting, story-driven challenges:
            ${baseObjectives.map((obj, i) => `${i + 1}. ${obj.name} (${obj.subjectName}): ${obj.description}`).join('\n')}
            
            For each objective, create:
            - A thrilling, story-based title that connects to the universe
            - An engaging description that makes learning feel like an adventure
            - Keep the same subject and educational level
            
            Return as JSON array with this structure:
            [
              {
                "id": "original_id",
                "name": "Exciting story-based title",
                "description": "Adventure description that incorporates learning",
                "subjectName": "original_subject",
                "educationalLevel": "Grade X"
              }
            ]
        `;

        try {
            const response = await openAIService.generateUniverse(prompt);
            if (Array.isArray(response)) {
                return response.map(obj => ({
                    ...obj,
                    id: obj.id || `enhanced-${Date.now()}-${Math.random().toString(36).substring(7)}`
                }));
            }
            return baseObjectives;
        } catch (error) {
            console.error('Error generating AI objectives:', error);
            return baseObjectives;
        }
    }

    public async generate(studentProfile: any): Promise<DailyUniverse> {
        const gradeLevel = studentProfile.gradeLevel || 4;
        const preferredLearningStyle = studentProfile.preferredLearningStyle || 'mixed';
        
        // Step 1: Generate a completely unique universe with AI
        const universePrompt = `
            Create a completely unique and engaging learning universe for a grade ${gradeLevel} student.
            Learning style preference: ${preferredLearningStyle}
            
            Generate a fresh, original adventure scenario that hasn't been used before. Include:
            
            1. A captivating title that sounds like an exciting adventure
            2. An immersive setting (could be fantasy, sci-fi, historical, modern-day, etc.)
            3. A main character the student can relate to
            4. An interesting conflict or challenge that needs solving
            5. A theme that naturally incorporates learning opportunities
            6. An engaging description that makes the student excited to participate
            
            Make it feel like the beginning of an epic story where learning happens naturally through adventure.
            Avoid common clichés like "save the world" or "magical kingdom" unless you can make them truly unique.
            
            Return as JSON with this exact structure:
            {
              "title": "Adventure title",
              "theme": "Brief theme description", 
              "setting": "Detailed setting description",
              "mainCharacter": "Character description",
              "conflict": "Main challenge/conflict",
              "description": "Immersive adventure description that excites students",
              "subjects": ["Mathematics", "Science", "Geography"]
            }
        `;

        try {
            console.log('🎯 Generating completely AI-driven universe...');
            const aiUniverse = await openAIService.generateUniverse(universePrompt);
            
            // Step 2: Get relevant subjects from AI response
            const subjects = (aiUniverse.subjects || ['Mathematics', 'Science']).map(subject => {
                // Map to NELIE subjects
                const subjectMap = {
                    'Mathematics': NELIESubject.MATH,
                    'Math': NELIESubject.MATH,
                    'Science': NELIESubject.SCIENCE,
                    'Geography': NELIESubject.GEOGRAPHY,
                    'English': NELIESubject.ENGLISH,
                    'Language': NELIESubject.ENGLISH,
                    'Arts': NELIESubject.CREATIVE_ARTS,
                    'Physical Education': NELIESubject.PHYSICAL_EDUCATION,
                    'Life Skills': NELIESubject.LIFE_ESSENTIALS
                };
                return subjectMap[subject] || NELIESubject.MATH;
            });

            // Step 3: Get base curriculum objectives
            const baseObjectives = this.getCurriculumObjectives(gradeLevel, subjects.slice(0, 3));
            
            // Step 4: Transform objectives with AI to match the universe
            const enhancedObjectives = await this.generateAIObjectives(gradeLevel, aiUniverse, baseObjectives);

            const universe: DailyUniverse = {
                id: `ai-universe-${Date.now()}`,
                title: aiUniverse.title || 'Your AI-Generated Adventure',
                description: aiUniverse.description || 'Embark on a completely unique learning adventure!',
                theme: aiUniverse.theme || 'AI-Generated Learning Quest',
                objectives: enhancedObjectives,
                learningAtoms: [],
            };

            console.log('✨ AI-Generated Universe Created:', {
                title: universe.title,
                theme: universe.theme,
                objectiveCount: enhancedObjectives.length,
                setting: aiUniverse.setting,
                conflict: aiUniverse.conflict
            });

            return universe;

        } catch (error) {
            console.error('Error generating AI universe:', error);
            // Return a completely AI-generated fallback
            return this.createAIFallbackUniverse(gradeLevel);
        }
    }

    private async createAIFallbackUniverse(gradeLevel: number): Promise<DailyUniverse> {
        const fallbackPrompt = `
            Create a simple but engaging learning adventure for grade ${gradeLevel} students.
            Make it creative and fun, avoiding common educational clichés.
            
            Return as JSON:
            {
              "title": "Creative adventure title",
              "description": "Fun adventure description",
              "theme": "Adventure theme"
            }
        `;

        try {
            const fallbackUniverse = await openAIService.generateUniverse(fallbackPrompt);
            return {
                id: `ai-fallback-${Date.now()}`,
                title: fallbackUniverse.title || 'The Mystery Learning Quest',
                description: fallbackUniverse.description || 'Join an exciting adventure where every challenge teaches you something amazing!',
                theme: fallbackUniverse.theme || 'Educational Adventure',
                objectives: [],
                learningAtoms: [],
            };
        } catch (error) {
            // Absolute fallback if AI fails completely
            return {
                id: `final-fallback-${Date.now()}`,
                title: 'The Great Learning Adventure',
                description: 'Embark on an exciting journey where every challenge is a chance to learn something new and amazing!',
                theme: 'Learning Quest',
                objectives: [],
                learningAtoms: [],
            };
        }
    }
}

export const enhancedUniverseGenerationService = new EnhancedUniverseGenerationService();
