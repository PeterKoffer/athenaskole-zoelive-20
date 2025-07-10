
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { SupabaseProfileService } from '@/services/learnerProfile/SupabaseProfileService';

const profileService = new SupabaseProfileService();

export const useLearningProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [preferences, setPreferences] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;

      setLoading(true);
      setError(null);
      
      try {
        console.log('📊 LearningProfile: Loading profile from Supabase');
        const learnerProfile = await profileService.getProfile(user.id);
        
        if (learnerProfile) {
          setProfile({
            userId: learnerProfile.userId,
            knowledgeLevel: 'beginner', // TODO: derive from mastery data
            preferredSubjects: learnerProfile.preferences?.preferredSubjects || []
          });
          setPreferences({
            learningStyle: learnerProfile.preferences?.learningStyle || 'visual',
            difficulty: 'medium' // TODO: derive from preferences
          });
        } else {
          // Create initial profile if none exists
          const newProfile = await profileService.createInitialProfile(user.id);
          setProfile({
            userId: newProfile.userId,
            knowledgeLevel: 'beginner',
            preferredSubjects: newProfile.preferences?.preferredSubjects || []
          });
          setPreferences({
            learningStyle: newProfile.preferences?.learningStyle || 'visual',
            difficulty: 'medium'
          });
        }
      } catch (err) {
        console.error('Error loading profile:', err);
        setError('Failed to load learning profile');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user]);

  const updateProfile = async (updates: any) => {
    if (!user) return false;
    
    try {
      console.log('📊 LearningProfile: updateProfile called');
      const currentProfile = await profileService.getProfile(user.id);
      if (currentProfile) {
        const updatedProfile = { ...currentProfile, ...updates };
        await profileService.updateProfile(updatedProfile);
        setProfile(prev => ({ ...prev, ...updates }));
      }
      return true;
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile');
      return false;
    }
  };

  const updatePreferences = async (updates: any) => {
    if (!user) return false;
    
    try {
      console.log('📊 LearningProfile: updatePreferences called');
      await profileService.updatePreferences(user.id, updates);
      setPreferences(prev => ({ ...prev, ...updates }));
      return true;
    } catch (error) {
      console.error('Error updating preferences:', error);
      setError('Failed to update preferences');
      return false;
    }
  };

  const getRecommendedDifficulty = (subject: string, skillArea: string) => {
    console.log('📊 LearningProfile: getRecommendedDifficulty called (stub implementation)');
    return 3; // Default difficulty
  };

  const getPersonalizedSettings = (subject: string, skillArea: string) => {
    console.log('📊 LearningProfile: getPersonalizedSettings called (stub implementation)');
    return {
      preferredStyle: 'visual',
      pacing: 'medium',
      hints: true
    };
  };

  return {
    profile,
    preferences,
    loading,
    error,
    updateProfile,
    updatePreferences,
    getRecommendedDifficulty,
    getPersonalizedSettings
  };
};
