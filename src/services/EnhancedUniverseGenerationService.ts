
import { CurriculumNode } from '../types/curriculum/CurriculumNode';
import { NELIESubject } from '../types/curriculum/NELIESubjects';
import { openAIService } from './OpenAIService';

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
    private enhancedThemes = [
        {
            narrative: "You discover an ancient map that leads to a treasure hidden somewhere in China. To find it, you must learn about Chinese culture, navigate using math, and communicate with locals.",
            subjects: [NELIESubject.GEOGRAPHY, NELIESubject.WORLD_LANGUAGES, NELIESubject.MATH],
            context: "treasure hunting adventure"
        },
        {
            narrative: "A mysterious blackout has hit your neighborhood! You become the neighborhood detective, using science to understand electricity, math to calculate power needs, and practical skills to help restore power safely.",
            subjects: [NELIESubject.SCIENCE, NELIESubject.MATH, NELIESubject.LIFE_ESSENTIALS],
            context: "mystery solving mission"
        },
        {
            narrative: "The local mall wants YOU to design and open the coolest sporting goods store ever! You'll need math for business planning, creativity for store design, and sports knowledge to stock the perfect equipment.",
            subjects: [NELIESubject.MATH, NELIESubject.CREATIVE_ARTS, NELIESubject.PHYSICAL_EDUCATION],
            context: "entrepreneurship adventure"
        },
        {
            narrative: "Two cars crashed outside your house and you're the first on the scene! Use your science knowledge to understand what happened, math to analyze the evidence, and life skills to help the police investigation.",
            subjects: [NELIESubject.SCIENCE, NELIESubject.MATH, NELIESubject.LIFE_ESSENTIALS],
            context: "detective investigation"
        }
    ];

    private getCurriculumObjectives(gradeLevel: number, subjects: NELIESubject[]): CurriculumNode[] {
        const gradeMap = {
            1: "1", 2: "2", 3: "3", 4: "4", 5: "5", 6: "6",
            7: "7", 8: "8", 9: "9", 10: "10", 11: "11", 12: "12"
        };
        const stepId = gradeMap[gradeLevel] || "4";

        const relevantStep = curriculumSteps.find(step => step.id === stepId);
        if (!relevantStep) {
            return this.createFallbackObjectives(gradeLevel);
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

    private createFallbackObjectives(gradeLevel: number): CurriculumNode[] {
        return [
            {
                id: 'fallback-math',
                name: 'Problem Solving Adventures',
                description: 'Use mathematical thinking to solve real-world puzzles and challenges.',
                subjectName: 'Mathematics',
                educationalLevel: `Grade ${gradeLevel}`
            },
            {
                id: 'fallback-science',
                name: 'Science Detective Work',
                description: 'Investigate natural phenomena and discover how things work around us.',
                subjectName: 'Science',
                educationalLevel: `Grade ${gradeLevel}`
            },
            {
                id: 'fallback-english',
                name: 'Story Creation Workshop',
                description: 'Express yourself through creative writing and storytelling adventures.',
                subjectName: 'English Language Arts',
                educationalLevel: `Grade ${gradeLevel}`
            }
        ];
    }

    public async generate(studentProfile: any): Promise<DailyUniverse> {
        console.log('🌟 Enhanced Universe Generation Service: Starting generation...');
        
        const themeData = this.enhancedThemes[Math.floor(Math.random() * this.enhancedThemes.length)];
        const { narrative, subjects, context } = themeData;
        const gradeLevel = studentProfile.gradeLevel || 4;
        const preferredLearningStyle = studentProfile.preferredLearningStyle || 'mixed';
        const objectives = this.getCurriculumObjectives(gradeLevel, subjects);

        console.log('🎯 Selected theme:', context);
        console.log('📚 Found objectives:', objectives.length);

        const prompt = `
            Create an engaging daily learning universe for a grade ${gradeLevel} student.
            Theme: "${narrative}"
            Context: ${context}
            Learning style: ${preferredLearningStyle}
            
            Generate an exciting title and immersive description that makes learning feel like an adventure.
            The universe should weave together these learning objectives naturally:
            ${objectives.map(obj => `- ${obj.name}: ${obj.description}`).join('\n')}
            
            Make it feel like the student is the hero of their own learning story!
        `;

        try {
            console.log('🤖 Calling OpenAI service...');
            const aiResponse = await openAIService.generateUniverse(prompt);
            console.log('✅ AI response received');

            const universe: DailyUniverse = {
                id: `enhanced-universe-${Date.now()}`,
                title: aiResponse?.title || `${context.charAt(0).toUpperCase() + context.slice(1)} Awaits!`,
                description: aiResponse?.description || `Embark on an exciting ${context} where every challenge teaches you something new!`,
                theme: narrative,
                objectives: objectives,
                learningAtoms: [],
            };

            console.log('🎉 Enhanced universe generated successfully:', universe.title);
            return universe;
        } catch (error) {
            console.error('❌ Error in enhanced universe generation:', error);
            return this.createEnhancedFallbackUniverse(narrative, objectives, context);
        }
    }

    private createEnhancedFallbackUniverse(theme: string, objectives: CurriculumNode[], context: string): DailyUniverse {
        console.log('🔄 Creating enhanced fallback universe...');
        
        return {
            id: `enhanced-fallback-${Date.now()}`,
            title: `Your ${context.charAt(0).toUpperCase() + context.slice(1)} Begins!`,
            description: `Ready for an amazing learning adventure? Dive into challenges that will test your skills and expand your knowledge!`,
            theme: theme,
            objectives: objectives.length > 0 ? objectives : this.createFallbackObjectives(4),
            learningAtoms: [],
        };
    }
}

export const enhancedUniverseGenerationService = new EnhancedUniverseGenerationService();
