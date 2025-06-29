
import { supabase } from '@/integrations/supabase/client';
import type { ContentAtom, AtomSequence } from '@/types/content';

class AICreativeDirectorService {
  async getAtomSequenceForKc(kcId: string, userId: string): Promise<AtomSequence | null> {
    try {
      console.log(`🎨 AI Creative Director: Generating content for KC ${kcId}, User ${userId}`);
      
      // First, try to get atoms from database
      const { data: existingAtoms, error: fetchError } = await supabase
        .from('content_atoms')
        .select('*')
        .contains('kc_ids', [kcId])
        .limit(3);

      if (!fetchError && existingAtoms && existingAtoms.length > 0) {
        console.log(`✅ Found ${existingAtoms.length} existing atoms for KC ${kcId}`);
        
        const atoms: ContentAtom[] = existingAtoms.map(atom => ({
          atom_id: atom.id,
          atom_type: atom.atom_type,
          content: atom.content,
          kc_ids: atom.kc_ids,
          metadata: atom.metadata,
          version: atom.version,
          author_id: atom.author_id,
          created_at: atom.created_at,
          updated_at: atom.updated_at
        }));

        return {
          sequence_id: `seq_${kcId}_${Date.now()}`,
          atoms: atoms,
          kc_id: kcId,
          user_id: userId,
          created_at: new Date().toISOString()
        };
      }

      console.log(`🔄 No existing atoms found, generating with AI for KC ${kcId}`);
      
      // Fallback to AI generation with proper parameters
      const response = await supabase.functions.invoke('generate-adaptive-content', {
        body: {
          subject: 'mathematics',
          skillArea: 'add_fractions_likedenom',
          difficultyLevel: 2,
          userId: userId,
          kcId: kcId,
          gradeLevel: 4,
          requestType: 'atom_sequence',
          context: {
            timestamp: Date.now(),
            sessionId: `creative_${Date.now()}`,
            enhancedUniqueness: true
          }
        }
      });

      if (response.error) {
        console.error('❌ AI Creative Director error:', response.error);
        return this.generateFallbackSequence(kcId, userId);
      }

      if (!response.data?.generatedContent) {
        console.warn('⚠️ No content returned from AI, using fallback');
        return this.generateFallbackSequence(kcId, userId);
      }

      // Convert AI response to AtomSequence format
      const generatedContent = response.data.generatedContent;
      const atoms: ContentAtom[] = [{
        atom_id: `ai_${kcId}_${Date.now()}`,
        atom_type: 'QUESTION_MULTIPLE_CHOICE',
        content: {
          question: generatedContent.question,
          options: generatedContent.options,
          correctAnswer: generatedContent.correct,
          explanation: generatedContent.explanation
        },
        kc_ids: [kcId],
        metadata: {
          difficulty: 2,
          estimatedTimeMs: 60000,
          source: 'ai_generated',
          language: 'en-US'
        }
      }];

      const sequence: AtomSequence = {
        sequence_id: `ai_seq_${kcId}_${Date.now()}`,
        atoms: atoms,
        kc_id: kcId,
        user_id: userId,
        created_at: new Date().toISOString()
      };

      console.log(`✅ AI Creative Director: Generated sequence with ${sequence.atoms.length} atoms for KC ${kcId}`);
      return sequence;

    } catch (error) {
      console.error('💥 AI Creative Director exception:', error);
      return this.generateFallbackSequence(kcId, userId);
    }
  }

  private generateFallbackSequence(kcId: string, userId: string): AtomSequence {
    console.log(`🔄 Generating fallback sequence for KC ${kcId}`);
    
    const fallbackAtoms: ContentAtom[] = [
      {
        atom_id: `fallback_${kcId}_1`,
        atom_type: 'QUESTION_MULTIPLE_CHOICE',
        content: {
          question: 'What is 1/4 + 1/4?',
          options: ['1/8', '2/8', '2/4', '1/2'],
          correctAnswer: 2,
          explanation: 'When adding fractions with the same denominator, add the numerators: 1 + 1 = 2. Keep the denominator: 4. So 1/4 + 1/4 = 2/4.'
        },
        kc_ids: [kcId],
        metadata: {
          difficulty: 2,
          estimatedTimeMs: 45000,
          source: 'fallback_generator',
          language: 'en-US'
        }
      },
      {
        atom_id: `fallback_${kcId}_2`,
        atom_type: 'QUESTION_MULTIPLE_CHOICE',
        content: {
          question: 'What is 3/8 + 2/8?',
          options: ['5/16', '5/8', '6/8', '1/8'],
          correctAnswer: 1,
          explanation: 'Add the numerators: 3 + 2 = 5. Keep the denominator: 8. So 3/8 + 2/8 = 5/8.'
        },
        kc_ids: [kcId],
        metadata: {
          difficulty: 2,
          estimatedTimeMs: 45000,
          source: 'fallback_generator',
          language: 'en-US'
        }
      }
    ];

    return {
      sequence_id: `fallback_seq_${kcId}_${Date.now()}`,
      atoms: fallbackAtoms,
      kc_id: kcId,
      user_id: userId,
      created_at: new Date().toISOString()
    };
  }
}

export default new AICreativeDirectorService();
