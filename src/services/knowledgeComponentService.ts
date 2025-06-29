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
    curriculumStandards: (row.curriculum_standards as CurriculumStandardLink[] | null) ?? undefined,
    prerequisiteKcs: row.prerequisite_kcs ?? undefined,
    postrequisiteKcs: row.postrequisite_kcs ?? undefined,
    tags: row.tags ?? undefined,
    difficultyEstimate: row.difficulty_estimate === null ? undefined : Number(row.difficulty_estimate),
    // created_at and updated_at can be added if needed in the type
  };
};

// Helper to map from KnowledgeComponent type to DB insert/update row
// Ensures that optional array fields are at least null for Supabase if not provided
const mapKcToDbRow = (
  kcData: Partial<Omit<KnowledgeComponent, 'id'>> & { id?: string }
): Partial<Database['public']['Tables']['knowledge_components']['Insert']> => {
  const dbRow: Partial<Database['public']['Tables']['knowledge_components']['Insert']> = {};

  if (kcData.id !== undefined) dbRow.id = kcData.id; // Required for insert if not auto-generated
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
      if (error.code === 'PGRST116') return undefined; // Not found
      console.error(`KnowledgeComponentService: Error fetching KC by ID (${id}):`, error.message);
      // Consider throwing a more specific error or returning a result object
      // For now, re-throwing to make it visible, but could be handled more gracefully
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
    // Filter out any undefined/null IDs from prerequisiteKcs if array might contain them
    const validPrereqIds = targetKc.prerequisiteKcs.filter(id => id != null) as string[];
    if (validPrereqIds.length === 0) return [];
    return this.getKcsByIds(validPrereqIds);
  }

  async searchKcs(query: string): Promise<KnowledgeComponent[]> {
    const lowerQuery = query.toLowerCase();
    if (!lowerQuery.trim()) return []; // Return empty if query is blank

    // Using textSearch with a generated tsvector column would be more performant for larger datasets.
    // For now, using OR with ILIKE and array containment.
    // Note: `tags.cs.{${query}}` might not work as expected if query has commas.
    // A better approach for tags would be `tags @> ARRAY['search_tag']` if tags are exact.
    // Or use full-text search on tags as well.
    // This version searches for the query string within any part of name/description,
    // and checks if any tag *contains* the query string (less precise but simple).
    const { data, error } = await supabase
      .from('knowledge_components')
      .select('*')
      .or(`name.ilike.%${lowerQuery}%,description.ilike.%${lowerQuery}%,id.ilike.%${lowerQuery}%`)
      // Searching within tags array needs a different approach, e.g., a function or iterating post-fetch for simple ILIKE.
      // For now, this OR condition is simplified. A proper tag search would be more complex.
      .limit(50);

    if (error) {
      console.error('KnowledgeComponentService: Error searching KCs:', error.message);
      throw error;
    }
    
    // Additional client-side filtering for tags if the DB query is not sufficient
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
    
    // Ensure 'id' is part of dbRowData for insert, as it's not auto-generated in this schema
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
    // Ensure 'updated_at' is handled by trigger or set manually if trigger isn't there/working
    // updateData.updated_at = new Date().toISOString();

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

  // This was a method in the old mock service, not part of IKnowledgeComponentService
  // It should be implemented elsewhere if generic recommendations are needed.
  // For now, commenting out to align with the interface and new DB-backed approach.
  // async recommendNextKcs(userId: string, count: number = 3, excludedKcIds: string[] = []): Promise<KnowledgeComponent[]> {
  //   console.warn("KnowledgeComponentService: recommendNextKcs is not implemented in the DB version yet. Placeholder.");
  //   // Basic placeholder: fetch some KCs, excluding specific ones.
  //   // This would need actual recommendation logic based on user profile, etc.
  //   let query = supabase.from('knowledge_components').select('*').limit(count);
  //   if(excludedKcIds.length > 0) {
  //       query = query.not('id', 'in', `(${excludedKcIds.join(',')})`);
  //   }
  //   const { data, error } = await query;
  //   if (error) {
  //       console.error('Error fetching KCs for recommendation placeholder:', error);
  //       return [];
  //   }
  //   return data ? data.map(mapRowToKc) : [];
  // }
}

export const knowledgeComponentService = new KnowledgeComponentService();

// Type alias for JSON, can be found in supabase/types.ts
type Json = Database['public']['Tables']['knowledge_components']['Row']['curriculum_standards'];
