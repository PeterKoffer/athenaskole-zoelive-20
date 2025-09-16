import { supabase } from "@/integrations/supabase/client";

export interface UniverseSelectionCriteria {
  userId?: string;
  gradeLevel?: string;
  subject?: string;
  preferences?: {
    curriculum?: string;
    difficulty?: string;
    learningStyle?: string;
    interests?: string[];
  };
}

export interface Universe {
  id: string;
  title: string;
  subject: string;
  grade_level: string;
  description: string;
  goals: any;
  metadata: any;
  image_url?: string;
  slug: string;
}

export interface UniverseContent {
  id: string;
  universe_id: string;
  summary: string;
  objectives: string[];
  activities: any;
}

export class DailyUniverseService {
  
  /**
   * Get today's universe for the user - either from cache or select a new one
   */
  static async getTodaysUniverse(criteria: UniverseSelectionCriteria = {}): Promise<{
    universe: Universe;
    content?: UniverseContent;
  }> {
    try {
      // For now, get a random universe from your collection
      // TODO: Implement sophisticated selection based on user progress, preferences, etc.
      const { data: universes, error } = await supabase
        .from('universes')
        .select('*')
        .eq('visibility', 'public')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error fetching universes:', error);
        throw error;
      }

      if (!universes || universes.length === 0) {
        throw new Error('No universes found');
      }

      // Simple selection - pick a random one for now
      const selectedUniverse = universes[Math.floor(Math.random() * universes.length)];

      // Try to get content for this universe
      const { data: content } = await supabase
        .from('universe_content')
        .select('*')
        .eq('universe_id', selectedUniverse.id)
        .single();

      return {
        universe: selectedUniverse as Universe,
        content: content as UniverseContent | undefined
      };

    } catch (error) {
      console.error('Error in getTodaysUniverse:', error);
      throw error;
    }
  }

  /**
   * Get all available universes (for admin/selection)
   */
  static async getAllUniverses(): Promise<Universe[]> {
    const { data, error } = await supabase
      .from('universes')
      .select('*')
      .eq('visibility', 'public')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data as Universe[];
  }

  /**
   * Get universe count
   */
  static async getUniverseCount(): Promise<number> {
    const { count, error } = await supabase
      .from('universes')
      .select('*', { count: 'exact', head: true });

    if (error) {
      throw error;
    }

    return count || 0;
  }
}