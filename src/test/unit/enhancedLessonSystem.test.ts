import { describe, it, expect, beforeEach } from 'vitest';
import {
  generateEnhancedLesson,
  validateEnhancedLesson,
  ContentUniquenessSystem,
  ENHANCED_LESSON_PHASES,
  LEARNING_STYLE_ADAPTATIONS,
  K12_CURRICULUM_STANDARDS
} from '../components/utils/EnhancedLessonGenerator';
import {
  generateCompleteEducationalSession,
  generateMathematicsLesson,
  generateEnglishLesson
} from '../components/utils/EnhancedSubjectLessonFactory';

describe('Enhanced NELIE Lesson System', () => {
  describe('Enhanced Lesson Duration', () => {
    it('should generate lessons between 20-25 minutes (1200-1500 seconds)', () => {
      const mathConfig = generateMathematicsLesson(1, 'mixed');
      const lesson = generateEnhancedLesson(mathConfig);

      expect(lesson.totalDuration).toBeGreaterThanOrEqual(1200);
      expect(lesson.totalDuration).toBeLessThanOrEqual(1500);
    });

    it('should adjust duration based on learning style', () => {
      const baseConfig = generateMathematicsLesson(1, 'mixed');
      const kinestheticConfig = generateMathematicsLesson(1, 'kinesthetic');

      const baseLesson = generateEnhancedLesson(baseConfig);
      const kinestheticLesson = generateEnhancedLesson(kinestheticConfig);

      // Kinesthetic lessons should be longer due to hands-on activities
      expect(kinestheticLesson.totalDuration).toBeGreaterThan(baseLesson.totalDuration);
    });

    it('should have proper phase distribution', () => {
      const config = generateMathematicsLesson(2, 'visual');
      const lesson = generateEnhancedLesson(config);

      // Check that each phase exists and has reasonable duration
      const phaseTypes = lesson.phases.map(phase => phase.phase);
      expect(phaseTypes).toContain('introduction');
      expect(phaseTypes).toContain('content-delivery');
      expect(phaseTypes).toContain('interactive-game');
      expect(phaseTypes).toContain('application');
      expect(phaseTypes).toContain('creative-exploration');
      expect(phaseTypes).toContain('summary');
    });
  });

  describe('Content Uniqueness System', () => {
    beforeEach(() => {
      // Clear session history before each test
      ContentUniquenessSystem['sessionHistory'].clear();
    });

    it('should generate unique content for different sessions', () => {
      const config1 = generateMathematicsLesson(1, 'mixed', 'session-1');
      const config2 = generateMathematicsLesson(1, 'mixed', 'session-2');

      const lesson1 = generateEnhancedLesson(config1);
      const lesson2 = generateEnhancedLesson(config2);

      // Sessions should have different session IDs
      expect(lesson1.metadata.sessionId).not.toBe(lesson2.metadata.sessionId);

      // Content should be different (at least themes)
      const themes1 = lesson1.phases.map(phase => phase.content.uniqueTheme).filter(Boolean);
      const themes2 = lesson2.phases.map(phase => phase.content.uniqueTheme).filter(Boolean);

      expect(themes1).not.toEqual(themes2);
    });

    it('should track used content to avoid repetition', () => {
      const sessionId = 'test-session';

      // Generate multiple lessons with same session ID
      const config1 = generateMathematicsLesson(1, 'mixed', sessionId);
      const config2 = generateMathematicsLesson(1, 'mixed', sessionId);

      generateEnhancedLesson(config1);
      generateEnhancedLesson(config2);

      // Verify session history is being tracked
      const history = ContentUniquenessSystem['sessionHistory'].get(sessionId);
      expect(history).toBeDefined();
      expect(history?.usedThemes.length).toBeGreaterThan(0);
    });
  });

  describe('Learning Style Adaptations', () => {
    it('should include learning style adaptations in lesson content', () => {
      const visualConfig = generateMathematicsLesson(1, 'visual');
      const auditoryConfig = generateMathematicsLesson(1, 'auditory');
      const kinestheticConfig = generateMathematicsLesson(1, 'kinesthetic');

      const visualLesson = generateEnhancedLesson(visualConfig);
      const auditoryLesson = generateEnhancedLesson(auditoryConfig);
      const kinestheticLesson = generateEnhancedLesson(kinestheticConfig);

      // Check that each lesson has appropriate learning style adaptations
      expect(visualLesson.phases[0].content.learningStyleAdaptation?.contentFormat).toContain('visual');
      expect(auditoryLesson.phases[0].content.learningStyleAdaptation?.contentFormat).toContain('story');
      expect(kinestheticLesson.phases[0].content.learningStyleAdaptation?.contentFormat).toContain('hands-on');
    });

    it('should have correct duration adjustments for learning styles', () => {
      const styles = ['visual', 'auditory', 'kinesthetic', 'mixed'] as const;
      const expectedAdjustments = [1.1, 1.0, 1.2, 1.15];

      styles.forEach((style, index) => {
        const adaptation = LEARNING_STYLE_ADAPTATIONS[style];
        expect(adaptation.durationAdjustment).toBe(expectedAdjustments[index]);
      });
    });
  });

  describe('K-12 Curriculum Alignment', () => {
    it('should include grade-appropriate curriculum standards', () => {
      const kindergartenConfig = generateMathematicsLesson(0, 'mixed');
      const grade1Config = generateMathematicsLesson(1, 'mixed');

      const kindergartenLesson = generateEnhancedLesson(kindergartenConfig);
      const grade1Lesson = generateEnhancedLesson(grade1Config);

      // Check that curriculum standards are included
      expect(kindergartenLesson.phases[0].content.curriculum).toBeDefined();
      expect(grade1Lesson.phases[0].content.curriculum).toBeDefined();

      // Check that grade levels are correct
      expect(kindergartenLesson.metadata.gradeLevel).toBe(0);
      expect(grade1Lesson.metadata.gradeLevel).toBe(1);
    });

    it('should have curriculum standards for all grade levels defined', () => {
      const definedGrades = Object.keys(K12_CURRICULUM_STANDARDS);
      expect(definedGrades.length).toBeGreaterThanOrEqual(2); // At least K and 1st grade

      // Check that each grade has all 6 subjects
      const grade0 = K12_CURRICULUM_STANDARDS[0];
      expect(grade0.mathematics).toBeDefined();
      expect(grade0.english).toBeDefined();
      expect(grade0.science).toBeDefined();
      expect(grade0.music).toBeDefined();
      expect(grade0.computerScience).toBeDefined();
      expect(grade0.creativeArts).toBeDefined();
    });
  });

  describe('All 6 Subjects Coverage', () => {
    it('should generate lessons for all 6 required subjects', () => {
      const completeSession = generateCompleteEducationalSession(1, 'mixed');

      expect(completeSession.mathematics).toBeDefined();
      expect(completeSession.english).toBeDefined();
      expect(completeSession.science).toBeDefined();
      expect(completeSession.music).toBeDefined();
      expect(completeSession.computerScience).toBeDefined();
      expect(completeSession.creativeArts).toBeDefined();

      // Each subject lesson should be valid
      const subjects = [
        completeSession.mathematics,
        completeSession.english,
        completeSession.science,
        completeSession.music,
        completeSession.computerScience,
        completeSession.creativeArts
      ];

      subjects.forEach(lesson => {
        expect(lesson.totalDuration).toBeGreaterThanOrEqual(1200);
        expect(lesson.totalDuration).toBeLessThanOrEqual(1500);
        expect(lesson.phases.length).toBeGreaterThanOrEqual(6);
      });
    });

    it('should have unique session IDs for each subject in complete session', () => {
      const completeSession = generateCompleteEducationalSession(1, 'mixed', 'test-session');

      const sessionIds = [
        completeSession.mathematics.metadata.sessionId,
        completeSession.english.metadata.sessionId,
        completeSession.science.metadata.sessionId,
        completeSession.music.metadata.sessionId,
        completeSession.computerScience.metadata.sessionId,
        completeSession.creativeArts.metadata.sessionId
      ];

      // All session IDs should be different
      const uniqueIds = new Set(sessionIds);
      expect(uniqueIds.size).toBe(6);

      // All should start with the base session ID
      sessionIds.forEach(id => {
        expect(id).toContain('test-session');
      });
    });
  });

  describe('Lesson Quality Validation', () => {
    it('should validate enhanced lessons meet quality requirements', () => {
      const config = generateMathematicsLesson(1, 'mixed');
      const lesson = generateEnhancedLesson(config);
      const validation = validateEnhancedLesson(lesson);

      expect(validation.isValid).toBe(true);
      expect(validation.errors.length).toBe(0);
      expect(validation.qualityScore).toBeGreaterThanOrEqual(70); // Good quality threshold
    });

    it('should detect lessons that are too short or too long', () => {
      // Create a mock lesson with invalid duration
      const shortLesson = {
        totalDuration: 1000, // Too short (less than 20 minutes)
        phases: [],
        metadata: {}
      };

      const longLesson = {
        totalDuration: 1600, // Too long (more than 25 minutes)
        phases: [],
        metadata: {}
      };

      const shortValidation = validateEnhancedLesson(shortLesson);
      const longValidation = validateEnhancedLesson(longLesson);

      expect(shortValidation.isValid).toBe(false);
      expect(shortValidation.errors.some(error => error.includes('below minimum'))).toBe(true);

      expect(longValidation.isValid).toBe(false);
      expect(longValidation.errors.some(error => error.includes('exceeds maximum'))).toBe(true);
    });

    it('should award quality points for various enhancements', () => {
      const config = generateMathematicsLesson(1, 'visual', 'test-session');
      const lesson = generateEnhancedLesson(config);
      const validation = validateEnhancedLesson(lesson);

      // Should get points for:
      // - Proper duration (25 points)
      // - Session ID for uniqueness (20 points)
      // - Learning style adaptations (25 points)
      // - Grade level curriculum (20 points)
      // - Proper phase structure (10 points)
      expect(validation.qualityScore).toBe(100); // Perfect score
    });
  });

  describe('Engagement and Educational Quality', () => {
    it('should include engaging elements in all phases', () => {
      const config = generateMathematicsLesson(2, 'mixed');
      const lesson = generateEnhancedLesson(config);

      lesson.phases.forEach(phase => {
        // Each phase should have engaging content
        expect(phase.title).toBeTruthy();
        expect(phase.content).toBeTruthy();
        expect(phase.duration).toBeGreaterThan(0);

        // Check for educational objectives
        if (phase.phase === 'content-delivery') {
          expect(phase.content.concept || phase.content.text).toBeTruthy();
        }

        // Check for interactive elements
        if (phase.phase === 'interactive-game') {
          expect(phase.content.question || phase.content.gameType).toBeTruthy();
        }
      });
    });

    it('should encourage curiosity and celebrate growth', () => {
      const config = generateEnglishLesson(1, 'mixed');
      const lesson = generateEnhancedLesson(config);

      // Check for encouraging language in content
      const allContent = lesson.phases.map(phase =>
        JSON.stringify(phase.content).toLowerCase()
      ).join(' ');

      // Should contain encouraging words
      const encouragingWords = ['amazing', 'wonderful', 'excellent', 'great', 'perfect', 'fantastic'];
      const hasEncouragingContent = encouragingWords.some(word => allContent.includes(word));
      expect(hasEncouragingContent).toBe(true);
    });

    it('should foster love for learning through content', () => {
      const config = generateMathematicsLesson(1, 'mixed');
      const lesson = generateEnhancedLesson(config);

      // Should have creative and exploratory elements
      const hasCreativePhase = lesson.phases.some(phase =>
        phase.phase === 'creative-exploration'
      );
      expect(hasCreativePhase).toBe(true);

      // Should connect to real-world applications
      const hasRealWorldConnection = lesson.phases.some(phase =>
        phase.content.scenario ||
        phase.content.realWorldExample ||
        JSON.stringify(phase.content).toLowerCase().includes('real')
      );
      expect(hasRealWorldConnection).toBe(true);
    });
  });

  describe('Performance and Scalability', () => {
    it('should generate lessons efficiently', () => {
      const start = performance.now();

      // Generate a complete educational session
      const session = generateCompleteEducationalSession(1, 'mixed');

      const end = performance.now();
      const duration = end - start;

      // Should complete in reasonable time (under 1 second)
      expect(duration).toBeLessThan(1000);

      // Should generate all required content
      expect(Object.keys(session).length).toBe(7); // 6 subjects + metadata
    });

    it('should handle multiple concurrent session generations', () => {
      const sessions = [];

      // Generate multiple sessions concurrently
      for (let i = 0; i < 5; i++) {
        sessions.push(generateCompleteEducationalSession(i % 3, 'mixed', `concurrent-${i}`));
      }

      // All sessions should be valid and unique
      expect(sessions.length).toBe(5);

      const sessionIds = sessions.map(s => s.sessionMetadata.sessionId);
      const uniqueIds = new Set(sessionIds);
      expect(uniqueIds.size).toBe(5); // All should be unique
    });
  });
});