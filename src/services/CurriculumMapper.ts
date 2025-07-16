
import { Universe } from './UniverseGenerator';

export interface CurriculumStandard {
    id: string;
    subject: string;
    gradeLevel: number;
    description: string;
    keywords: string[];
}

// Mock curriculum data - in production this would come from curriculum.json
const mockCurriculumData: CurriculumStandard[] = [
    {
        id: '1',
        subject: 'Mathematics',
        gradeLevel: 6,
        description: 'Solve real-world and mathematical problems by writing and solving equations of the form x + p = q and px = q for cases in which p, q and x are all nonnegative rational numbers.',
        keywords: ['equations', 'algebra', 'solve', 'math', 'problems']
    },
    {
        id: '2',
        subject: 'Mathematics',
        gradeLevel: 6,
        description: 'Know precise definitions of angle, circle, perpendicular line, parallel line, and line segment, based on the undefined notions of point, line, distance along a line, and distance around a circular arc.',
        keywords: ['geometry', 'angle', 'circle', 'line', 'definitions']
    },
    {
        id: '3',
        subject: 'Science',
        gradeLevel: 6,
        description: 'Develop and use a model to describe how unequal heating and rotation of the Earth cause patterns of atmospheric and oceanic circulation.',
        keywords: ['earth', 'atmosphere', 'ocean', 'circulation', 'heating']
    },
    {
        id: '4',
        subject: 'English',
        gradeLevel: 6,
        description: 'Determine or clarify the meaning of unknown and multiple-meaning words and phrases.',
        keywords: ['vocabulary', 'meaning', 'words', 'phrases', 'language']
    }
];

export const CurriculumMapper = {
    getStandardsForUniverse: (universe: Universe): CurriculumStandard[] => {
        // Extract keywords from universe content
        const universeContent = `${universe.title} ${universe.description}`.toLowerCase();
        const universeKeywords = universeContent.split(/\s+/);
        
        // Find relevant standards based on keyword matching
        const relevantStandards = mockCurriculumData.filter(standard => {
            return standard.keywords.some(keyword => 
                universeKeywords.some(universeKeyword => 
                    universeKeyword.includes(keyword) || keyword.includes(universeKeyword)
                )
            );
        });

        // Return at least 2 standards for educational value
        return relevantStandards.length > 0 ? relevantStandards : mockCurriculumData.slice(0, 2);
    },

    getAllStandards: (): CurriculumStandard[] => {
        return mockCurriculumData;
    },

    getStandardsBySubject: (subject: string): CurriculumStandard[] => {
        return mockCurriculumData.filter(standard => 
            standard.subject.toLowerCase() === subject.toLowerCase()
        );
    },

    getStandardsByGradeLevel: (gradeLevel: number): CurriculumStandard[] => {
        return mockCurriculumData.filter(standard => 
            standard.gradeLevel === gradeLevel
        );
    }
};
