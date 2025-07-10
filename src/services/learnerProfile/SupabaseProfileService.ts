
// Real Supabase implementation for learner profile service

import { supabase } from '@/integrations/supabase/client';
import type { LearnerProfile, KnowledgeComponentMastery, LearnerPreferences, KCMasteryUpdateData } from '@/types/learnerProfile';

export class SupabaseProfileService {
  static async createLearnerProfile(userId: string, preferences: LearnerPreferences): Promise<boolean> {
    try {
      console.log('🆕 Creating learner profile for user:', userId);
      
      const { error } = await supabase
        .from('profiles')
        .update({
          overall_mastery: 0.0,
          preferences: preferences as any,
          recent_performance: [] as any
        })
        .eq('user_id', userId);

      if (error) {
        console.error('❌ Error creating learner profile:', error);
        return false;
      }

      console.log('✅ Learner profile created successfully');
      return true;
    } catch (error) {
      console.error('❌ Exception creating learner profile:', error);
      return false;
    }
  }

  static async updateLearnerProfile(userId: string, updates: Partial<LearnerProfile>): Promise<boolean> {
    try {
      console.log('📝 Updating learner profile for user:', userId);
      
      const profileUpdates: any = {};
      
      if (updates.preferences) profileUpdates.preferences = updates.preferences;
      if (updates.overallMastery !== undefined) profileUpdates.overall_mastery = updates.overallMastery;
      if (updates.recentPerformance) profileUpdates.recent_performance = updates.recentPerformance;

      const { error } = await supabase
        .from('profiles')
        .update(profileUpdates)
        .eq('user_id', userId);

      if (error) {
        console.error('❌ Error updating learner profile:', error);
        return false;
      }

      console.log('✅ Learner profile updated successfully');
      return true;
    } catch (error) {
      console.error('❌ Exception updating learner profile:', error);
      return false;
    }
  }

  static async getLearnerProfile(userId: string): Promise<LearnerProfile | null> {
    try {
      console.log('👤 Getting learner profile for user:', userId);
      
      // Get profile data
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (profileError) {
        console.error('❌ Error fetching profile:', profileError);
        return null;
      }

      // Get KC mastery data
      const { data: kcData, error: kcError } = await supabase
        .from('knowledge_component_mastery')
        .select('*')
        .eq('user_id', userId);

      if (kcError) {
        console.error('❌ Error fetching KC mastery:', kcError);
        return null;
      }

      // Transform data to LearnerProfile format
      const learnerProfile: LearnerProfile = {
        userId: profileData.user_id,
        user_id: profileData.user_id,
        overall_mastery: profileData.overall_mastery || 0.0,
        overallMastery: profileData.overall_mastery || 0.0,
        kc_masteries: kcData?.map(kc => ({
          kc_id: kc.kc_id,
          mastery_level: kc.mastery_level,
          confidence: kc.mastery_level, // Use mastery_level as confidence for now
          last_updated: kc.updated_at
        })) || [],
        kcMasteryMap: this.buildKcMasteryMap(kcData || []),
        preferences: (profileData.preferences as unknown as LearnerPreferences) || {
          preferredSubjects: [],
          learningStyle: 'visual',
          difficultyPreference: 3,
          sessionLength: 30
        },
        created_at: profileData.created_at,
        updated_at: profileData.updated_at,
        createdAt: new Date(profileData.created_at).getTime(),
        lastUpdatedTimestamp: new Date(profileData.updated_at).getTime(),
        recentPerformance: (profileData.recent_performance as any[]) || [],
        aggregateMetrics: {
          overallMastery: profileData.overall_mastery || 0.0,
          completedKCs: kcData?.filter(kc => kc.mastery_level >= 0.8).length || 0,
          totalKCsAttempted: kcData?.length || 0
        }
      };

      console.log('✅ Learner profile retrieved successfully');
      return learnerProfile;
    } catch (error) {
      console.error('❌ Exception getting learner profile:', error);
      return null;
    }
  }

  static async getKnowledgeComponentMastery(userId: string): Promise<KnowledgeComponentMastery[]> {
    try {
      console.log('📊 Getting KC mastery for user:', userId);
      
      const { data, error } = await supabase
        .from('knowledge_component_mastery')
        .select('*')
        .eq('user_id', userId);

      if (error) {
        console.error('❌ Error fetching KC mastery:', error);
        return [];
      }

      return data?.map(kc => ({
        kcId: kc.kc_id,
        masteryLevel: kc.mastery_level,
        practiceCount: kc.attempts,
        lastAssessed: kc.last_attempt_timestamp || kc.updated_at,
        totalAttempts: kc.attempts,
        successfulAttempts: kc.correct_attempts,
        currentStreak: 0, // Would need additional logic to calculate
        interactionHistory: (kc.history as any[]) || []
      })) || [];
    } catch (error) {
      console.error('❌ Exception getting KC mastery:', error);
      return [];
    }
  }

  static async updateKnowledgeComponentMastery(
    userId: string,
    kcId: string,
    masteryData: KCMasteryUpdateData
  ): Promise<boolean> {
    try {
      console.log('📈 Updating KC mastery for user:', userId, 'KC:', kcId);
      
      // Get existing mastery record
      const { data: existing, error: fetchError } = await supabase
        .from('knowledge_component_mastery')
        .select('*')
        .eq('user_id', userId)
        .eq('kc_id', kcId)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('❌ Error fetching existing KC mastery:', fetchError);
        return false;
      }

      const isCorrect = masteryData.success;
      const newAttempts = (existing?.attempts || 0) + (masteryData.attemptsInInteraction || 1);
      const newCorrectAttempts = (existing?.correct_attempts || 0) + (isCorrect ? 1 : 0);
      
      // Calculate new mastery level using simple learning curve
      const currentMastery = existing?.mastery_level || 0.5;
      const masteryChange = isCorrect ? 0.1 * (1.0 - currentMastery) : -0.05 * currentMastery;
      const newMasteryLevel = Math.max(0.0, Math.min(1.0, currentMastery + masteryChange));

      // Update history
      const history = (existing?.history as any[]) || [];
      const newHistoryEntry = {
        timestamp: masteryData.timestamp,
        success: isCorrect,
        timeTakenSeconds: masteryData.timeTakenMs ? Math.round(masteryData.timeTakenMs / 1000) : 0,
        hintsUsed: masteryData.hintsUsed || 0,
        attempts: masteryData.attemptsInInteraction || 1,
        firstAttemptSuccess: isCorrect && (masteryData.attemptsInInteraction || 1) === 1
      };
      
      // Keep only last 20 interactions
      const updatedHistory = [...history, newHistoryEntry].slice(-20);

      const updateData = {
        mastery_level: newMasteryLevel,
        attempts: newAttempts,
        correct_attempts: newCorrectAttempts,
        last_attempt_timestamp: masteryData.timestamp,
        history: updatedHistory
      };

      let result;
      if (existing) {
        // Update existing record
        result = await supabase
          .from('knowledge_component_mastery')
          .update(updateData)
          .eq('user_id', userId)
          .eq('kc_id', kcId);
      } else {
        // Insert new record
        result = await supabase
          .from('knowledge_component_mastery')
          .insert({
            user_id: userId,
            kc_id: kcId,
            ...updateData
          });
      }

      if (result.error) {
        console.error('❌ Error updating KC mastery:', result.error);
        return false;
      }

      console.log('✅ KC mastery updated successfully');
      return true;
    } catch (error) {
      console.error('❌ Exception updating KC mastery:', error);
      return false;
    }
  }

  static async recordLearningInteraction(
    userId: string,
    interactionData: any
  ): Promise<boolean> {
    try {
      console.log('📝 Recording learning interaction for user:', userId);
      
      // Update recent performance if provided
      if (interactionData.performance !== undefined) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('recent_performance')
          .eq('user_id', userId)
          .single();

        const recentPerformance = (profile?.recent_performance as any[]) || [];
        const updatedPerformance = [...recentPerformance, interactionData.performance].slice(-10); // Keep last 10

        await supabase
          .from('profiles')
          .update({ recent_performance: updatedPerformance })
          .eq('user_id', userId);
      }

      console.log('✅ Learning interaction recorded successfully');
      return true;
    } catch (error) {
      console.error('❌ Exception recording learning interaction:', error);
      return false;
    }
  }

  private static buildKcMasteryMap(kcData: any[]): Record<string, KnowledgeComponentMastery> {
    const map: Record<string, KnowledgeComponentMastery> = {};
    
    kcData.forEach(kc => {
      map[kc.kc_id] = {
        kcId: kc.kc_id,
        masteryLevel: kc.mastery_level,
        practiceCount: kc.attempts,
        lastAssessed: kc.last_attempt_timestamp || kc.updated_at,
        totalAttempts: kc.attempts,
        successfulAttempts: kc.correct_attempts,
        currentStreak: 0, // Would need additional logic to calculate
        interactionHistory: (kc.history as any[]) || []
      };
    });

    return map;
  }
}

export default SupabaseProfileService;
