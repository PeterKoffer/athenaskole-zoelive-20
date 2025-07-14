
interface LessonValidation {
    isValid: boolean;
    qualityScore: number;
}

interface EnhancedLesson {
    lesson: {
        totalDuration: number;
    };
    activities: any[];
    validation: {
        qualityScore: number;
    };
}

export const validateEnhancedLesson = (lesson: EnhancedLesson): LessonValidation => {
    return {
        isValid: lesson.lesson.totalDuration > 0,
        qualityScore: lesson.validation.qualityScore
    };
};
