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
        
        // Normalize the data structure to match renderer expectations
        return edgeResponse.atoms.map((atom: any) => ({
          ...atom,
          content: {
            ...atom.content,
            // Ensure both correctAnswer and correct are set for compatibility
            correctAnswer: atom.content.correctAnswer ?? atom.content.correct ?? 0,
            correct: atom.content.correct ?? atom.content.correctAnswer ?? 0
          }
        }));
      }

      console.log('⚠️ Edge Function returned no atoms');
      return [];
    } catch (error) {
      console.error('❌ AI generation failed:', error);
      return [];
    }
  }

  generateFallbackContent(kc: any): any[] {
    console.log('🔄 Generating PROPER MATH fallback content for:', kc.name);
    
    const timestamp = Date.now();
    const randomSeed = Math.floor(Math.random() * 10000);
    
    // Generate actual math questions based on the KC
    const mathQuestions = this.generateMathQuestions(kc, randomSeed);
    
    return [
      {
        atom_id: `atom_${timestamp}_1_${randomSeed}`,
        atom_type: 'TEXT_EXPLANATION',
        content: {
          title: `Understanding ${kc.name}`,
          explanation: this.getMathExplanationForKc(kc, randomSeed),
          examples: this.getMathExamplesForKc(kc, randomSeed)
        },
        kc_ids: [kc.id],
        metadata: {
          difficulty: kc.difficulty_estimate || 0.5,
          estimatedTimeMs: 30000,
          source: 'enhanced_fallback',
          generated_at: timestamp,
          randomSeed
        }
      },
      {
        atom_id: `atom_${timestamp}_2_${randomSeed}`,
        atom_type: 'QUESTION_MULTIPLE_CHOICE',
        content: mathQuestions,
        kc_ids: [kc.id],
        metadata: {
          difficulty: kc.difficulty_estimate || 0.5,
          estimatedTimeMs: 45000,
          source: 'enhanced_fallback',
          generated_at: timestamp,
          randomSeed
        }
      }
    ];
  }

  private generateMathQuestions(kc: any, seed: number) {
    const kcId = kc.id.toLowerCase();
    
    if (kcId.includes('multiply_decimals')) {
      const factor1 = (1.2 + (seed % 5) * 0.3).toFixed(1);
      const factor2 = (2.1 + (seed % 4) * 0.2).toFixed(1);
      const product = (parseFloat(factor1) * parseFloat(factor2)).toFixed(2);
      
      return {
        question: `What is ${factor1} × ${factor2}?`,
        options: [
          product,
          (parseFloat(product) + 0.5).toFixed(2),
          (parseFloat(product) - 0.3).toFixed(2),
          (parseFloat(factor1) + parseFloat(factor2)).toFixed(2)
        ],
        correctAnswer: 0,
        correct: 0,
        explanation: `To multiply decimals, multiply the numbers normally: ${factor1} × ${factor2} = ${product}`
      };
    }
    
    if (kcId.includes('add_fractions')) {
      const denominator = 8 + (seed % 4);
      const num1 = 1 + (seed % 3);
      const num2 = 1 + ((seed + 1) % 3);
      const sum = num1 + num2;
      
      if (sum >= denominator) {
        return this.generateMathQuestions(kc, seed + 1);
      }
      
      return {
        question: `What is ${num1}/${denominator} + ${num2}/${denominator}?`,
        options: [
          `${sum}/${denominator}`,
          `${sum}/${denominator * 2}`,
          `${num1 + num2 + 1}/${denominator}`,
          `${num1}/${num2}`
        ],
        correctAnswer: 0,
        correct: 0,
        explanation: `When adding fractions with the same denominator, add the numerators: ${num1} + ${num2} = ${sum}/${denominator}`
      };
    }
    
    if (kcId.includes('area_rectangles')) {
      const length = 5 + (seed % 8);
      const width = 3 + (seed % 6);
      const area = length * width;
      
      return {
        question: `A rectangle has a length of ${length} units and width of ${width} units. What is its area?`,
        options: [
          `${area} square units`,
          `${length + width} square units`,
          `${(length + width) * 2} square units`,
          `${Math.floor(area / 2)} square units`
        ],
        correctAnswer: 0,
        correct: 0,
        explanation: `Area = length × width = ${length} × ${width} = ${area} square units`
      };
    }
    
    // Default math question
    const num1 = 12 + (seed % 20);
    const num2 = 5 + (seed % 15);
    const sum = num1 + num2;
    
    return {
      question: `What is ${num1} + ${num2}?`,
      options: [
        sum.toString(),
        (sum + 1).toString(),
        (sum - 2).toString(),
        (num1 - num2).toString()
      ],
      correctAnswer: 0,
      correct: 0,
      explanation: `${num1} + ${num2} = ${sum}`
    };
  }

  private getMathExplanationForKc(kc: any, seed: number) {
    const kcId = kc.id.toLowerCase();
    
    if (kcId.includes('multiply_decimals')) {
      return `Multiplying decimals is like multiplying whole numbers, but we need to place the decimal point correctly. Count the total decimal places in both numbers and put that many decimal places in your answer.`;
    }
    
    if (kcId.includes('add_fractions')) {
      return `When adding fractions with the same denominator, we keep the denominator and add the numerators. This is because we're adding parts of the same-sized whole.`;
    }
    
    if (kcId.includes('area_rectangles')) {
      return `The area of a rectangle tells us how many square units fit inside it. We calculate this by multiplying length times width.`;
    }
    
    return `This mathematical concept helps us solve real-world problems and builds important thinking skills.`;
  }

  private getMathExamplesForKc(kc: any, seed: number) {
    const kcId = kc.id.toLowerCase();
    
    if (kcId.includes('multiply_decimals')) {
      return [`Example: 2.5 × 1.2 = 3.00 = 3.0`];
    }
    
    if (kcId.includes('add_fractions')) {
      return [`Example: 2/5 + 1/5 = 3/5`];
    }
    
    if (kcId.includes('area_rectangles')) {
      return [`Example: A 4×3 rectangle has area = 4 × 3 = 12 square units`];
    }
    
    return [`Practice helps you master ${kc.name}`];
  }
}

export default new ContentGenerationService();
