import { supabase } from '@/integrations/supabase/client';
import { invokeFn } from '@/supabase/functionsClient';

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
    
    // Use adaptive_content table instead of content_atoms
    const { data: existingAtoms, error } = await supabase
      .from('adaptive_content')
      .select('*')
      .eq('subject', 'math') // Simplified filtering since we don't have kc_ids
      .limit(5);

    if (error) {
      console.error('❌ Database query error:', error);
      return [];
    }

    if (existingAtoms && existingAtoms.length > 0) {
      console.log('✅ Found pre-built atoms in database:', existingAtoms.length);
      return existingAtoms.map(atom => ({
        atom_id: atom.id,
        atom_type: atom.content_type,
        content: atom.content,
        kc_ids: [kcId], // Use the provided kcId
        metadata: {
          difficulty: atom.difficulty_level,
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

      const edgeResponse = await invokeFn('generate-content-atoms', {
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

  private getMathExplanationForKc(_kc: any, _seed: number) {
    return `This mathematical concept helps us solve real-world problems and builds important thinking skills.`;
  }

  private getMathExamplesForKc(kc: any, _seed: number) {
    return [`Practice helps you master ${kc.name}`];
  }
}

export default new ContentGenerationService();
