// Repository for Knowledge Component mastery operations
import { supabase } from '@/integrations/supabase/client';
import type { KnowledgeComponentMastery, KCMasteryUpdateData } from '@/types/learnerProfile';

export class SupabaseKCMasteryRepository {
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

  static async getKCMasteryData(userId: string) {
    console.log('📊 Getting KC mastery data for user:', userId);
    
    const { data: kcData, error: kcError } = await supabase
      .from('knowledge_component_mastery')
      .select('*')
      .eq('user_id', userId);

    if (kcError) {
      console.error('❌ Error fetching KC mastery:', kcError);
      return null;
    }

    return kcData;
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

  static buildKcMasteryMap(kcData: any[]): Record<string, KnowledgeComponentMastery> {
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
