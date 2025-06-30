
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
    console.log('🤖 Attempting AI content generation...');
    
    try {
      const { data: edgeResponse, error } = await supabase.functions.invoke('generate-content-atoms', {
        body: {
          kcId: request.kcId,
          userId: request.userId,
          contentTypes: request.contentTypes || ['TEXT_EXPLANATION', 'QUESTION_MULTIPLE_CHOICE', 'INTERACTIVE_EXERCISE'],
          maxAtoms: request.maxAtoms || 3,
          diversityPrompt: request.diversityPrompt,
          sessionId: request.sessionId,
          forceUnique: request.forceUnique
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
    console.log('🔄 Generating fallback content for:', kc.name);
    
    const timestamp = Date.now();
    
    return [
      {
        atom_id: `atom_${timestamp}_1`,
        atom_type: 'TEXT_EXPLANATION',
        content: {
          title: `Understanding ${kc.name}`,
          explanation: `Let's explore the concept of ${kc.name}. This is an important topic in ${kc.subject}.`,
          examples: [`Example of ${kc.name} in practice`]
        },
        kc_ids: [kc.id],
        metadata: {
          difficulty: kc.difficulty_estimate || 0.5,
          estimatedTimeMs: 30000,
          source: 'client_fallback',
          generated_at: timestamp
        }
      },
      {
        atom_id: `atom_${timestamp}_2`,
        atom_type: 'QUESTION_MULTIPLE_CHOICE',
        content: {
          question: `Which of the following best describes ${kc.name}?`,
          options: [
            `${kc.name} is a fundamental concept`,
            `${kc.name} is not important`,
            `${kc.name} is only for advanced students`,
            `${kc.name} is outdated`
          ],
          correctAnswer: 0,
          correct: 0,
          explanation: `${kc.name} is indeed a fundamental concept that forms the basis for more advanced topics.`,
          correctFeedback: 'Excellent! You understand the importance of this concept.',
          generalIncorrectFeedback: 'Not quite right. Let me explain why this concept is important.'
        },
        kc_ids: [kc.id],
        metadata: {
          difficulty: kc.difficulty_estimate || 0.5,
          estimatedTimeMs: 45000,
          source: 'client_fallback',
          generated_at: timestamp
        }
      },
      {
        atom_id: `atom_${timestamp}_3`,
        atom_type: 'INTERACTIVE_EXERCISE',
        content: {
          title: `Practice ${kc.name}`,
          description: `Let's practice what we've learned about ${kc.name}.`,
          exerciseType: 'problem-solving',
          components: {
            problem: `Solve this problem involving ${kc.name}`,
            answer: 'correct solution'
          }
        },
        kc_ids: [kc.id],
        metadata: {
          difficulty: kc.difficulty_estimate || 0.5,
          estimatedTimeMs: 60000,
          source: 'client_fallback',
          generated_at: timestamp
        }
      }
    ];
  }
}

export default new ContentGenerationService();
