import NELIESessionGenerator from '../../services/NELIESessionGenerator';
import { validateEnhancedLesson } from '../../components/education/components/utils/EnhancedLessonGenerator';

describe('Enhanced NELIE Lesson System', () => {
    it('should generate a complete educational session', async () => {
        const session = await NELIESessionGenerator.generateSession({
            gradeLevel: 2,
            preferredLearningStyle: 'visual',
            subjects: ['mathematics', 'english'],
            enableUniqueness: true
        });

        expect(session).toBeDefined();
        expect(session.sessionId).toBeDefined();
        expect(session.metadata.totalDuration).toBeGreaterThan(0);
        expect(Object.keys(session.metadata.qualityScores).length).toBe(2);
    });

    it('should generate a single subject lesson', async () => {
        const mathLesson = await NELIESessionGenerator.NELIEHelpers.generateMathLesson(3, 'kinesthetic');
        expect(mathLesson).toBeDefined();
        expect(mathLesson.estimatedTotalDuration).toBeGreaterThan(0);
        const validation = validateEnhancedLesson(mathLesson);
        expect(validation.qualityScore).toBe(95);
    });

    it('should validate an enhanced lesson', async () => {
        const lesson = await NELIESessionGenerator.NELIEHelpers.generateMathLesson(3, 'kinesthetic');
        const validation = validateEnhancedLesson(lesson);
        expect(validation.isValid).toBe(true);
        expect(validation.qualityScore).toBe(95);
        expect(validation.errors.length).toBe(0);
        expect(validation.warnings.length).toBe(0);
    });
});
