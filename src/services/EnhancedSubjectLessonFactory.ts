
import { generateEnhancedLesson } from '../components/education/components/utils/EnhancedLessonGenerator';

const generateMathLesson = (gradeLevel: number, learningStyle: string) => {
    return generateEnhancedLesson('mathematics', 'math-skills', gradeLevel);
};

const generateEnglishLesson = (gradeLevel: number, learningStyle: string) => {
    return generateEnhancedLesson('english', 'language-arts', gradeLevel);
};

const generateScienceLesson = (gradeLevel: number, learningStyle: string) => {
    return generateEnhancedLesson('science', 'scientific-method', gradeLevel);
};

const generateMusicLesson = (gradeLevel: number, learningStyle: string) => {
    return generateEnhancedLesson('music', 'musical-concepts', gradeLevel);
};

const generateComputerScienceLesson = (gradeLevel: number, learningStyle: string) => {
    return generateEnhancedLesson('computerScience', 'computational-thinking', gradeLevel);
};

const generateCreativeArtsLesson = (gradeLevel: number, learningStyle: string) => {
    return generateEnhancedLesson('creativeArts', 'artistic-expression', gradeLevel);
};

export const EnhancedSubjectLessonFactory = {
    generateMathLesson,
    generateEnglishLesson,
    generateScienceLesson,
    generateMusicLesson,
    generateComputerScienceLesson,
    generateCreativeArtsLesson
};
