
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { 
  userLearningProfileService, 
  UserLearningProfile, 
  UserPreferences 
} from '@/services/userLearningProfileService';
import type { Database } from '@/integrations/supabase/types';

type UserLearningProfileInsert = Database['public']['Tables']['user_learning_profiles']['Insert'];
type UserPreferencesInsert = Database['public']['Tables']['user_preferences']['Insert'];

export const useLearningProfile = (subject: string, skillArea: string = 'general') => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserLearningProfile | null>(null);
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      console.log('📊 Loading learning profile for:', { subject, skillArea, userId: user.id });
      
      const [profileData, preferencesData] = await Promise.all([
        userLearningProfileService.getLearningProfile(user.id, subject, skillArea),
        userLearningProfileService.getUserPreferences(user.id)
      ]);

      setProfile(profileData);
      setPreferences(preferencesData);
      
      console.log('✅ Learning profile loaded:', { 
        hasProfile: !!profileData, 
        hasPreferences: !!preferencesData 
      });
    } catch (error) {
      console.error('❌ Error loading learning profile:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, [user?.id, subject, skillArea]);

  const updateProfile = async (updates: Partial<UserLearningProfileInsert>) => {
    if (!user?.id) return false;

    const updatedProfile: UserLearningProfileInsert = {
      ...updates,
      user_id: user.id,
      subject,
      skill_area: skillArea,
      updated_at: new Date().toISOString()
    };

    const success = await userLearningProfileService.createOrUpdateProfile(updatedProfile);
    
    if (success) {
      await loadProfile(); // Reload the profile
    }
    
    return success;
  };

  const updatePreferences = async (updates: Partial<UserPreferencesInsert>) => {
    if (!user?.id) return false;

    const updatedPreferences: UserPreferencesInsert = {
      ...updates,
      user_id: user.id,
      updated_at: new Date().toISOString()
    };

    const success = await userLearningProfileService.updateUserPreferences(updatedPreferences);
    
    if (success) {
      setPreferences(prev => prev ? { ...prev, ...updatedPreferences } : null);
    }
    
    return success;
  };

  const getRecommendedDifficulty = (): number => {
    if (!profile) return 1;
    
    // Base difficulty on current level and recent performance
    let recommendedLevel = profile.current_difficulty_level || 1;
    
    // Adjust based on accuracy
    const accuracy = Number(profile.overall_accuracy) || 0;
    if (accuracy > 85) {
      recommendedLevel = Math.min(10, recommendedLevel + 1);
    } else if (accuracy < 60) {
      recommendedLevel = Math.max(1, recommendedLevel - 1);
    }
    
    // Consider consistency
    const consistency = Number(profile.consistency_score) || 0;
    if (consistency < 50) {
      recommendedLevel = Math.max(1, recommendedLevel - 1);
    }
    
    return recommendedLevel;
  };

  const getPersonalizedSettings = () => {
    return {
      speechEnabled: preferences?.speech_enabled ?? true,
      speechRate: Number(preferences?.speech_rate) ?? 0.8,
      speechPitch: Number(preferences?.speech_pitch) ?? 1.2,
      preferredVoice: preferences?.preferred_voice ?? 'female',
      autoReadQuestions: preferences?.auto_read_questions ?? true,
      autoReadExplanations: preferences?.auto_read_explanations ?? true,
      attentionSpan: profile?.attention_span_minutes ?? 20,
      preferredPace: profile?.preferred_pace ?? 'medium',
      learningStyle: profile?.learning_style ?? 'mixed'
    };
  };

  return {
    profile,
    preferences,
    loading,
    updateProfile,
    updatePreferences,
    getRecommendedDifficulty,
    getPersonalizedSettings,
    reload: loadProfile
  };
};
