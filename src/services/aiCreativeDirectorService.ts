import type { AtomSequence, ContentAtom } from '@/types/content';

export interface IAiCreativeDirectorService {
  getAtomSequenceForKc(kcId: string, userId: string): Promise<AtomSequence | null>;
}

class AiCreativeDirectorService implements IAiCreativeDirectorService {
  private questionCache = new Map<string, any[]>();
  private usedQuestions = new Set<string>();

  async getAtomSequenceForKc(kcId: string, userId: string): Promise<AtomSequence | null> {
    try {
      console.log(`🎯 AI Creative Director: Generating dynamic content for KC ${kcId}`);
      
      // Map KC ID to subject and skill area for AI generation
      const { subject, skillArea, difficultyLevel } = this.mapKcToGenerationParams(kcId);
      
      // Generate varied AI-powered questions for this KC
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

      console.log(`✅ Generated AI sequence with ${atoms.length} specific questions for ${skillArea}`);

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
    // Enhanced mappings with more variety
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
      console.log(`🤖 Generating ${count} SPECIFIC ${subject} questions for ${skillArea}`);
      
      const questions = [];
      const questionPrompts = this.createVariedPrompts(subject, skillArea, difficultyLevel, count);
      
      for (let i = 0; i < count; i++) {
        try {
          const specificPrompt = questionPrompts[i] || questionPrompts[0];
          
          console.log(`📡 Calling OpenAI for question ${i + 1} with variation: ${specificPrompt.variation}`);
          
          const response = await fetch('/functions/v1/generate-question', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
            },
            body: JSON.stringify({
              subject,
              skillArea: specificPrompt.skillVariation,
              difficultyLevel,
              userId,
              questionIndex: i,
              promptVariation: specificPrompt.variation,
              specificContext: specificPrompt.context
            }),
          });

          if (response.ok) {
            const questionData = await response.json();
            
            console.log(`📝 Received question ${i + 1}:`, {
              question: questionData.question?.substring(0, 50) + '...',
              hasOptions: Array.isArray(questionData.options),
              optionsCount: questionData.options?.length,
              correctIndex: questionData.correct
            });
            
            if (questionData.question && 
                Array.isArray(questionData.options) && 
                questionData.options.length === 4 &&
                typeof questionData.correct === 'number' &&
                !this.isDuplicateQuestion(questionData.question)) {
              
              this.usedQuestions.add(questionData.question);
              questions.push({
                question: questionData.question,
                options: questionData.options,
                correct: questionData.correct,
                explanation: questionData.explanation || "Good work!"
              });
              
              console.log(`✅ Added specific question ${i + 1}: ${questionData.question.substring(0, 40)}...`);
            } else {
              console.log(`⚠️ Question ${i + 1} failed validation, using fallback`);
              const fallback = this.createUniqueSpecificFallback(subject, skillArea, difficultyLevel, i);
              questions.push(fallback);
            }
          } else {
            console.error(`❌ HTTP error for question ${i + 1}:`, response.status);
            const fallback = this.createUniqueSpecificFallback(subject, skillArea, difficultyLevel, i);
            questions.push(fallback);
          }
        } catch (questionError) {
          console.error(`❌ Failed to generate question ${i + 1}:`, questionError);
          const fallback = this.createUniqueSpecificFallback(subject, skillArea, difficultyLevel, i);
          questions.push(fallback);
        }
      }

      console.log(`✅ Final result: Generated ${questions.length} questions for ${skillArea}`);
      questions.forEach((q, i) => {
        console.log(`   ${i + 1}. ${q.question.substring(0, 50)}...`);
      });

      return questions;
    } catch (error) {
      console.error('❌ Error in generateVariedQuestionsForKc:', error);
      return [this.createUniqueSpecificFallback(subject, skillArea, difficultyLevel, 0)];
    }
  }

  private createVariedPrompts(subject: string, skillArea: string, difficultyLevel: number, count: number) {
    const basePrompts = {
      'decimal multiplication': [
        { variation: 'basic', skillVariation: 'basic decimal multiplication', context: 'simple decimal problems' },
        { variation: 'word_problem', skillVariation: 'decimal multiplication word problems', context: 'real-world scenarios' },
        { variation: 'mixed', skillVariation: 'decimal multiplication with different place values', context: 'varying difficulty' }
      ],
      'fraction subtraction with like denominators': [
        { variation: 'basic', skillVariation: 'basic fraction subtraction', context: 'same denominators' },
        { variation: 'simplify', skillVariation: 'fraction subtraction with simplification', context: 'requiring simplification' },
        { variation: 'word_problem', skillVariation: 'fraction subtraction word problems', context: 'real-world contexts' }
      ],
      'reading comprehension and main ideas': [
        { variation: 'passage', skillVariation: 'reading comprehension with short passages', context: 'identifying main ideas' },
        { variation: 'inference', skillVariation: 'reading inference questions', context: 'drawing conclusions' },
        { variation: 'details', skillVariation: 'reading for specific details', context: 'supporting details' }
      ]
    };

    return basePrompts[skillArea as keyof typeof basePrompts] || [
      { variation: 'basic', skillVariation: skillArea, context: 'fundamental concepts' },
      { variation: 'applied', skillVariation: skillArea + ' applications', context: 'practical problems' },
      { variation: 'mixed', skillVariation: skillArea + ' mixed problems', context: 'varied approaches' }
    ];
  }

  private isDuplicateQuestion(question: string): boolean {
    const questionKey = question.toLowerCase().replace(/[^a-z0-9]/g, '');
    return this.usedQuestions.has(questionKey);
  }

  private createUniqueSpecificFallback(subject: string, skillArea: string, difficultyLevel: number, index: number) {
    const timestamp = Date.now();
    const randomSeed = Math.random().toString(36).substring(2, 8);
    
    if (skillArea.includes('fraction') && skillArea.includes('like denominators')) {
      // Create specific fraction questions
      const denominators = [6, 8, 10, 12];
      const denominator = denominators[index % denominators.length];
      const numerator1 = 2 + index;
      const numerator2 = 1 + (index % 3);
      const correctSum = numerator1 + numerator2;
      
      return {
        question: `What is ${numerator1}/${denominator} + ${numerator2}/${denominator}?`,
        options: [
          `${correctSum}/${denominator}`,
          `${correctSum}/${denominator * 2}`,
          `${numerator1 + numerator2}/${denominator + denominator}`,
          `${correctSum + 1}/${denominator}`
        ],
        correct: 0,
        explanation: `When adding fractions with the same denominator, add the numerators: ${numerator1} + ${numerator2} = ${correctSum}. Keep the denominator the same: ${correctSum}/${denominator}.`
      };
    }
    
    if (skillArea.includes('decimal multiplication')) {
      const factor1 = (1.2 + index * 0.3).toFixed(1);
      const factor2 = (2.1 + index * 0.2).toFixed(1);
      const product = (parseFloat(factor1) * parseFloat(factor2)).toFixed(2);
      
      return {
        question: `What is ${factor1} × ${factor2}?`,
        options: [
          product,
          (parseFloat(product) + 1).toFixed(2),
          (parseFloat(product) - 0.5).toFixed(2),
          (parseFloat(product) + 0.3).toFixed(2)
        ],
        correct: 0,
        explanation: "When multiplying decimals, multiply as whole numbers then place the decimal point correctly."
      };
    }

    // Generic fallback
    return {
      question: `What is an important concept in Grade ${difficultyLevel} ${subject}? (Question ${index + 1})`,
      options: [`Concept A-${randomSeed}`, `Concept B-${randomSeed}`, `Concept C-${randomSeed}`, `Concept D-${randomSeed}`],
      correct: 0,
      explanation: `This helps you practice ${skillArea} skills.`
    };
  }

  private createFallbackSequence(kcId: string, userId: string, subject: string, skillArea: string, difficultyLevel: number): AtomSequence {
    const fallbackQuestions = [
      this.createUniqueSpecificFallback(subject, skillArea, difficultyLevel, 0),
      this.createUniqueSpecificFallback(subject, skillArea, difficultyLevel, 1),
      this.createUniqueSpecificFallback(subject, skillArea, difficultyLevel, 2)
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
