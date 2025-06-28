
import type { AtomSequence, ContentAtom } from '@/types/content';

export interface IAiCreativeDirectorService {
  getAtomSequenceForKc(kcId: string, userId: string): Promise<AtomSequence | null>;
}

class AiCreativeDirectorService implements IAiCreativeDirectorService {
  private questionCache = new Map<string, any[]>();
  private usedQuestions = new Set<string>();

  async getAtomSequenceForKc(kcId: string, userId: string): Promise<AtomSequence | null> {
    try {
      console.log(`🎯 AI Creative Director: Generating content for KC ${kcId}, User ${userId}`);
      
      // Map KC ID to generation parameters
      const { subject, skillArea, difficultyLevel } = this.mapKcToGenerationParams(kcId);
      console.log(`📚 Mapped to: ${subject} / ${skillArea} (Level ${difficultyLevel})`);
      
      // Generate AI-powered questions for this KC
      const generatedQuestions = await this.generateVariedQuestionsForKc(
        subject, 
        skillArea, 
        difficultyLevel, 
        userId, 
        3 // Generate 3 questions per sequence
      );

      if (!generatedQuestions || generatedQuestions.length === 0) {
        console.log('⚠️ No AI questions generated, creating fallback content');
        return this.createFallbackSequence(kcId, userId, subject, skillArea, difficultyLevel);
      }

      // Convert generated questions to ContentAtom format
      const atoms: ContentAtom[] = generatedQuestions.map((question, index) => ({
        atom_id: `ai_${kcId}_${userId}_${Date.now()}_${Math.random().toString(36).substring(2, 8)}_${index}`,
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
          timestamp: Date.now(),
          uniqueId: `${kcId}_${Date.now()}_${Math.random()}`
        }
      }));

      console.log(`✅ Generated AI sequence with ${atoms.length} questions for ${skillArea}`);

      return {
        sequence_id: `ai_seq_${kcId}_${userId}_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
        atoms: atoms,
        kc_id: kcId,
        user_id: userId,
        created_at: new Date().toISOString()
      };
    } catch (error) {
      console.error(`❌ AI Creative Director: Error generating content for KC ${kcId}:`, error);
      return this.createFallbackSequence(kcId, userId, 'mathematics', 'general math', 5);
    }
  }

  private mapKcToGenerationParams(kcId: string): { subject: string; skillArea: string; difficultyLevel: number } {
    const kcMappings = {
      'kc_math_g5_multiply_decimals': {
        subject: 'mathematics',
        skillArea: 'decimal multiplication',
        difficultyLevel: 5
      },
      'kc_math_g4_subtract_fractions_likedenom': {
        subject: 'mathematics',
        skillArea: 'fraction subtraction with like denominators',
        difficultyLevel: 4
      },
      'kc_math_g4_add_fractions_likedenom': {
        subject: 'mathematics',
        skillArea: 'fraction addition with like denominators',
        difficultyLevel: 4
      },
      'kc_english_g4_reading_comprehension': {
        subject: 'english',
        skillArea: 'reading comprehension and main ideas',
        difficultyLevel: 4
      },
      'kc_science_g5_ecosystems': {
        subject: 'science',
        skillArea: 'ecosystems and food chains',
        difficultyLevel: 5
      }
    };

    return kcMappings[kcId as keyof typeof kcMappings] || {
      subject: 'mathematics',
      skillArea: 'general math concepts',
      difficultyLevel: 5
    };
  }

  private async generateVariedQuestionsForKc(
    subject: string,
    skillArea: string,
    difficultyLevel: number,
    userId: string,
    count: number = 3
  ): Promise<any[]> {
    try {
      console.log(`🤖 Generating ${count} questions for ${subject}/${skillArea}`);
      
      const questions = [];
      
      for (let i = 0; i < count; i++) {
        try {
          console.log(`📡 Calling generate-question API for question ${i + 1}...`);
          
          const response = await fetch('/functions/v1/generate-question', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
            },
            body: JSON.stringify({
              subject,
              skillArea,
              difficultyLevel,
              userId,
              questionIndex: i,
              promptVariation: i === 0 ? 'basic' : i === 1 ? 'word_problem' : 'mixed',
              specificContext: 'grade-appropriate learning'
            }),
          });

          if (response.ok) {
            const questionData = await response.json();
            
            // Check if response has error field (from our error handling)
            if (questionData.error || !questionData.question) {
              throw new Error(questionData.error || 'Invalid response structure');
            }
            
            console.log(`📝 Question ${i + 1} received:`, {
              question: questionData.question?.substring(0, 50) + '...',
              hasOptions: Array.isArray(questionData.options),
              optionsCount: questionData.options?.length,
              correctIndex: questionData.correct
            });
            
            if (this.validateQuestion(questionData) && !this.isDuplicateQuestion(questionData.question)) {
              this.usedQuestions.add(questionData.question);
              questions.push({
                question: questionData.question,
                options: questionData.options,
                correct: questionData.correct,
                explanation: questionData.explanation || "Good work!"
              });
              
              console.log(`✅ Added AI-generated question ${i + 1}`);
            } else {
              console.log(`⚠️ Question ${i + 1} failed validation, using fallback`);
              const fallback = this.createSpecificFallback(subject, skillArea, difficultyLevel, i);
              questions.push(fallback);
            }
          } else {
            console.error(`❌ HTTP error for question ${i + 1}:`, response.status, await response.text());
            const fallback = this.createSpecificFallback(subject, skillArea, difficultyLevel, i);
            questions.push(fallback);
          }
        } catch (questionError) {
          console.error(`❌ Failed to generate question ${i + 1}:`, questionError);
          const fallback = this.createSpecificFallback(subject, skillArea, difficultyLevel, i);
          questions.push(fallback);
        }
      }

      console.log(`✅ Final result: Generated ${questions.length} questions (AI + fallback mix)`);
      return questions;
    } catch (error) {
      console.error('❌ Error in generateVariedQuestionsForKc:', error);
      // Return at least one fallback question
      return [this.createSpecificFallback(subject, skillArea, difficultyLevel, 0)];
    }
  }

  private validateQuestion(questionData: any): boolean {
    return questionData && 
           questionData.question && 
           Array.isArray(questionData.options) && 
           questionData.options.length === 4 &&
           typeof questionData.correct === 'number' &&
           questionData.correct >= 0 && 
           questionData.correct <= 3;
  }

  private isDuplicateQuestion(question: string): boolean {
    const questionKey = question.toLowerCase().replace(/[^a-z0-9]/g, '');
    return this.usedQuestions.has(questionKey);
  }

  private createSpecificFallback(subject: string, skillArea: string, difficultyLevel: number, index: number) {
    console.log(`🔧 Creating fallback question ${index + 1} for ${skillArea}`);
    
    if (skillArea.includes('fraction') && skillArea.includes('like denominators')) {
      return this.createFractionFallback(index);
    }
    
    if (skillArea.includes('decimal multiplication')) {
      return this.createDecimalFallback(index);
    }

    // Generic fallback
    const timestamp = Date.now().toString().slice(-4);
    return {
      question: `What is an important concept in Grade ${difficultyLevel} ${subject}? (Question ${index + 1}-${timestamp})`,
      options: [`Concept A-${timestamp}`, `Concept B-${timestamp}`, `Concept C-${timestamp}`, `Concept D-${timestamp}`],
      correct: 0,
      explanation: `This helps you practice ${skillArea} skills.`
    };
  }

  private createFractionFallback(index: number) {
    const denominators = [6, 8, 10, 12];
    const denominator = denominators[index % denominators.length];
    const numerator1 = 1 + index;
    const numerator2 = 1 + (index % 2);
    const correctSum = numerator1 + numerator2;
    
    // Ensure we don't exceed the denominator
    if (correctSum >= denominator) {
      return this.createFractionFallback((index + 1) % 4);
    }
    
    const correctAnswer = `${correctSum}/${denominator}`;
    const wrongOptions = [
      `${correctSum + 1}/${denominator}`,
      `${correctSum}/${denominator + denominator}`,
      `${correctSum - 1}/${denominator}`
    ];
    
    return {
      question: `What is ${numerator1}/${denominator} + ${numerator2}/${denominator}?`,
      options: [correctAnswer, ...wrongOptions],
      correct: 0,
      explanation: `When adding fractions with the same denominator, add the numerators: ${numerator1} + ${numerator2} = ${correctSum}. The answer is ${correctAnswer}.`
    };
  }

  private createDecimalFallback(index: number) {
    const factor1 = (1.2 + index * 0.3).toFixed(1);
    const factor2 = (2.1 + index * 0.2).toFixed(1);
    const product = (parseFloat(factor1) * parseFloat(factor2)).toFixed(2);
    
    return {
      question: `What is ${factor1} × ${factor2}?`,
      options: [
        product,
        (parseFloat(product) + 1).toFixed(2),
        (parseFloat(product) - 0.5).toFixed(2),
        (parseFloat(factor1) + parseFloat(factor2)).toFixed(2)
      ],
      correct: 0,
      explanation: `To multiply decimals: ${factor1} × ${factor2} = ${product}.`
    };
  }

  private createFallbackSequence(kcId: string, userId: string, subject: string, skillArea: string, difficultyLevel: number): AtomSequence {
    console.log(`🔧 Creating fallback sequence for ${kcId}`);
    
    const fallbackQuestions = [
      this.createSpecificFallback(subject, skillArea, difficultyLevel, 0),
      this.createSpecificFallback(subject, skillArea, difficultyLevel, 1),
      this.createSpecificFallback(subject, skillArea, difficultyLevel, 2)
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

const aiCreativeDirectorService = new AiCreativeDirectorService();
export default aiCreativeDirectorService;
