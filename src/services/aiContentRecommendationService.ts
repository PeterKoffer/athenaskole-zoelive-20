
import { supabase } from '@/integrations/supabase/client';

export interface ContentRecommendation {
  content_id: string;
  subject: string;
  skill_area: string;
  difficulty_level: number;
  recommended_score: number;
}

export const aiContentRecommendationService = {
  async getRecommendations(
    _userId: string, 
    subject: string, 
    limit: number = 5
  ): Promise<ContentRecommendation[]> {
    try {
      // Use raw SQL query since the function might not be in types yet
      const { data, error } = await supabase
        .from('adaptive_content')
        .select('id, subject, skill_area, difficulty_level')
        .eq('subject', subject)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching AI content recommendations:', error);
        return [];
      }

      // Transform data to match ContentRecommendation interface
      return (data || []).map(item => ({
        content_id: item.id,
        subject: item.subject,
        skill_area: item.skill_area,
        difficulty_level: item.difficulty_level,
        recommended_score: 0.5 // Default score for now
      }));
    } catch (error) {
      console.error('Error in getRecommendations:', error);
      return [];
    }
  },

  async getAdaptiveContent(
    userId: string,
    subject: string,
    skillArea: string
  ) {
    try {
      // Get user's current performance level
      const { data: performance } = await supabase
        .from('user_performance')
        .select('current_level, accuracy_rate')
        .eq('user_id', userId)
        .eq('subject', subject)
        .eq('skill_area', skillArea)
        .single();

      // Determine appropriate difficulty level
      let targetDifficulty = 1;
      if (performance) {
        if (performance.accuracy_rate > 80) {
          targetDifficulty = Math.min(performance.current_level + 1, 10);
        } else if (performance.accuracy_rate < 50) {
          targetDifficulty = Math.max(performance.current_level - 1, 1);
        } else {
          targetDifficulty = performance.current_level;
        }
      }

      // Fetch content at the appropriate difficulty level
      const { data: content, error } = await supabase
        .from('adaptive_content')
        .select('*')
        .eq('subject', subject)
        .eq('skill_area', skillArea)
        .eq('difficulty_level', targetDifficulty)
        .limit(1)
        .single();

      if (error) {
        console.error('Error fetching adaptive content:', error);
        return null;
      }

      return content;
    } catch (error) {
      console.error('Error in getAdaptiveContent:', error);
      return null;
    }
  }
};
