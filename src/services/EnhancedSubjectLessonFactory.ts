import { generateEnhancedLesson } from '../components/education/components/utils/EnhancedLessonGenerator';

const generateMathLesson = (gradeLevel: number, learningStyle: 'mixed' | 'visual' | 'auditory' | 'kinesthetic') => {
    return generateEnhancedLesson('mathematics', 'math-skills', gradeLevel, learningStyle);
};

const generateEnglishLesson = (gradeLevel: number, learningStyle: 'mixed' | 'visual' | 'auditory' | 'kinesthetic') => {
    return generateEnhancedLesson('english', 'language-arts', gradeLevel, learningStyle);
};

const generateScienceLesson = (gradeLevel: number, learningStyle: 'mixed' | 'visual' | 'auditory' | 'kinesthetic') => {
    return generateEnhancedLesson('science', 'scientific-method', gradeLevel, learningStyle);
};

const generateMusicLesson = (gradeLevel: number, learningStyle: 'mixed' | 'visual' | 'auditory' | 'kinesthetic') => {
    return generateEnhancedLesson('music', 'musical-concepts', gradeLevel, learningStyle);
};

const generateComputerScienceLesson = (gradeLevel: number, learningStyle: 'mixed' | 'visual' | 'auditory' | 'kinesthetic') => {
    return generateEnhancedLesson('computerScience', 'computational-thinking', gradeLevel, learningStyle);
};

const generateCreativeArtsLesson = (gradeLevel: number, learningStyle: 'mixed' | 'visual' | 'auditory' | 'kinesthetic') => {
    return generateEnhancedLesson('creativeArts', 'artistic-expression', gradeLevel, learningStyle);
};

export const EnhancedSubjectLessonFactory = {
    generateMathLesson,
    generateEnglishLesson,
    generateScienceLesson,
    generateMusicLesson,
    generateComputerScienceLesson,
    generateCreativeArtsLesson
};
