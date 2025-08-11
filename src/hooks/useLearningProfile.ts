import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { SupabaseProfileService } from '@/services/learnerProfile/SupabaseProfileService';

const profileService = new SupabaseProfileService();

interface UserProfile {
  userId: string;
  knowledgeLevel: string;
  preferredSubjects: string[];
}

interface Preferences {
  learningStyle: string;
  difficulty: string;
}

export const useLearningProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [preferences, setPreferences] = useState<Preferences | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;

      setLoading(true);
      setError(null);
      try {
        const learnerProfile = await profileService.getProfile(user.id);
        if (learnerProfile) {
          setProfile({
            userId: learnerProfile.userId,
            knowledgeLevel: 'beginner',
            preferredSubjects: learnerProfile.preferences?.preferredSubjects || []
          });
          setPreferences({
            learningStyle: learnerProfile.preferences?.learningStyle || 'visual',
            difficulty: 'medium'
          });
        } else {
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

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return false;
    try {
      const currentProfile = await profileService.getProfile(user.id);
      if (currentProfile) {
        const updatedProfile = { ...currentProfile, ...updates } as any;
        await profileService.updateProfile(updatedProfile);
        setProfile(prev => (prev ? { ...prev, ...updates } as UserProfile : prev));
      }
      return true;
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile');
      return false;
    }
  };

  const updatePreferences = async (updates: Partial<Preferences>) => {
    if (!user) return false;
    try {
      await profileService.updatePreferences(user.id, updates);
      setPreferences(prev => (prev ? { ...prev, ...updates } as Preferences : prev));
      return true;
    } catch (err) {
      console.error('Error updating preferences:', err);
      setError('Failed to update preferences');
      return false;
    }
  };

  const getRecommendedDifficulty = (_subject: string, _skillArea: string) => {
    return 3;
  };

  const getPersonalizedSettings = (_subject: string, _skillArea: string) => {
    return { preferredStyle: 'visual', pacing: 'medium', hints: true };
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
