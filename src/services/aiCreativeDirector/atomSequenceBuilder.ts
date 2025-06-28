
import type { AtomSequence, ContentAtom } from '@/types/content';
import type { GeneratedQuestion } from './types';

export class AtomSequenceBuilder {
  static buildAtomSequence(
    kcId: string,
    userId: string,
    questions: GeneratedQuestion[],
    educationalContext: any
  ): AtomSequence {
    const atoms: ContentAtom[] = questions.map((question, index) => ({
      atom_id: `k12_${kcId}_${userId}_${Date.now()}_${Math.random().toString(36).substring(2, 8)}_${index}`,
      atom_type: 'QUESTION_MULTIPLE_CHOICE',
      content: {
        question: question.question,
        options: question.options,
        correctAnswer: question.correct,
        correctFeedback: question.explanation || "Excellent work!",
        generalIncorrectFeedback: question.explanation || "Let's review this concept together.",
        explanation: question.explanation
      },
      kc_ids: [kcId],
      metadata: {
        difficulty: educationalContext.difficultyLevel,
        gradeLevel: educationalContext.gradeLevel,
        estimatedTime: 90,
        generated: true,
        aiGenerated: true,
        aiGeneratedTimestamp: Date.now(),
        source: 'openai-gpt-4o-mini-k12',
        personalizedForStudent: true,
        educationalContext: {
          teacherFocus: educationalContext.teacherRequirements?.focusAreas || [],
          schoolStandards: educationalContext.schoolStandards?.curriculum || 'common_core',
          studentLearningStyle: educationalContext.studentAdaptation?.learningStyle || 'mixed'
        },
        timestamp: Date.now(),
        uniqueId: `${kcId}_${Date.now()}_${Math.random()}`
      }
    }));

    return {
      sequence_id: `k12_seq_${kcId}_${userId}_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      atoms: atoms,
      kc_id: kcId,
      user_id: userId,
      created_at: new Date().toISOString()
    };
  }

  static createFallbackSequence(
    kcId: string,
    userId: string,
    subject: string,
    skillArea: string,
    difficultyLevel: number
  ): AtomSequence {
    console.log(`🔧 Creating fallback sequence for ${kcId}`);
    
    const fallbackQuestions = [
      { question: `Practice question 1 for ${skillArea}`, options: ['A', 'B', 'C', 'D'], correct: 0, explanation: 'Good work!' },
      { question: `Practice question 2 for ${skillArea}`, options: ['A', 'B', 'C', 'D'], correct: 1, explanation: 'Well done!' },
      { question: `Practice question 3 for ${skillArea}`, options: ['A', 'B', 'C', 'D'], correct: 2, explanation: 'Excellent!' }
    ];

    const atoms: ContentAtom[] = fallbackQuestions.map((question, index) => ({
      atom_id: `fallback_${kcId}_${userId}_${Date.now()}_${index}`,
      atom_type: 'QUESTION_MULTIPLE_CHOICE',
      content: {
        question: question.question,
        options: question.options,
        correctAnswer: question.correct,
        correctFeedback: question.explanation,
        generalIncorrectFeedback: question.explanation,
        explanation: question.explanation
      },
      kc_ids: [kcId],
      metadata: {
        difficulty: difficultyLevel,
        estimatedTime: 90,
        generated: true,
        fallback: true,
        timestamp: Date.now()
      }
    }));

    return {
      sequence_id: `fallback_seq_${kcId}_${userId}_${Date.now()}`,
      atoms: atoms,
      kc_id: kcId,
      user_id: userId,
      created_at: new Date().toISOString()
    };
  }
}
