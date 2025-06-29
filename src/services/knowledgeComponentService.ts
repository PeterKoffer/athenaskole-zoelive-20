
import { supabase } from '@/integrations/supabase/client';
import type { KnowledgeComponent } from '@/types/knowledgeComponent';

class KnowledgeComponentService {
  async getAllKcs(): Promise<KnowledgeComponent[]> {
    try {
      const { data, error } = await supabase
        .from('knowledge_components')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error fetching knowledge components:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getAllKcs:', error);
      throw error;
    }
  }

  async getKcById(id: string): Promise<KnowledgeComponent | null> {
    try {
      const { data, error } = await supabase
        .from('knowledge_components')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching KC by ID:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in getKcById:', error);
      throw error;
    }
  }

  async getKcsBySubject(subject: string): Promise<KnowledgeComponent[]> {
    try {
      const { data, error } = await supabase
        .from('knowledge_components')
        .select('*')
        .eq('subject', subject)
        .order('name');

      if (error) {
        console.error('Error fetching KCs by subject:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getKcsBySubject:', error);
      throw error;
    }
  }

  async addKc(kc: Omit<KnowledgeComponent, 'created_at' | 'updated_at'>): Promise<KnowledgeComponent> {
    try {
      const { data, error } = await supabase
        .from('knowledge_components')
        .insert([{
          id: kc.id,
          name: kc.name,
          description: kc.description,
          subject: kc.subject,
          grade_levels: kc.gradeLevels,
          domain: kc.domain,
          curriculum_standards: kc.curriculumStandards,
          prerequisite_kcs: kc.prerequisiteKcs,
          postrequisite_kcs: kc.postrequisiteKcs,
          tags: kc.tags,
          difficulty_estimate: kc.difficultyEstimate
        }])
        .select()
        .single();

      if (error) {
        console.error('Error adding KC:', error);
        throw error;
      }

      return {
        id: data.id,
        name: data.name,
        description: data.description,
        subject: data.subject,
        gradeLevels: data.grade_levels,
        domain: data.domain,
        curriculumStandards: data.curriculum_standards,
        prerequisiteKcs: data.prerequisite_kcs,
        postrequisiteKcs: data.postrequisite_kcs,
        tags: data.tags,
        difficultyEstimate: data.difficulty_estimate
      };
    } catch (error) {
      console.error('Error in addKc:', error);
      throw error;
    }
  }

  async updateKc(id: string, updates: Partial<KnowledgeComponent>): Promise<KnowledgeComponent> {
    try {
      const { data, error } = await supabase
        .from('knowledge_components')
        .update({
          name: updates.name,
          description: updates.description,
          subject: updates.subject,
          grade_levels: updates.gradeLevels,
          domain: updates.domain,
          curriculum_standards: updates.curriculumStandards,
          prerequisite_kcs: updates.prerequisiteKcs,
          postrequisite_kcs: updates.postrequisiteKcs,
          tags: updates.tags,
          difficulty_estimate: updates.difficultyEstimate
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating KC:', error);
        throw error;
      }

      return {
        id: data.id,
        name: data.name,
        description: data.description,
        subject: data.subject,
        gradeLevels: data.grade_levels,
        domain: data.domain,
        curriculumStandards: data.curriculum_standards,
        prerequisiteKcs: data.prerequisite_kcs,
        postrequisiteKcs: data.postrequisite_kcs,
        tags: data.tags,
        difficultyEstimate: data.difficulty_estimate
      };
    } catch (error) {
      console.error('Error in updateKc:', error);
      throw error;
    }
  }

  async deleteKc(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('knowledge_components')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting KC:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error in deleteKc:', error);
      throw error;
    }
  }
}

export const knowledgeComponentService = new KnowledgeComponentService();
