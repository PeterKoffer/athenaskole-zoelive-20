
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

    private enhanceObjectiveWithTheme(objective: CurriculumNode, theme: string, narrative: string): CurriculumNode {
        const themeEnhancements = {
            "You have to travel to China to help a man in his store.": {
                math: {
                    counting: "Help Mr. Li count inventory in his Chinese market using traditional counting methods",
                    addition: "Calculate the total cost of items in Mr. Li's store using Chinese currency",
                    patterns: "Discover number patterns in ancient Chinese mathematics"
                }
            },
            "All the power is out in your home, and you need to fix it.": {
                math: {
                    counting: "Count electrical components needed to restore power to your house",
                    addition: "Add up the voltage requirements for different appliances",
                    patterns: "Find patterns in electrical circuit configurations"
                },
                science: {
                    electricity: "Investigate how electrical circuits work in your home",
                    energy: "Explore different types of energy sources to power your house"
                }
            },
            "Your local mall needs a sporting goods store, and you will open it.": {
                math: {
                    counting: "Count sports equipment inventory for your new store",
                    addition: "Calculate total costs and profits for your sporting goods business",
                    patterns: "Analyze sales patterns to stock your sports store effectively"
                }
            },
            "Two cars crashed outside your house this morning, and you need to help the police with the investigation.": {
                math: {
                    counting: "Count evidence pieces and measure distances at the crash scene",
                    addition: "Calculate speed and impact forces from the car crash data",
                    patterns: "Analyze traffic patterns to understand how the crash happened"
                },
                science: {
                    physics: "Investigate the physics of motion and forces in car crashes",
                    measurement: "Use scientific tools to measure and analyze the crash scene"
                }
            }
        };

        const enhancements = themeEnhancements[narrative];
        if (!enhancements) return objective;

        const subject = objective.subjectName.toLowerCase();
        const subjectEnhancements = enhancements[subject];
        if (!subjectEnhancements) return objective;

        // Find the best enhancement based on the objective content
        let enhancedName = objective.name;
        let enhancedDescription = objective.description;

        if (objective.name.toLowerCase().includes('count') && subjectEnhancements.counting) {
            enhancedName = subjectEnhancements.counting;
            enhancedDescription = `Use counting skills in a real-world scenario: ${subjectEnhancements.counting.toLowerCase()}`;
        } else if (objective.name.toLowerCase().includes('add') && subjectEnhancements.addition) {
            enhancedName = subjectEnhancements.addition;
            enhancedDescription = `Apply addition skills to solve problems: ${subjectEnhancements.addition.toLowerCase()}`;
        } else if (objective.name.toLowerCase().includes('pattern') && subjectEnhancements.patterns) {
            enhancedName = subjectEnhancements.patterns;
            enhancedDescription = `Discover and use patterns: ${subjectEnhancements.patterns.toLowerCase()}`;
        }

        return {
            ...objective,
            name: enhancedName,
            description: enhancedDescription
        };
    }

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

    public async generate(studentProfile: any): Promise<DailyUniverse> {
        const themeData = this.themes[Math.floor(Math.random() * this.themes.length)];
        const { narrative, subjects } = themeData;
        const gradeLevel = studentProfile.gradeLevel || 4;
        const preferredLearningStyle = studentProfile.preferredLearningStyle || 'mixed';
        
        // Get base curriculum objectives
        const baseObjectives = this.getCurriculumObjectives(gradeLevel, subjects);
        
        // Enhance objectives with theme context
        const enhancedObjectives = baseObjectives.map(obj => 
            this.enhanceObjectiveWithTheme(obj, themeData.narrative, narrative)
        );

        const prompt = `
            Generate a daily learning universe for a grade ${gradeLevel} student.
            The theme of the universe is: "${narrative}".
            The student's preferred learning style is ${preferredLearningStyle}.
            Create a compelling title and engaging description that makes learning feel like an adventure.
            
            Make the title feel exciting and adventurous, not like a textbook.
            Make the description immersive and engaging, focusing on the story and adventure.
            
            The universe should feel like a real adventure where learning happens naturally through solving problems and helping characters.
        `;

        try {
            const aiResponse = await openAIService.generateUniverse(prompt);

            const universe: DailyUniverse = {
                id: `universe-${Date.now()}`,
                title: aiResponse?.title || 'Your Adventure Awaits',
                description: aiResponse?.description || 'Embark on an exciting learning adventure with real-world challenges.',
                theme: narrative,
                objectives: enhancedObjectives,
                learningAtoms: [],
            };

            console.log('🎯 Enhanced Universe Generated:', {
                title: universe.title,
                objectiveCount: enhancedObjectives.length,
                enhancedObjectives: enhancedObjectives.map(obj => ({
                    original: obj.name,
                    enhanced: obj.description
                }))
            });

            return universe;
        } catch (error) {
            console.error('Error generating enhanced universe:', error);
            // Return enhanced fallback universe
            return this.createEnhancedFallbackUniverse(narrative, enhancedObjectives);
        }
    }

    private createEnhancedFallbackUniverse(theme: string, objectives: CurriculumNode[]): DailyUniverse {
        const adventureTitles = [
            'The Great Learning Quest',
            'Mystery of the Missing Knowledge',
            'Adventure in Learning Land',
            'The Educational Expedition',
            'Mission: Learn and Discover'
        ];

        const randomTitle = adventureTitles[Math.floor(Math.random() * adventureTitles.length)];

        return {
            id: `enhanced-fallback-universe-${Date.now()}`,
            title: randomTitle,
            description: 'Join an exciting adventure where every challenge you face teaches you something new. Solve real-world problems and help interesting characters while building your skills!',
            theme: theme,
            objectives: objectives,
            learningAtoms: [],
        };
    }
}

export const enhancedUniverseGenerationService = new EnhancedUniverseGenerationService();
