import NELIESessionGenerator from '../../services/NELIESessionGenerator';
import { validateEnhancedLesson } from '../../services/EnhancedLessonGenerator';

describe('Enhanced NELIE Lesson System', () => {
    it('should generate a complete educational session', () => {
        const session = NELIESessionGenerator.generateSession({
            gradeLevel: 2,
            preferredLearningStyle: 'visual',
            subjects: ['mathematics', 'english', 'science', 'music', 'computerScience', 'creativeArts'],
            enableUniqueness: true
        });

        expect(session).toBeDefined();
        expect(session.sessionId).toBeDefined();
        expect(session.metadata.totalDuration).toBeGreaterThan(0);
        expect(Object.keys(session.metadata.qualityScores).length).toBe(6);
    });

    it('should generate a single subject lesson', () => {
        const mathLesson = NELIESessionGenerator.NELIEHelpers.generateMathLesson(3, 'kinesthetic');
        expect(mathLesson).toBeDefined();
        expect(mathLesson.lesson.totalDuration).toBeGreaterThan(0);
        expect(mathLesson.validation.qualityScore).toBe(100);
    });

    it('should validate an enhanced lesson', () => {
        const lesson = {
            lesson: {
                totalDuration: 1200
            },
            activities: [],
            validation: {
                qualityScore: 100
            }
        };
        const validation = validateEnhancedLesson(lesson);
        expect(validation.isValid).toBe(true);
        expect(validation.qualityScore).toBe(100);
    });
});
