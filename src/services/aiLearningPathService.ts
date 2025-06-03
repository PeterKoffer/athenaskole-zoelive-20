
import { supabase } from '@/integrations/supabase/client';
import { pathGenerationService } from './learningPath';

export interface AIPathGenerationOptions {
  userId: string;
  subject: string;
  currentLevel?: number;
  weakAreas?: string[];
  preferredPace?: 'slow' | 'medium' | 'fast';
  availableTimePerDay?: number;
  learningStyle?: 'visual' | 'auditory' | 'kinesthetic' | 'mixed';
}

export const aiLearningPathService = {
  async generatePersonalizedPath(options: AIPathGenerationOptions): Promise<string | null> {
    try {
      // Get user's performance data
      const { data: performance } = await supabase
        .from('user_performance')
        .select('*')
        .eq('user_id', options.userId)
        .eq('subject', options.subject);

      // Get concept mastery data
      const { data: mastery } = await supabase
        .from('concept_mastery')
        .select('*')
        .eq('user_id', options.userId)
        .eq('subject', options.subject)
        .order('mastery_level', { ascending: true });

      // Analyze weak areas
      const weakConcepts = mastery?.filter(m => m.mastery_level < 0.7).map(m => m.concept_name) || [];
      
      // Generate targeted concepts based on weak areas
      const targetConcepts = [...weakConcepts, ...(options.weakAreas || [])];

      // Call the path generation service
      const pathId = await pathGenerationService.generateLearningPath(
        options.userId,
        options.subject,
        targetConcepts
      );

      if (pathId) {
        // Update path with AI-enhanced metadata
        await this.enhancePathWithAI(pathId, options);
      }

      return pathId;
    } catch (error) {
      console.error('Error generating AI-personalized path:', error);
      return null;
    }
  },

  async enhancePathWithAI(pathId: string, options: AIPathGenerationOptions): Promise<void> {
    try {
      // Calculate estimated completion time based on user's pace
      const baseTime = 30; // base minutes per step
      const paceMultiplier = {
        slow: 1.5,
        medium: 1.0,
        fast: 0.7
      }[options.preferredPace || 'medium'];

      const estimatedTime = Math.round(baseTime * paceMultiplier);

      // Update pathway with enhanced data
      await supabase
        .from('learning_pathways')
        .update({
          estimated_completion_time: estimatedTime,
          description: `AI-generated personalized learning path for ${options.subject}`,
          updated_at: new Date().toISOString()
        })
        .eq('id', pathId);

    } catch (error) {
      console.error('Error enhancing path with AI:', error);
    }
  },

  async getAdaptiveRecommendations(userId: string, subject: string): Promise<string[]> {
    try {
      // Get recent performance
      const { data: sessions } = await supabase
        .from('learning_sessions')
        .select('*')
        .eq('user_id', userId)
        .eq('subject', subject)
        .order('created_at', { ascending: false })
        .limit(10);

      // Analyze patterns and suggest improvements
      const recommendations: string[] = [];

      if (sessions && sessions.length > 0) {
        const avgScore = sessions.reduce((acc, s) => acc + (s.score || 0), 0) / sessions.length;
        
        if (avgScore < 60) {
          recommendations.push('Focus on fundamental concepts before advancing');
          recommendations.push('Consider reviewing prerequisite material');
        } else if (avgScore > 85) {
          recommendations.push('Ready for more challenging content');
          recommendations.push('Consider accelerated learning path');
        }

        const avgTime = sessions.reduce((acc, s) => acc + (s.time_spent || 0), 0) / sessions.length;
        if (avgTime > 600) { // More than 10 minutes per question
          recommendations.push('Break down complex problems into smaller steps');
        }
      }

      return recommendations;
    } catch (error) {
      console.error('Error getting adaptive recommendations:', error);
      return [];
    }
  }
};
