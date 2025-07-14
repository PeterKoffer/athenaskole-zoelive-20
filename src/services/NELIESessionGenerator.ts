import { EnhancedSubjectLessonFactory } from './EnhancedSubjectLessonFactory';

const subjectToFunctionMap: { [key: string]: keyof typeof EnhancedSubjectLessonFactory } = {
    mathematics: 'generateMathLesson',
    english: 'generateEnglishLesson',
    science: 'generateScienceLesson',
    music: 'generateMusicLesson',
    computerscience: 'generateComputerScienceLesson',
    creativearts: 'generateCreativeArtsLesson'
};

const generateSession = (config: any) => {
    const { gradeLevel, preferredLearningStyle, subjects } = config;
    const session: any = {
        metadata: {
            totalDuration: 0,
            qualityScores: {}
        },
        sessionId: `session-${Date.now()}`
    };

    subjects.forEach((subject: string) => {
        const functionName = subjectToFunctionMap[subject.toLowerCase()];
        if (functionName) {
            const lesson = EnhancedSubjectLessonFactory[functionName](gradeLevel, preferredLearningStyle);
            session[subject] = lesson;
            session.metadata.totalDuration += lesson.lesson.totalDuration;
            session.metadata.qualityScores[subject] = lesson.validation.qualityScore;
        }
    });

    return session;
};

const formatDuration = (duration: number) => {
    return `${Math.floor(duration / 60)} minutes`;
};

const NELIEHelpers = {
    generateMathLesson: EnhancedSubjectLessonFactory.generateMathLesson,
    formatDuration
};

const NELIESessionGenerator = {
    generateSession,
    NELIEHelpers
};

export default NELIESessionGenerator;
