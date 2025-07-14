import { generateEnhancedLesson } from './EnhancedLessonGenerator';

const generateMathLesson = (gradeLevel: number, learningStyle: string) => {
    return generateEnhancedLesson({
        gradeLevel,
        learningStyle,
        subject: 'mathematics'
    });
};

const generateEnglishLesson = (gradeLevel: number, learningStyle: string) => {
    return generateEnhancedLesson({
        gradeLevel,
        learningStyle,
        subject: 'english'
    });
};

const generateScienceLesson = (gradeLevel: number, learningStyle: string) => {
    return generateEnhancedLesson({
        gradeLevel,
        learningStyle,
        subject: 'science'
    });
};

const generateMusicLesson = (gradeLevel: number, learningStyle: string) => {
    return generateEnhancedLesson({
        gradeLevel,
        learningStyle,
        subject: 'music'
    });
};

const generateComputerScienceLesson = (gradeLevel: number, learningStyle: string) => {
    return generateEnhancedLesson({
        gradeLevel,
        learningStyle,
        subject: 'computerScience'
    });
};

const generateCreativeArtsLesson = (gradeLevel: number, learningStyle: string) => {
    return generateEnhancedLesson({
        gradeLevel,
        learningStyle,
        subject: 'creativeArts'
    });
};

export const EnhancedSubjectLessonFactory = {
    generateMathLesson,
    generateEnglishLesson,
    generateScienceLesson,
    generateMusicLesson,
    generateComputerScienceLesson,
    generateCreativeArtsLesson
};
