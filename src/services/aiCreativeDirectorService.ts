
import { supabase } from '@/integrations/supabase/client';

interface ContentGenerationRequest {
  kcId: string;
  userId: string;
  difficultyLevel?: number;
  contentTypes?: string[];
  maxAtoms?: number;
}

interface AtomSequence {
  sequence_id: string;
  atoms: any[];
  kc_id: string;
  user_id: string;
  created_at: string;
}

class AICreativeDirectorService {
  async getAtomSequenceForKc(kcId: string, userId: string): Promise<AtomSequence | null> {
    try {
      console.log('🎯 AICreativeDirectorService: Generating atom sequence for KC:', kcId);
      console.log('📊 TEST CASE 1: Looking for pre-built atoms in database first...');
      
      // STEP 1: Try to get pre-built atoms from database
      const { data: existingAtoms, error: atomError } = await supabase
        .from('content_atoms')
        .select('*')
        .contains('kc_ids', [kcId])
        .limit(5);

      if (!atomError && existingAtoms && existingAtoms.length > 0) {
        console.log('✅ TEST CASE 1: Found pre-built atoms in database:', existingAtoms.length);
        console.log('🎯 Database atoms:', existingAtoms.map(atom => ({
          id: atom.id,
          type: atom.atom_type,
          kc_ids: atom.kc_ids
        })));

        const sequence: AtomSequence = {
          sequence_id: `db_seq_${Date.now()}_${Math.random().toString(36).substring(7)}`,
          atoms: existingAtoms.map(atom => ({
            atom_id: atom.id,
            atom_type: atom.atom_type,
            content: atom.content,
            kc_ids: atom.kc_ids,
            metadata: {
              ...atom.metadata,
              source: 'database',
              loadedAt: Date.now()
            }
          })),
          kc_id: kcId,
          user_id: userId,
          created_at: new Date().toISOString()
        };

        console.log('✅ TEST CASE 1: Database content loaded successfully');
        return sequence;
      }

      console.log('⚠️ TEST CASE 1: No pre-built atoms found in database, trying Edge Function...');

      // STEP 2: Try Edge Function (AI generation)
      try {
        console.log('🤖 Calling Edge Function for AI content generation...');
        const { data: edgeResponse, error: edgeError } = await supabase.functions.invoke('generate-content-atoms', {
          body: {
            kcId,
            userId,
            contentTypes: ['TEXT_EXPLANATION', 'QUESTION_MULTIPLE_CHOICE', 'INTERACTIVE_EXERCISE'],
            maxAtoms: 3
          }
        });

        if (!edgeError && edgeResponse?.atoms) {
          console.log('✅ Edge Function generated content successfully:', edgeResponse.atoms.length, 'atoms');
          
          const sequence: AtomSequence = {
            sequence_id: `ai_seq_${Date.now()}_${Math.random().toString(36).substring(7)}`,
            atoms: edgeResponse.atoms,
            kc_id: kcId,
            user_id: userId,
            created_at: new Date().toISOString()
          };

          return sequence;
        }

        console.log('⚠️ Edge Function failed or returned no content:', edgeError);
      } catch (edgeError) {
        console.log('❌ Edge Function call failed:', edgeError);
      }

      // STEP 3: Fallback to client-side generation
      console.log('🔄 Both database and Edge Function failed, using client-side fallback...');
      
      // Get KC details for fallback generation
      const { data: kc, error: kcError } = await supabase
        .from('knowledge_components')
        .select('*')
        .eq('id', kcId)
        .single();

      if (kcError || !kc) {
        console.error('❌ Failed to fetch KC details for fallback:', kcError);
        throw new Error(`Knowledge component not found: ${kcId}`);
      }

      const atoms = this.generateFallbackAtoms(kc);
      
      if (!atoms || atoms.length === 0) {
        console.error('❌ No atoms generated for KC:', kcId);
        return null;
      }

      const sequence: AtomSequence = {
        sequence_id: `fallback_seq_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        atoms: atoms,
        kc_id: kcId,
        user_id: userId,
        created_at: new Date().toISOString()
      };

      console.log('✅ Client-side fallback content generated');
      return sequence;

    } catch (error) {
      console.error('❌ AICreativeDirectorService error:', error);
      throw error;
    }
  }

  private generateFallbackAtoms(kc: any): any[] {
    console.log('🔄 Generating fallback atoms for KC:', kc.name);
    
    return [
      {
        atom_id: `atom_${Date.now()}_1`,
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
          source: 'client_fallback'
        }
      },
      {
        atom_id: `atom_${Date.now()}_2`,
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
          source: 'client_fallback'
        }
      },
      {
        atom_id: `atom_${Date.now()}_3`,
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
          source: 'client_fallback'
        }
      }
    ];
  }
}

export default new AICreativeDirectorService();
