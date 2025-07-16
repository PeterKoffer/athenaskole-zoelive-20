import { EnhancedSubjectLessonFactory } from './EnhancedSubjectLessonFactory';
import { preferencesService } from './PreferencesService';
import { conceptMasteryService } from './conceptMasteryService';
import { aiLearningPathService } from './aiLearningPathService';
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
    userId: string;
    schoolId: string;
    teacherId?: string;
}

const NELIESessionGenerator = {
    generateSession: async (config: SessionConfig): Promise<NELIESession> => {
        const qualityScores: Record<string, number> = {};
        let totalDuration = 0;
        const lessons: any[] = [];

        // Get preferences and weights
        const [schoolPreferences, teacherPreferences, conceptMastery, learningPath] = await Promise.all([
            preferencesService.getSchoolPreferences(config.schoolId),
            config.teacherId ? preferencesService.getTeacherPreferences(config.teacherId) : Promise.resolve(null),
            conceptMasteryService.getConceptMastery(config.userId),
            aiLearningPathService.getAdaptiveRecommendations(config.userId, 'general')
        ]);

        const subjectWeights = {
            ...schoolPreferences?.subject_weights,
            ...teacherPreferences?.subject_weights,
            ...teacherPreferences?.weekly_emphasis
        };

        for (const subject of config.subjects) {
            let lesson;
            const subjectDifficulty = conceptMastery.find(c => c.subject === subject)?.masteryLevel || config.difficulty;
            const weightedDifficulty = (subjectDifficulty || 1) * (subjectWeights[subject] || 1);

            switch (subject) {
                case 'mathematics':
                    lesson = await EnhancedSubjectLessonFactory.generateMathLesson(config.gradeLevel, config.preferredLearningStyle, weightedDifficulty);
                    break;
                case 'english':
                    lesson = await EnhancedSubjectLessonFactory.generateEnglishLesson(config.gradeLevel, config.preferredLearningStyle, weightedDifficulty);
                    break;
                case 'science':
                    lesson = await EnhancedSubjectLessonFactory.generateScienceLesson(config.gradeLevel, config.preferredLearningStyle, weightedDifficulty);
                    break;
                case 'music':
                    lesson = await EnhancedSubjectLessonFactory.generateMusicLesson(config.gradeLevel, config.preferredLearningStyle, weightedDifficulty);
                    break;
                case 'computerScience':
                    lesson = await EnhancedSubjectLessonFactory.generateComputerScienceLesson(config.gradeLevel, config.preferredLearningStyle, weightedDifficulty);
                    break;
                case 'creativeArts':
                    lesson = await EnhancedSubjectLessonFactory.generateCreativeArtsLesson(config.gradeLevel, config.preferredLearningStyle, weightedDifficulty);

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
