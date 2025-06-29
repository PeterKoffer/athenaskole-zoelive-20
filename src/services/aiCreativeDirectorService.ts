
import { supabase } from '@/integrations/supabase/client';
import type { ContentAtom, AtomSequence } from '@/types/content';

class AICreativeDirectorService {
  async getAtomSequenceForKc(kcId: string, userId: string): Promise<AtomSequence | null> {
    try {
      console.log(`🎨 AI Creative Director: Generating content for KC ${kcId}, User ${userId}`);
      
      // Generate AI-powered content sequence
      const response = await supabase.functions.invoke('generate-adaptive-content', {
        body: {
          kcId,
          userId,
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

      if (!response.data?.sequence) {
        console.warn('⚠️ No sequence returned from AI, using fallback');
        return this.generateFallbackSequence(kcId, userId);
      }

      const sequence: AtomSequence = {
        sequence_id: `seq_${kcId}_${Date.now()}`,
        atoms: response.data.sequence.atoms || [],
        kc_id: kcId,
        user_id: userId,
        created_at: new Date().toISOString()
      };

      console.log(`✅ AI Creative Director: Generated ${sequence.atoms.length} atoms for KC ${kcId}`);
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
          question: 'What is an important concept to practice?',
          options: ['Understanding the basics', 'Practicing regularly', 'Getting help when needed', 'All of the above'],
          correctAnswer: 3,
          explanation: 'All of these are important for learning success!'
        },
        kc_ids: [kcId],
        metadata: {
          difficulty: 0.3,
          estimatedTimeMs: 30000,
          source: 'fallback_generator'
        }
      },
      {
        atom_id: `fallback_${kcId}_2`,
        atom_type: 'QUESTION_MULTIPLE_CHOICE',
        content: {
          question: 'How can you improve your understanding?',
          options: ['Skip difficult problems', 'Practice similar problems', 'Memorize without understanding', 'Give up quickly'],
          correctAnswer: 1,
          explanation: 'Practicing similar problems helps build understanding and confidence!'
        },
        kc_ids: [kcId],
        metadata: {
          difficulty: 0.4,
          estimatedTimeMs: 35000,
          source: 'fallback_generator'
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
