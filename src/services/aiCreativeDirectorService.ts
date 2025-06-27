
import type { AtomSequence, ContentAtom } from '@/types/content';
import { useUnifiedQuestionGeneration } from '@/hooks/useUnifiedQuestionGeneration';

export interface IAiCreativeDirectorService {
  getAtomSequenceForKc(kcId: string, userId: string): Promise<AtomSequence | null>;
}

class AiCreativeDirectorService implements IAiCreativeDirectorService {
  private questionGenerationCache = new Map<string, any>();

  async getAtomSequenceForKc(kcId: string, userId: string): Promise<AtomSequence | null> {
    try {
      console.log(`🎯 AI Creative Director: Generating dynamic content for KC ${kcId}`);
      
      // Map KC ID to subject and skill area for AI generation
      const { subject, skillArea, difficultyLevel } = this.mapKcToGenerationParams(kcId);
      
      // Generate AI-powered questions for this KC
      const generatedQuestions = await this.generateQuestionsForKc(
        subject, 
        skillArea, 
        difficultyLevel, 
        userId, 
        3 // Generate 3 questions per sequence
      );

      if (!generatedQuestions || generatedQuestions.length === 0) {
        console.log('⚠️ No AI questions generated, falling back to static content');
        return null;
      }

      // Convert generated questions to ContentAtom format
      const atoms: ContentAtom[] = generatedQuestions.map((question, index) => ({
        atom_id: `ai_${kcId}_${userId}_${Date.now()}_${index}`,
        atom_type: 'QUESTION_MULTIPLE_CHOICE',
        content: {
          question: question.question,
          options: question.options,
          correctAnswer: question.correct,
          correctFeedback: question.explanation || "Great job!",
          generalIncorrectFeedback: question.explanation || "Let's review this concept.",
          explanation: question.explanation
        },
        kc_ids: [kcId],
        metadata: {
          difficulty: difficultyLevel,
          estimatedTime: 90,
          generated: true,
          aiGenerated: true,
          timestamp: Date.now()
        }
      }));

      return {
        sequence_id: `ai_seq_${kcId}_${userId}_${Date.now()}`,
        atoms: atoms,
        kc_id: kcId,
        user_id: userId,
        created_at: new Date().toISOString()
      };
    } catch (error) {
      console.error(`❌ AI Creative Director: Error generating content for KC ${kcId}:`, error);
      return null;
    }
  }

  private mapKcToGenerationParams(kcId: string): { subject: string; skillArea: string; difficultyLevel: number } {
    // Map KC IDs to appropriate subjects and skill areas
    const kcMappings = {
      'kc_math_g5_multiply_decimals': {
        subject: 'mathematics',
        skillArea: 'decimal multiplication',
        difficultyLevel: 5
      },
      'kc_math_g4_subtract_fractions_likedenom': {
        subject: 'mathematics',
        skillArea: 'fraction subtraction',
        difficultyLevel: 4
      },
      // Add more mappings as needed
    };

    return kcMappings[kcId as keyof typeof kcMappings] || {
      subject: 'mathematics',
      skillArea: 'general math',
      difficultyLevel: 5
    };
  }

  private async generateQuestionsForKc(
    subject: string,
    skillArea: string,
    difficultyLevel: number,
    userId: string,
    count: number = 3
  ): Promise<any[]> {
    try {
      console.log(`🤖 Generating ${count} AI questions for ${subject} - ${skillArea}`);
      
      // Use the existing question generation service
      const questions = [];
      
      for (let i = 0; i < count; i++) {
        try {
          const response = await fetch('/api/generate-question', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              subject,
              skillArea,
              difficultyLevel,
              userId,
              questionIndex: i
            }),
          });

          if (response.ok) {
            const questionData = await response.json();
            if (questionData.question) {
              questions.push({
                question: questionData.question,
                options: questionData.options || [],
                correct: questionData.correct || 0,
                explanation: questionData.explanation || "Good work!"
              });
            }
          }
        } catch (questionError) {
          console.error(`❌ Failed to generate question ${i + 1}:`, questionError);
          // Continue with other questions
        }
      }

      // If AI generation fails, create fallback questions
      if (questions.length === 0) {
        questions.push(this.createFallbackQuestion(subject, skillArea, difficultyLevel));
      }

      console.log(`✅ Generated ${questions.length} questions for ${skillArea}`);
      return questions;
    } catch (error) {
      console.error('❌ Error in generateQuestionsForKc:', error);
      return [this.createFallbackQuestion(subject, skillArea, difficultyLevel)];
    }
  }

  private createFallbackQuestion(subject: string, skillArea: string, difficultyLevel: number) {
    const fallbackQuestions = {
      'decimal multiplication': {
        question: "What is 1.5 × 2.4?",
        options: ["3.6", "3.9", "2.9", "4.1"],
        correct: 0,
        explanation: "When multiplying decimals, multiply as whole numbers then place the decimal point."
      },
      'fraction subtraction': {
        question: "What is 5/8 - 2/8?",
        options: ["3/8", "3/16", "7/8", "1/4"],
        correct: 0,
        explanation: "When subtracting fractions with the same denominator, subtract the numerators."
      }
    };

    return fallbackQuestions[skillArea as keyof typeof fallbackQuestions] || {
      question: `What is an important concept in ${skillArea}?`,
      options: ["Concept A", "Concept B", "Concept C", "Concept D"],
      correct: 0,
      explanation: `This helps you practice ${skillArea} skills.`
    };
  }
}

const aiCreativeDirectorService = new AiCreativeDirectorService();
export default aiCreativeDirectorService;
