
// src/services/contentAtomRepository.ts
import { supabase } from '@/integrations/supabase/client';

// Temporarily defining ContentAtom here. Ideally, this would be in src/types/content.ts
// and imported. This definition is based on the Supabase schema and previous discussion.
export interface ContentAtom {
  atom_id: string; // Maps to 'id' (uuid) in Supabase
  atom_type: 'TEXT_EXPLANATION' | 'QUESTION_MULTIPLE_CHOICE' | 'INTERACTIVE_EXERCISE' | string; // Allow other string types
  content: any; // Maps to 'content' (jsonb)
  kc_ids: string[]; // Maps to 'kc_ids' (text[], NOT NULL in DB)
  metadata?: any; // Maps to 'metadata' (jsonb, nullable)
  version?: number; // Maps to 'version'
  author_id?: string; // Maps to 'author_id' (uuid)
  created_at?: string; // Maps to 'created_at' (timestamptz)
  updated_at?: string; // Maps to 'updated_at' (timestamptz)
}

export class ContentAtomRepository {
  /**
   * Fetches a single content atom by its ID from Supabase.
   * @param id - The UUID of the content atom.
   * @returns A ContentAtom object or null if not found or an error occurs.
   */
  async getAtomById(id: string): Promise<ContentAtom | null> {
    try {
      const { data, error } = await supabase
        .from('content_atoms')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') { // PostgREST error code for "object not found"
          return null;
        }
        console.error('ContentAtomRepository: Error fetching atom by ID from Supabase:', error);
        throw error; // Re-throw other errors
      }

      if (!data) {
        return null;
      }

      // Map Supabase row to ContentAtom type
      const atom: ContentAtom = {
        atom_id: data.id,
        atom_type: data.atom_type,
        content: data.content,
        kc_ids: data.kc_ids || [], // Ensure kc_ids is always an array
        metadata: data.metadata,
        version: data.version,
        author_id: data.author_id,
        created_at: data.created_at,
        updated_at: data.updated_at,
      };
      return atom;
    } catch (err) {
      console.error(`ContentAtomRepository: Exception fetching atom by ID ${id}:`, err);
      return null; // Return null on exception to prevent breaking caller
    }
  }

  /**
   * Fetches all content atoms associated with a specific Knowledge Component ID.
   * @param kcId - The Knowledge Component ID.
   * @returns An array of ContentAtom objects.
   */
  async getAtomsByKcId(kcId: string): Promise<ContentAtom[]> {
    try {
      const { data, error } = await supabase
        .from('content_atoms')
        .select('*')
        .contains('kc_ids', [kcId]); // Use 'contains' for array membership

      if (error) {
        console.error('ContentAtomRepository: Error fetching atoms by KC ID from Supabase:', error);
        throw error;
      }

      if (!data || data.length === 0) {
        return [];
      }

      const atoms: ContentAtom[] = data.map(dbAtom => ({
        atom_id: dbAtom.id,
        atom_type: dbAtom.atom_type,
        content: dbAtom.content,
        kc_ids: dbAtom.kc_ids || [],
        metadata: dbAtom.metadata,
        version: dbAtom.version,
        author_id: dbAtom.author_id,
        created_at: dbAtom.created_at,
        updated_at: dbAtom.updated_at,
      }));
      return atoms;
    } catch (err) {
      console.error(`ContentAtomRepository: Exception fetching atoms for KC ID ${kcId}:`, err);
      return []; // Return empty array on exception
    }
  }

  // Add other methods like getAtomsByType, findAtoms, addAtom as needed,
  // following a similar pattern of Supabase interaction and error handling.
  // For now, focusing on the read operations needed by AiCreativeDirectorService.

  /**
   * (Placeholder) Adds a new content atom to the database.
   * For now, it just logs. Implement Supabase insert if needed.
   */
  async addAtom(atomData: Partial<ContentAtom>): Promise<ContentAtom | null> {
    // To implement:
    // const { data, error } = await supabase
    //   .from('content_atoms')
    //   .insert([
    //     {
    //       atom_type: atomData.atom_type,
    //       kc_ids: atomData.kc_ids,
    //       content: atomData.content,
    //       metadata: atomData.metadata,
    //       // ... other fields, handle defaults and nullables
    //     },
    //   ])
    //   .select()
    //   .single();
    // if (error) { ... }
    // return mapped data;
    return null;
  }
}

// Export a singleton instance
export const contentAtomRepository = new ContentAtomRepository();
