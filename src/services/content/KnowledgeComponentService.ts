
import { supabase } from '@/integrations/supabase/client';

export interface KnowledgeComponent {
  id: string;
  name: string;
  description?: string;
  subject: string;
  domain?: string;
  grade_levels?: number[];
  difficulty_estimate?: number;
}

class KnowledgeComponentService {
  async getKnowledgeComponent(kcId: string): Promise<KnowledgeComponent | null> {
    console.log('🔍 Fetching KC details for:', kcId);
    
    const { data: kc, error } = await supabase
      .from('knowledge_components')
      .select('*')
      .eq('id', kcId)
      .single();

    if (error) {
      console.error('❌ Failed to fetch KC details:', error);
      return null;
    }

    if (!kc) {
      console.error('❌ Knowledge component not found:', kcId);
      return null;
    }

    console.log('✅ KC details loaded:', kc.name);
    return kc as KnowledgeComponent;
  }

  getAvailableKCs(): KnowledgeComponent[] {
    // This could be expanded to fetch from database
    return [
      {
        id: 'kc_math_g4_add_fractions_likedenom',
        name: 'Adding Fractions with Like Denominators',
        subject: 'Mathematics',
        grade_levels: [4],
        difficulty_estimate: 0.4
      },
      {
        id: 'kc_math_g3_multiplication_basic',
        name: 'Basic Multiplication',
        subject: 'Mathematics',
        grade_levels: [3],
        difficulty_estimate: 0.3
      },
      {
        id: 'kc_english_g5_reading_comprehension',
        name: 'Reading Comprehension',
        subject: 'English',
        grade_levels: [5],
        difficulty_estimate: 0.5
      }
    ];
  }
}

export default new KnowledgeComponentService();
