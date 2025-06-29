
// src/services/knowledgeComponentService.ts
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import type {
  KnowledgeComponent,
  IKnowledgeComponentService,
  CurriculumStandardLink,
} from '@/types/knowledgeComponent';

// Helper to map from DB row to KnowledgeComponent type
const mapRowToKc = (
  row: Database['public']['Tables']['knowledge_components']['Row']
): KnowledgeComponent => {
  return {
    id: row.id,
    name: row.name,
    description: row.description ?? undefined,
    subject: row.subject,
    gradeLevels: row.grade_levels ?? [],
    domain: row.domain ?? undefined,
    curriculumStandards: row.curriculum_standards ? (row.curriculum_standards as unknown as CurriculumStandardLink[]) : undefined,
    prerequisiteKcs: row.prerequisite_kcs ?? undefined,
    postrequisiteKcs: row.postrequisite_kcs ?? undefined,
    tags: row.tags ?? undefined,
    difficultyEstimate: row.difficulty_estimate === null ? undefined : Number(row.difficulty_estimate),
  };
};

// Helper to map from KnowledgeComponent type to DB insert/update row
const mapKcToDbRow = (
  kcData: Partial<Omit<KnowledgeComponent, 'id'>> & { id?: string }
): Partial<Database['public']['Tables']['knowledge_components']['Insert']> => {
  const dbRow: Partial<Database['public']['Tables']['knowledge_components']['Insert']> = {};

  if (kcData.id !== undefined) dbRow.id = kcData.id;
  if (kcData.name !== undefined) dbRow.name = kcData.name;
  dbRow.description = kcData.description ?? null;
  if (kcData.subject !== undefined) dbRow.subject = kcData.subject;
  dbRow.grade_levels = kcData.gradeLevels ?? null;
  dbRow.domain = kcData.domain ?? null;
  dbRow.curriculum_standards = (kcData.curriculumStandards as unknown as Json) ?? null;
  dbRow.prerequisite_kcs = kcData.prerequisiteKcs ?? null;
  dbRow.postrequisite_kcs = kcData.postrequisiteKcs ?? null;
  dbRow.tags = kcData.tags ?? null;
  dbRow.difficulty_estimate = kcData.difficultyEstimate ?? null;

  return dbRow;
};

class KnowledgeComponentService implements IKnowledgeComponentService {
  async getKcById(id: string): Promise<KnowledgeComponent | undefined> {
    const { data, error } = await supabase
      .from('knowledge_components')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return undefined;
      console.error(`KnowledgeComponentService: Error fetching KC by ID (${id}):`, error.message);
      throw error;
    }
    return data ? mapRowToKc(data) : undefined;
  }

  async getKcsByIds(ids: string[]): Promise<KnowledgeComponent[]> {
    if (!ids || ids.length === 0) return [];
    const { data, error } = await supabase
      .from('knowledge_components')
      .select('*')
      .in('id', ids);

    if (error) {
      console.error('KnowledgeComponentService: Error fetching KCs by IDs:', error.message);
      throw error;
    }
    return data ? data.map(mapRowToKc) : [];
  }

  async getKcsBySubjectAndGrade(subject: string, gradeLevel: number): Promise<KnowledgeComponent[]> {
    const { data, error } = await supabase
      .from('knowledge_components')
      .select('*')
      .eq('subject', subject)
      .contains('grade_levels', [gradeLevel]);

    if (error) {
      console.error('KnowledgeComponentService: Error fetching KCs by subject and grade:', error.message);
      throw error;
    }
    return data ? data.map(mapRowToKc) : [];
  }

  async getPrerequisiteKcs(kcId: string): Promise<KnowledgeComponent[]> {
    const targetKc = await this.getKcById(kcId);
    if (!targetKc || !targetKc.prerequisiteKcs || targetKc.prerequisiteKcs.length === 0) {
      return [];
    }
    const validPrereqIds = targetKc.prerequisiteKcs.filter(id => id != null) as string[];
    if (validPrereqIds.length === 0) return [];
    return this.getKcsByIds(validPrereqIds);
  }

  async searchKcs(query: string): Promise<KnowledgeComponent[]> {
    const lowerQuery = query.toLowerCase();
    if (!lowerQuery.trim()) {
      const { data, error } = await supabase
        .from('knowledge_components')
        .select('*')
        .limit(50);

      if (error) {
        console.error('KnowledgeComponentService: Error fetching all KCs:', error.message);
        throw error;
      }
      return data ? data.map(mapRowToKc) : [];
    }

    const { data, error } = await supabase
      .from('knowledge_components')
      .select('*')
      .or(`name.ilike.%${lowerQuery}%,description.ilike.%${lowerQuery}%,id.ilike.%${lowerQuery}%`)
      .limit(50);

    if (error) {
      console.error('KnowledgeComponentService: Error searching KCs:', error.message);
      throw error;
    }
    
    return data ? data.filter(row => {
        const kc = mapRowToKc(row);
        if (kc.name.toLowerCase().includes(lowerQuery)) return true;
        if (kc.description?.toLowerCase().includes(lowerQuery)) return true;
        if (kc.id.toLowerCase().includes(lowerQuery)) return true;
        if (kc.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))) return true;
        return false;
    }).map(mapRowToKc) : [];
  }

  async addKc(kcData: Omit<KnowledgeComponent, 'id'> & { id: string }): Promise<KnowledgeComponent> {
    const dbRowData = mapKcToDbRow(kcData) as Database['public']['Tables']['knowledge_components']['Insert'];
    
    if (!dbRowData.id) {
        throw new Error("KnowledgeComponentService: KC ID is required for addKc operation.");
    }

    const { data, error } = await supabase
      .from('knowledge_components')
      .insert(dbRowData)
      .select()
      .single();

    if (error) {
      console.error('KnowledgeComponentService: Error adding KC:', error.message, error.details);
      throw error;
    }
    return mapRowToKc(data);
  }

  async updateKc(id: string, updates: Partial<Omit<KnowledgeComponent, 'id'>>): Promise<KnowledgeComponent | undefined> {
    const updateData = mapKcToDbRow(updates);

    if (Object.keys(updateData).length === 0) {
      return this.getKcById(id);
    }

    const { data, error } = await supabase
      .from('knowledge_components')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error(`KnowledgeComponentService: Error updating KC (${id}):`, error.message);
      throw error;
    }
    return data ? mapRowToKc(data) : undefined;
  }

  async deleteKc(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('knowledge_components')
      .delete()
      .eq('id', id);

    if (error) {
      console.error(`KnowledgeComponentService: Error deleting KC (${id}):`, error.message);
      return false;
    }
    return true;
  }

  async recommendNextKcs(userId: string, count: number = 3, excludedKcIds: string[] = []): Promise<KnowledgeComponent[]> {
    console.log(`KnowledgeComponentService: Recommending ${count} KCs for user ${userId}`);
    
    let query = supabase.from('knowledge_components').select('*').limit(count * 2);
    
    if (excludedKcIds.length > 0) {
      query = query.not('id', 'in', `(${excludedKcIds.map(id => `"${id}"`).join(',')})`);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching KCs for recommendation:', error);
      return [];
    }
    
    const kcs = data ? data.map(mapRowToKc) : [];
    
    kcs.sort((a, b) => (a.difficultyEstimate || 0) - (b.difficultyEstimate || 0));
    
    const recommended = kcs.slice(0, count);
    console.log(`KnowledgeComponentService: Recommended KCs:`, recommended.map(kc => kc.id));
    
    return recommended;
  }
}

export const knowledgeComponentService = new KnowledgeComponentService();

type Json = Database['public']['Tables']['knowledge_components']['Row']['curriculum_standards'];
