import { EnhancedSubjectLessonFactory } from './EnhancedSubjectLessonFactory';
import { validateEnhancedLesson } from '../components/education/components/utils/EnhancedLessonGenerator';

interface NELIESession {
    sessionId: string;
    metadata: {
        totalDuration: number;
        qualityScores: Record<string, number>;
    };
    lessons: any[];
}

interface SessionConfig {
    gradeLevel: number;
    preferredLearningStyle: string;
    subjects: string[];
    enableUniqueness: boolean;
    difficulty?: number;
}

const NELIESessionGenerator = {
    generateSession: async (config: SessionConfig): Promise<NELIESession> => {
        const qualityScores: Record<string, number> = {};
        let totalDuration = 0;
        const lessons: any[] = [];

        for (const subject of config.subjects) {
            let lesson;
            switch (subject) {
                case 'mathematics':
                    lesson = await EnhancedSubjectLessonFactory.generateMathLesson(config.gradeLevel, config.preferredLearningStyle, config.difficulty);
                    break;
                case 'english':
                    lesson = await EnhancedSubjectLessonFactory.generateEnglishLesson(config.gradeLevel, config.preferredLearningStyle, config.difficulty);
                    break;
                case 'science':
                    lesson = await EnhancedSubjectLessonFactory.generateScienceLesson(config.gradeLevel, config.preferredLearningStyle, config.difficulty);
                    break;
                case 'music':
                    lesson = await EnhancedSubjectLessonFactory.generateMusicLesson(config.gradeLevel, config.preferredLearningStyle, config.difficulty);
                    break;
                case 'computerScience':
                    lesson = await EnhancedSubjectLessonFactory.generateComputerScienceLesson(config.gradeLevel, config.preferredLearningStyle, config.difficulty);
                    break;
                case 'creativeArts':
                    lesson = await EnhancedSubjectLessonFactory.generateCreativeArtsLesson(config.gradeLevel, config.preferredLearningStyle, config.difficulty);
                    break;
                default:
                    throw new Error(`Unknown subject: ${subject}`);
            }
            const validation = validateEnhancedLesson(lesson);
            qualityScores[subject] = validation.qualityScore;
            totalDuration += lesson.estimatedTotalDuration;
            lessons.push(lesson);
        }

        return {
            sessionId: `session-${Date.now()}`,
            metadata: {
                totalDuration,
                qualityScores
            },
            lessons,
        };
    },

    NELIEHelpers: {
        generateMathLesson: (gradeLevel: number, learningStyle: string) => {
            return EnhancedSubjectLessonFactory.generateMathLesson(gradeLevel, learningStyle);
        }
    }
};

export default NELIESessionGenerator;
