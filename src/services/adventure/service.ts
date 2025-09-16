import { supabase } from "@/integrations/supabase/client";

export interface AdventureUniverse {
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

export interface AdventureContent {
  id: string;
  universe_id: string;
  summary: string;
  objectives: string[];
  activities: any;
}

export interface AdventureProgress {
  id: string;
  student_id: string;
  universe_id: string;
  completed_at: Date;
  is_recap: boolean;
  performance_score?: number;
}

export interface AdventureSelectionCriteria {
  userId: string;
  gradeLevel?: string;
  subject?: string;
  preferences?: {
    curriculum?: string;
    difficulty?: string;
    learningStyle?: string;
    interests?: string[];
  };
}

export class AdventureService {
  
  /**
   * Get today's adventure for the student
   * Ensures they never see the same universe twice (unless recap)
   */
  static async getTodaysAdventure(criteria: AdventureSelectionCriteria): Promise<{
    universe: AdventureUniverse;
    content?: AdventureContent;
    isRecap: boolean;
  }> {
    try {
      // First, get all universes the student has already completed
      const { data: completedAdventures } = await supabase
        .from('student_adventures')
        .select('universe_id, is_recap')
        .eq('student_id', criteria.userId);

      const completedUniverseIds = completedAdventures
        ?.filter(a => !a.is_recap)
        .map(a => a.universe_id) || [];

      // Get available universes that haven't been completed
      let query = supabase
        .from('universes')
        .select('*')
        .eq('visibility', 'public');

      // Exclude already completed universes (unless we need a recap)
      if (completedUniverseIds.length > 0) {
        query = query.not('id', 'in', `(${completedUniverseIds.join(',')})`);
      }

      const { data: availableUniverses, error } = await query.limit(20);

      if (error) {
        console.error('Error fetching universes:', error);
        throw error;
      }

      let selectedUniverse: AdventureUniverse;
      let isRecap = false;

      if (!availableUniverses || availableUniverses.length === 0) {
        // No new universes available - time for a recap!
        if (completedUniverseIds.length === 0) {
          throw new Error('No universes found');
        }

        // Select a random completed universe for recap
        const { data: recapUniverses, error: recapError } = await supabase
          .from('universes')
          .select('*')
          .in('id', completedUniverseIds)
          .limit(10);

        if (recapError || !recapUniverses || recapUniverses.length === 0) {
          throw new Error('No universes available for recap');
        }

        selectedUniverse = recapUniverses[Math.floor(Math.random() * recapUniverses.length)] as AdventureUniverse;
        isRecap = true;
      } else {
        // Select a random new universe
        selectedUniverse = availableUniverses[Math.floor(Math.random() * availableUniverses.length)] as AdventureUniverse;
      }

      // Try to get content for this universe
      const { data: content } = await supabase
        .from('universe_content')
        .select('*')
        .eq('universe_id', selectedUniverse.id)
        .single();

      return {
        universe: selectedUniverse,
        content: content as AdventureContent | undefined,
        isRecap
      };

    } catch (error) {
      console.error('Error in getTodaysAdventure:', error);
      throw error;
    }
  }

  /**
   * Mark an adventure as completed
   */
  static async completeAdventure(
    studentId: string, 
    universeId: string, 
    isRecap: boolean = false, 
    performanceScore?: number
  ): Promise<void> {
    const { error } = await supabase
      .from('student_adventures')
      .insert({
        student_id: studentId,
        universe_id: universeId,
        is_recap: isRecap,
        performance_score: performanceScore
      });

    if (error) {
      console.error('Error completing adventure:', error);
      throw error;
    }
  }

  /**
   * Get student's adventure history
   */
  static async getAdventureHistory(studentId: string): Promise<AdventureProgress[]> {
    const { data, error } = await supabase
      .from('student_adventures')
      .select('*')
      .eq('student_id', studentId)
      .order('completed_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data.map(item => ({
      ...item,
      completed_at: new Date(item.completed_at)
    })) as AdventureProgress[];
  }

  /**
   * Get adventure statistics
   */
  static async getAdventureStats(studentId: string): Promise<{
    totalCompleted: number;
    totalRecaps: number;
    averageScore: number;
    streak: number;
  }> {
    const { data } = await supabase
      .from('student_adventures')
      .select('performance_score, is_recap, completed_at')
      .eq('student_id', studentId)
      .order('completed_at', { ascending: false });

    if (!data) {
      return { totalCompleted: 0, totalRecaps: 0, averageScore: 0, streak: 0 };
    }

    const totalCompleted = data.filter(a => !a.is_recap).length;
    const totalRecaps = data.filter(a => a.is_recap).length;
    const scoresWithData = data.filter(a => a.performance_score !== null);
    const averageScore = scoresWithData.length > 0 
      ? scoresWithData.reduce((sum, a) => sum + (a.performance_score || 0), 0) / scoresWithData.length
      : 0;

    // Calculate streak (consecutive days with adventures)
    // TODO: Implement proper streak calculation based on dates
    const streak = data.length; // Simplified for now

    return {
      totalCompleted,
      totalRecaps,
      averageScore: Math.round(averageScore),
      streak
    };
  }
}