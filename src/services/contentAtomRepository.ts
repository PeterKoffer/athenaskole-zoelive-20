
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
        throw error;
      }

      if (!data) {
        return null;
      }

      // Map Supabase row to ContentAtom type
      return this.mapDbRowToContentAtom(data);
    } catch (err) {
      // Only log in development
      if (process.env.NODE_ENV === 'development') {
        console.error(`ContentAtomRepository: Exception fetching atom by ID ${id}:`, err);
      }
      return null;
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
        throw error;
      }

      if (!data || data.length === 0) {
        return [];
      }

      return data.map(dbAtom => this.mapDbRowToContentAtom(dbAtom));
    } catch (err) {
      // Only log in development
      if (process.env.NODE_ENV === 'development') {
        console.error(`ContentAtomRepository: Exception fetching atoms for KC ID ${kcId}:`, err);
      }
      return [];
    }
  }

  /**
   * Maps a database row to a ContentAtom object.
   * @param dbAtom - The database row object
   * @returns A ContentAtom object
   */
  private mapDbRowToContentAtom(dbAtom: any): ContentAtom {
    return {
      atom_id: dbAtom.id,
      atom_type: dbAtom.atom_type,
      content: dbAtom.content,
      kc_ids: dbAtom.kc_ids || [],
      metadata: dbAtom.metadata,
      version: dbAtom.version,
      author_id: dbAtom.author_id,
      created_at: dbAtom.created_at,
      updated_at: dbAtom.updated_at,
    };
  }

  /**
   * Adds a new content atom to the database.
   * @param atomData - Partial content atom data
   * @returns The created ContentAtom or null if failed
   */
  async addAtom(atomData: Partial<ContentAtom>): Promise<ContentAtom | null> {
    try {
      const { data, error } = await supabase
        .from('content_atoms')
        .insert([
          {
            atom_type: atomData.atom_type,
            kc_ids: atomData.kc_ids,
            content: atomData.content,
            metadata: atomData.metadata,
            version: atomData.version || 1,
            author_id: atomData.author_id,
          },
        ])
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data ? this.mapDbRowToContentAtom(data) : null;
    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        console.error('ContentAtomRepository: Exception adding atom:', err);
      }
      return null;
    }
  }

  /**
   * Updates an existing content atom.
   * @param id - The atom ID to update
   * @param updates - Partial updates to apply
   * @returns The updated ContentAtom or null if failed
   */
  async updateAtom(id: string, updates: Partial<ContentAtom>): Promise<ContentAtom | null> {
    try {
      const { data, error } = await supabase
        .from('content_atoms')
        .update({
          atom_type: updates.atom_type,
          content: updates.content,
          kc_ids: updates.kc_ids,
          metadata: updates.metadata,
          version: updates.version,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data ? this.mapDbRowToContentAtom(data) : null;
    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        console.error(`ContentAtomRepository: Exception updating atom ${id}:`, err);
      }
      return null;
    }
  }

  /**
   * Deletes a content atom by ID.
   * @param id - The atom ID to delete
   * @returns True if successful, false otherwise
   */
  async deleteAtom(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('content_atoms')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      return true;
    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        console.error(`ContentAtomRepository: Exception deleting atom ${id}:`, err);
      }
      return false;
    }
  }
}

// Export a singleton instance
export const contentAtomRepository = new ContentAtomRepository();
