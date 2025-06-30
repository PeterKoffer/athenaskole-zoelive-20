
import { supabase } from '@/integrations/supabase/client';

export interface ContentGenerationRequest {
  kcId: string;
  userId: string;
  difficultyLevel?: number;
  contentTypes?: string[];
  maxAtoms?: number;
  diversityPrompt?: string;
  sessionId?: string;
  forceUnique?: boolean;
}

export interface AtomSequence {
  sequence_id: string;
  atoms: any[];
  kc_id: string;
  user_id: string;
  created_at: string;
}

class ContentGenerationService {
  async generateFromDatabase(kcId: string): Promise<any[]> {
    console.log('🔍 Checking database for pre-built atoms...');
    
    const { data: existingAtoms, error } = await supabase
      .from('content_atoms')
      .select('*')
      .contains('kc_ids', [kcId])
      .limit(5);

    if (error) {
      console.error('❌ Database query error:', error);
      return [];
    }

    if (existingAtoms && existingAtoms.length > 0) {
      console.log('✅ Found pre-built atoms in database:', existingAtoms.length);
      return existingAtoms.map(atom => ({
        atom_id: atom.id,
        atom_type: atom.atom_type,
        content: atom.content,
        kc_ids: atom.kc_ids,
        metadata: {
          ...atom.metadata,
          source: 'database',
          loadedAt: Date.now()
        }
      }));
    }

    console.log('⚠️ No pre-built atoms found in database');
    return [];
  }

  async generateFromAI(request: ContentGenerationRequest): Promise<any[]> {
    console.log('🤖 Attempting ENHANCED AI content generation...');
    
    try {
      // Extract more specific information from KC ID
      const kcParts = request.kcId.split('_');
      const subject = kcParts[1] || 'math';
      const grade = kcParts[2] || 'g4';
      const topic = kcParts.slice(3).join(' ').replace(/_/g, ' ') || 'general topic';
      
      console.log('📚 Extracted KC info:', { subject, grade, topic });

      const { data: edgeResponse, error } = await supabase.functions.invoke('generate-content-atoms', {
        body: {
          kcId: request.kcId,
          userId: request.userId,
          subject: subject,
          gradeLevel: grade,
          topic: topic,
          contentTypes: request.contentTypes || ['TEXT_EXPLANATION', 'QUESTION_MULTIPLE_CHOICE', 'INTERACTIVE_EXERCISE'],
          maxAtoms: request.maxAtoms || 3,
          diversityPrompt: request.diversityPrompt || `Create engaging ${grade} ${subject} content about ${topic}`,
          sessionId: request.sessionId,
          forceUnique: request.forceUnique,
          enhancedPrompt: true
        }
      });

      if (error) {
        console.error('❌ Edge Function error:', error);
        return [];
      }

      if (edgeResponse?.atoms && edgeResponse.atoms.length > 0) {
        console.log('✅ AI generated content successfully:', edgeResponse.atoms.length, 'atoms');
        return edgeResponse.atoms;
      }

      console.log('⚠️ Edge Function returned no atoms');
      return [];
    } catch (error) {
      console.error('❌ AI generation failed:', error);
      return [];
    }
  }

  generateFallbackContent(kc: any): any[] {
    console.log('🔄 Generating ENHANCED fallback content for:', kc.name);
    
    const timestamp = Date.now();
    const randomSeed = Math.floor(Math.random() * 10000); // Increased for more variety
    
    // Create truly diverse question variations based on the KC
    const questionTemplates = this.getAdvancedQuestionTemplatesForKc(kc, randomSeed);
    const selectedTemplate = questionTemplates[randomSeed % questionTemplates.length];
    
    return [
      {
        atom_id: `atom_${timestamp}_1_${randomSeed}`,
        atom_type: 'TEXT_EXPLANATION',
        content: {
          title: `Understanding ${kc.name}`,
          explanation: this.getDetailedExplanationForKc(kc, randomSeed),
          examples: this.getVariedExamplesForKc(kc, randomSeed)
        },
        kc_ids: [kc.id],
        metadata: {
          difficulty: kc.difficulty_estimate || 0.5,
          estimatedTimeMs: 30000,
          source: 'enhanced_fallback',
          generated_at: timestamp,
          randomSeed,
          diversity_factor: randomSeed % 5
        }
      },
      {
        atom_id: `atom_${timestamp}_2_${randomSeed}`,
        atom_type: 'QUESTION_MULTIPLE_CHOICE',
        content: selectedTemplate,
        kc_ids: [kc.id],
        metadata: {
          difficulty: kc.difficulty_estimate || 0.5,
          estimatedTimeMs: 45000,
          source: 'enhanced_fallback',
          generated_at: timestamp,
          randomSeed,
          diversity_factor: randomSeed % 5
        }
      },
      {
        atom_id: `atom_${timestamp}_3_${randomSeed}`,
        atom_type: 'INTERACTIVE_EXERCISE',
        content: {
          title: `Practice ${kc.name}`,
          description: this.getVariedExerciseDescriptionForKc(kc, randomSeed),
          exerciseType: 'problem-solving',
          components: {
            problem: this.getVariedProblemForKc(kc, randomSeed),
            answer: 'correct solution'
          }
        },
        kc_ids: [kc.id],
        metadata: {
          difficulty: kc.difficulty_estimate || 0.5,
          estimatedTimeMs: 60000,
          source: 'enhanced_fallback',
          generated_at: timestamp,
          randomSeed,
          diversity_factor: randomSeed % 5
        }
      }
    ];
  }

  private getAdvancedQuestionTemplatesForKc(kc: any, seed: number) {
    const kcId = kc.id.toLowerCase();
    
    if (kcId.includes('area_rectangles')) {
      const areaQuestions = [
        {
          question: `A rectangle has a length of ${8 + (seed % 5)} units and a width of ${4 + (seed % 3)} units. What is its area?`,
          options: [`${(8 + (seed % 5)) * (4 + (seed % 3))} square units`, `${(8 + (seed % 5)) + (4 + (seed % 3))} square units`, `${(8 + (seed % 5)) * 2 + (4 + (seed % 3)) * 2} square units`, `${(8 + (seed % 5)) / (4 + (seed % 3))} square units`],
          correctAnswer: 0,
          correct: 0,
          explanation: `Area = length × width = ${8 + (seed % 5)} × ${4 + (seed % 3)} = ${(8 + (seed % 5)) * (4 + (seed % 3))} square units`
        },
        {
          question: `If a rectangular garden is ${5 + (seed % 4)} meters long and ${3 + (seed % 3)} meters wide, how much space does it cover?`,
          options: [`${(5 + (seed % 4)) * (3 + (seed % 3))} square meters`, `${(5 + (seed % 4)) + (3 + (seed % 3))} square meters`, `${(5 + (seed % 4)) - (3 + (seed % 3))} square meters`, `${(5 + (seed % 4)) * 2} square meters`],
          correctAnswer: 0,
          correct: 0,
          explanation: `The area of a rectangle is length × width = ${5 + (seed % 4)} × ${3 + (seed % 3)} = ${(5 + (seed % 4)) * (3 + (seed % 3))} square meters`
        },
        {
          question: "What is the correct formula for finding the area of a rectangle?",
          options: ["Area = length × width", "Area = length + width", "Area = 2 × (length + width)", "Area = length ÷ width"],
          correctAnswer: 0,
          correct: 0,
          explanation: "The area of a rectangle is always calculated by multiplying length times width"
        }
      ];
      return areaQuestions;
    }
    
    if (kcId.includes('add_fractions') || kcId.includes('fractions')) {
      const fractionQuestions = [
        {
          question: `What is ${1 + (seed % 3)}/${4 + (seed % 4)} + ${1 + (seed % 2)}/${4 + (seed % 4)}?`,
          options: [`${(1 + (seed % 3)) + (1 + (seed % 2))}/${4 + (seed % 4)}`, `${(1 + (seed % 3)) + (1 + (seed % 2))}/${(4 + (seed % 4)) * 2}`, `${(1 + (seed % 3)) * (1 + (seed % 2))}/${4 + (seed % 4)}`, `${1 + (seed % 3)}/${1 + (seed % 2)}`],
          correctAnswer: 0,
          correct: 0,
          explanation: `When adding fractions with the same denominator, add the numerators: ${1 + (seed % 3)} + ${1 + (seed % 2)} = ${(1 + (seed % 3)) + (1 + (seed % 2))}, so the answer is ${(1 + (seed % 3)) + (1 + (seed % 2))}/${4 + (seed % 4)}`
        },
        {
          question: `Solve: ${2 + (seed % 3)}/${6 + (seed % 2)} + ${1 + (seed % 2)}/${6 + (seed % 2)}`,
          options: [`${(2 + (seed % 3)) + (1 + (seed % 2))}/${6 + (seed % 2)}`, `${(2 + (seed % 3)) + (1 + (seed % 2))}/${(6 + (seed % 2)) * 2}`, `${2 + (seed % 3)}/${1 + (seed % 2)}`, `${(2 + (seed % 3)) * (1 + (seed % 2))}/${6 + (seed % 2)}`],
          correctAnswer: 0,
          correct: 0,
          explanation: `Add the numerators: ${2 + (seed % 3)} + ${1 + (seed % 2)} = ${(2 + (seed % 3)) + (1 + (seed % 2))}, keep the denominator: ${(2 + (seed % 3)) + (1 + (seed % 2))}/${6 + (seed % 2)}`
        },
        {
          question: "When adding fractions with the same denominator, what do you do?",
          options: ["Add the numerators, keep the denominator", "Add both numerators and denominators", "Multiply the numerators", "Find a common denominator first"],
          correctAnswer: 0,
          correct: 0,
          explanation: "When fractions have the same denominator, you simply add the numerators and keep the denominator the same"
        }
      ];
      return fractionQuestions;
    }

    if (kcId.includes('equivalent_fractions')) {
      const equivalentQuestions = [
        {
          question: `Which fraction is equivalent to ${1 + (seed % 2)}/${2 + (seed % 2)}?`,
          options: [`${(1 + (seed % 2)) * 2}/${(2 + (seed % 2)) * 2}`, `${1 + (seed % 2)}/${4 + (seed % 2)}`, `${2 + (seed % 2)}/${1 + (seed % 2)}`, `${1 + (seed % 2)} + 1/${2 + (seed % 2)} + 1`],
          correctAnswer: 0,
          correct: 0,
          explanation: `Equivalent fractions are created by multiplying both numerator and denominator by the same number: ${1 + (seed % 2)}/${2 + (seed % 2)} = ${(1 + (seed % 2)) * 2}/${(2 + (seed % 2)) * 2}`
        },
        {
          question: `What is ${2 + (seed % 3)}/${4 + (seed % 2)} in simplest form?`,
          options: [`${2 + (seed % 3)}/${4 + (seed % 2)}`, `${(2 + (seed % 3)) * 2}/${(4 + (seed % 2)) * 2}`, `${2 + (seed % 3)} + 1/${4 + (seed % 2)} + 1`, `${4 + (seed % 2)}/${2 + (seed % 3)}`],
          correctAnswer: 0,
          correct: 0,
          explanation: `This fraction is already in its simplest form since ${2 + (seed % 3)} and ${4 + (seed % 2)} share no common factors other than 1`
        }
      ];
      return equivalentQuestions;
    }
    
    // Enhanced default templates for other KCs
    const genericQuestions = [
      {
        question: `What is the most important strategy when learning ${kc.name}?`,
        options: ["Practice with different examples", "Memorize without understanding", "Skip difficult problems", "Avoid asking questions"],
        correctAnswer: 0,
        correct: 0,
        explanation: `Practicing with different examples helps build deep understanding of ${kc.name}`
      },
      {
        question: `Which approach works best for mastering ${kc.name}?`,
        options: ["Step-by-step problem solving", "Guessing the answers", "Avoiding practice", "Rushing through problems"],
        correctAnswer: 0,
        correct: 0,
        explanation: `Taking a systematic, step-by-step approach is key to mastering ${kc.name}`
      },
      {
        question: `What should you do when you encounter a challenging ${kc.name} problem?`,
        options: ["Break it down into smaller steps", "Give up immediately", "Guess randomly", "Skip to easier problems"],
        correctAnswer: 0,
        correct: 0,
        explanation: `Breaking complex problems into smaller, manageable steps is essential for learning ${kc.name}`
      }
    ];
    
    return genericQuestions;
  }

  private getDetailedExplanationForKc(kc: any, seed: number) {
    const kcId = kc.id.toLowerCase();
    const variations = [
      "Let's explore this step by step.",
      "Here's what you need to know.",
      "Understanding this concept is key.",
      "Let's break this down together.",
      "This is an important skill to master."
    ];
    
    const intro = variations[seed % variations.length];
    
    if (kcId.includes('area_rectangles')) {
      return `${intro} Finding the area of rectangles helps us understand how much space shapes cover. The area represents the total number of square units that fit inside the rectangle. To calculate this, we multiply the length by the width, which gives us the total space covered.`;
    }
    
    if (kcId.includes('add_fractions') || kcId.includes('fractions')) {
      return `${intro} Adding fractions with like denominators is about combining parts of the same whole. When denominators match, we're dealing with the same-sized pieces, so we can simply add up how many pieces we have in total while keeping the piece size the same.`;
    }

    if (kcId.includes('equivalent_fractions')) {
      return `${intro} Equivalent fractions represent the same amount using different numbers. Think of it like having the same amount of pizza, but cutting it into different numbers of pieces. The key is understanding that we can multiply or divide both parts of a fraction by the same number.`;
    }
    
    return `${intro} ${kc.name} is a fundamental concept that builds important mathematical thinking skills. Mastering this topic will help you solve more complex problems in the future.`;
  }

  private getVariedExamplesForKc(kc: any, seed: number) {
    const kcId = kc.id.toLowerCase();
    
    if (kcId.includes('area_rectangles')) {
      const examples = [
        [`A classroom that is ${10 + (seed % 5)} feet long and ${8 + (seed % 3)} feet wide has an area of ${(10 + (seed % 5)) * (8 + (seed % 3))} square feet`],
        [`A book cover that is ${9 + (seed % 4)} inches long and ${6 + (seed % 2)} inches wide has an area of ${(9 + (seed % 4)) * (6 + (seed % 2))} square inches`],
        [`A garden plot that is ${12 + (seed % 6)} meters long and ${7 + (seed % 3)} meters wide covers ${(12 + (seed % 6)) * (7 + (seed % 3))} square meters`]
      ];
      return examples[seed % examples.length];
    }
    
    if (kcId.includes('add_fractions') || kcId.includes('fractions')) {
      const examples = [
        [`${1 + (seed % 2)}/${3 + (seed % 3)} + ${1 + (seed % 2)}/${3 + (seed % 3)} = ${(1 + (seed % 2)) + (1 + (seed % 2))}/${3 + (seed % 3)}`],
        [`${2 + (seed % 3)}/${5 + (seed % 2)} + ${1 + (seed % 2)}/${5 + (seed % 2)} = ${(2 + (seed % 3)) + (1 + (seed % 2))}/${5 + (seed % 2)}`],
        [`${3 + (seed % 2)}/${8 + (seed % 3)} + ${2 + (seed % 2)}/${8 + (seed % 3)} = ${(3 + (seed % 2)) + (2 + (seed % 2))}/${8 + (seed % 3)}`]
      ];
      return examples[seed % examples.length];
    }
    
    return [`Example of ${kc.name} in practice`, `Real-world application of ${kc.name}`, `Step-by-step ${kc.name} solution`];
  }

  private getVariedExerciseDescriptionForKc(kc: any, seed: number) {
    const kcId = kc.id.toLowerCase();
    const variations = [
      "Let's practice with some problems.",
      "Try solving this step by step.",
      "Apply what you've learned here.",
      "Test your understanding with this exercise.",
      "Practice makes perfect - let's try this."
    ];
    
    const intro = variations[seed % variations.length];
    
    if (kcId.includes('area_rectangles')) {
      return `${intro} Practice calculating areas of different rectangles. Remember: Area = length × width`;
    }
    
    if (kcId.includes('add_fractions') || kcId.includes('fractions')) {
      return `${intro} Practice adding fractions with the same denominator. Add the numerators and keep the denominator.`;
    }
    
    return `${intro} Let's practice ${kc.name} with hands-on activities.`;
  }

  private getVariedProblemForKc(kc: any, seed: number) {
    const kcId = kc.id.toLowerCase();
    
    if (kcId.includes('area_rectangles')) {
      const problems = [
        `Find the area of a rectangular playground that is ${12 + (seed % 8)} meters long and ${7 + (seed % 5)} meters wide.`,
        `Calculate the area of a rectangular room that measures ${15 + (seed % 5)} feet by ${10 + (seed % 4)} feet.`,
        `What's the area of a rectangular poster that is ${18 + (seed % 7)} inches long and ${12 + (seed % 6)} inches wide?`
      ];
      return problems[seed % problems.length];
    }
    
    if (kcId.includes('add_fractions') || kcId.includes('fractions')) {
      const problems = [
        `Add these fractions: ${2 + (seed % 3)}/${7 + (seed % 2)} + ${3 + (seed % 2)}/${7 + (seed % 2)}`,
        `Solve: ${1 + (seed % 4)}/${9 + (seed % 3)} + ${2 + (seed % 3)}/${9 + (seed % 3)}`,
        `Find the sum: ${4 + (seed % 2)}/${11 + (seed % 4)} + ${1 + (seed % 3)}/${11 + (seed % 4)}`
      ];
      return problems[seed % problems.length];
    }
    
    return `Solve this problem involving ${kc.name}`;
  }
}

export default new ContentGenerationService();
