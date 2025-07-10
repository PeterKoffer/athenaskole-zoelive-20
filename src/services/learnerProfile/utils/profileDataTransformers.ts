// Data transformation utilities for profile data
import type { LearnerProfile, LearnerPreferences } from '@/types/learnerProfile';
import { SupabaseKCMasteryRepository } from '../repositories/SupabaseKCMasteryRepository';

export class ProfileDataTransformers {
  static transformToLearnerProfile(profileData: any, kcData: any[]): LearnerProfile {
    return {
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
      kcMasteryMap: SupabaseKCMasteryRepository.buildKcMasteryMap(kcData || []),
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
  }
}