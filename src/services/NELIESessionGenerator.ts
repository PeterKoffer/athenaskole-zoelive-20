import { EnhancedSubjectLessonFactory } from './EnhancedSubjectLessonFactory';
import { preferencesService } from './PreferencesService';


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
        const [schoolPreferences, teacherPreferences] = await Promise.all([
            preferencesService.getSchoolPreferences(config.schoolId),
            config.teacherId ? preferencesService.getTeacherPreferences(config.teacherId) : Promise.resolve(null)
        ]);

        const subjectWeights: Record<string, number> = {};
        Object.assign(
            subjectWeights,
            (schoolPreferences && typeof schoolPreferences.subject_weights === 'object') ? schoolPreferences.subject_weights : {},
            (teacherPreferences && typeof teacherPreferences.subject_weights === 'object') ? teacherPreferences.subject_weights : {},
            (teacherPreferences && typeof teacherPreferences.weekly_emphasis === 'object') ? teacherPreferences.weekly_emphasis : {}
        );

        for (const subject of config.subjects) {
            let lesson;
            const subjectDifficulty = config.difficulty;
            const weightedDifficulty = (subjectDifficulty || 1) * (subjectWeights[subject] || 1);
            const learningStyle = (['mixed','visual','auditory','kinesthetic'] as const).includes(config.preferredLearningStyle as any) ? (config.preferredLearningStyle as any) : 'mixed';
            switch (subject) {
                case 'mathematics':
                    lesson = await EnhancedSubjectLessonFactory.generateMathLesson(config.gradeLevel, learningStyle, weightedDifficulty);
                    break;
                case 'english':
                    lesson = await EnhancedSubjectLessonFactory.generateEnglishLesson(config.gradeLevel, learningStyle, weightedDifficulty);
                    break;
                case 'science':
                    lesson = await EnhancedSubjectLessonFactory.generateScienceLesson(config.gradeLevel, learningStyle, weightedDifficulty);
                    break;
                case 'music':
                    lesson = await EnhancedSubjectLessonFactory.generateMusicLesson(config.gradeLevel, learningStyle, weightedDifficulty);
                    break;
                case 'computerScience':
                    lesson = await EnhancedSubjectLessonFactory.generateComputerScienceLesson(config.gradeLevel, learningStyle, weightedDifficulty);
                    break;
                case 'creativeArts':
                    lesson = await EnhancedSubjectLessonFactory.generateCreativeArtsLesson(config.gradeLevel, learningStyle, weightedDifficulty);
                    break;
                default:
                    throw new Error(`Unknown subject: ${subject}`);
            }
            const validation = validateEnhancedLesson(lesson);
            qualityScores[subject] = validation.qualityScore;
            totalDuration += (lesson?.estimatedTotalDuration || 0);
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
        generateMathLesson: (gradeLevel: number, learningStyle: 'mixed' | 'visual' | 'auditory' | 'kinesthetic') => {
            return EnhancedSubjectLessonFactory.generateMathLesson(gradeLevel, learningStyle);
        }
    }
};

export default NELIESessionGenerator;
