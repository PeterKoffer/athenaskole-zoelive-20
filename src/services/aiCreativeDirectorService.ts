
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
      
      // Get KC details
      const { data: kc, error: kcError } = await supabase
        .from('knowledge_components')
        .select('*')
        .eq('id', kcId)
        .single();

      if (kcError || !kc) {
        console.error('❌ Failed to fetch KC details:', kcError);
        throw new Error(`Knowledge component not found: ${kcId}`);
      }

      // Generate atoms using AI
      const atoms = await this.generateAtomsForKc(kc, userId);
      
      if (!atoms || atoms.length === 0) {
        console.error('❌ No atoms generated for KC:', kcId);
        return null;
      }

      const sequence: AtomSequence = {
        sequence_id: `seq_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        atoms: atoms,
        kc_id: kcId,
        user_id: userId,
        created_at: new Date().toISOString()
      };

      console.log('✅ Generated atom sequence:', {
        sequenceId: sequence.sequence_id,
        atomCount: atoms.length,
        kcId: kcId
      });

      return sequence;

    } catch (error) {
      console.error('❌ AICreativeDirectorService error:', error);
      throw error;
    }
  }

  private async generateAtomsForKc(kc: any, userId: string): Promise<any[]> {
    try {
      console.log('🔄 Generating atoms for KC:', kc.name);

      // Call the generate-question edge function
      const { data, error } = await supabase.functions.invoke('generate-question', {
        body: {
          subject: kc.subject,
          skillArea: kc.name,
          difficultyLevel: kc.difficulty_estimate || 0.5,
          userId: userId,
          gradeLevel: kc.grade_levels?.[0] || 8,
          kcId: kc.id,
          requestType: 'atom_sequence'
        }
      });

      if (error) {
        console.error('❌ Edge function error:', error);
        throw error;
      }

      if (!data || !data.atoms) {
        console.error('❌ No atoms returned from edge function');
        return [];
      }

      console.log('✅ Generated atoms:', data.atoms.length);
      return data.atoms;

    } catch (error) {
      console.error('❌ Error generating atoms:', error);
      // Return fallback atoms
      return this.generateFallbackAtoms(kc);
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
          source: 'fallback_generator'
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
          explanation: `${kc.name} is indeed a fundamental concept that forms the basis for more advanced topics.`,
          correctFeedback: 'Excellent! You understand the importance of this concept.',
          generalIncorrectFeedback: 'Not quite right. Let me explain why this concept is important.'
        },
        kc_ids: [kc.id],
        metadata: {
          difficulty: kc.difficulty_estimate || 0.5,
          estimatedTimeMs: 45000,
          source: 'fallback_generator'
        }
      }
    ];
  }
}

export default new AICreativeDirectorService();
