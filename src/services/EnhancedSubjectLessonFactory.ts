import { generateEnhancedLesson } from '../components/education/components/utils/EnhancedLessonGenerator';

const generateMathLesson = (gradeLevel: number, learningStyle: 'mixed' | 'visual' | 'auditory' | 'kinesthetic', difficulty?: number) => {
    return generateEnhancedLesson('mathematics', 'math-skills', gradeLevel, learningStyle, difficulty);
};

const generateEnglishLesson = (gradeLevel: number, learningStyle: 'mixed' | 'visual' | 'auditory' | 'kinesthetic', difficulty?: number) => {
    return generateEnhancedLesson('english', 'language-arts', gradeLevel, learningStyle, difficulty);
};

const generateScienceLesson = (gradeLevel: number, learningStyle: 'mixed' | 'visual' | 'auditory' | 'kinesthetic', difficulty?: number) => {
    return generateEnhancedLesson('science', 'scientific-method', gradeLevel, learningStyle, difficulty);
};

const generateMusicLesson = (gradeLevel: number, learningStyle: 'mixed' | 'visual' | 'auditory' | 'kinesthetic', difficulty?: number) => {
    return generateEnhancedLesson('music', 'musical-concepts', gradeLevel, learningStyle, difficulty);
};

const generateComputerScienceLesson = (gradeLevel: number, learningStyle: 'mixed' | 'visual' | 'auditory' | 'kinesthetic', difficulty?: number) => {
    return generateEnhancedLesson('computerScience', 'computational-thinking', gradeLevel, learningStyle, difficulty);
};

const generateCreativeArtsLesson = (gradeLevel: number, learningStyle: 'mixed' | 'visual' | 'auditory' | 'kinesthetic', difficulty?: number) => {
    return generateEnhancedLesson('creativeArts', 'artistic-expression', gradeLevel, learningStyle, difficulty);
};

export const EnhancedSubjectLessonFactory = {
    generateMathLesson,
    generateEnglishLesson,
    generateScienceLesson,
    generateMusicLesson,
    generateComputerScienceLesson,
    generateCreativeArtsLesson
};
