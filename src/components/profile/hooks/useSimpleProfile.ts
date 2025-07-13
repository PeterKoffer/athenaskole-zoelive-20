
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { LearnerProfile, LearnerPreferences } from '@/types/learnerProfile';

export const useSimpleProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<LearnerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        console.log('Fetching profile for user:', user.id);
        
        // Fetch from profiles table directly
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (profileError && profileError.code !== 'PGRST116') {
          throw profileError;
        }

        if (!profileData) {
          // Create initial profile if none exists
          console.log('Creating initial profile for user:', user.id);
          const defaultPreferences: LearnerPreferences = {
            preferredSubjects: [],
            learningStyle: 'visual',
            difficultyPreference: 3,
            sessionLength: 30
          };

          const newProfile = {
            user_id: user.id,
            name: user.user_metadata?.name || '',
            email: user.email || '',
            preferences: defaultPreferences
          };

          const { data: createdProfile, error: createError } = await supabase
            .from('profiles')
            .insert(newProfile)
            .select()
            .single();

          if (createError) {
            throw createError;
          }

          const learnerProfile: LearnerProfile = {
            userId: createdProfile.user_id,
            name: createdProfile.name || '',
            email: createdProfile.email || '',
            avatarUrl: createdProfile.avatar_url || '',
            avatarColor: '#6366f1',
            birth_date: createdProfile.birth_date || '',
            address: createdProfile.address || '',
            grade: createdProfile.grade || '',
            school: createdProfile.school || '',
            overall_mastery: createdProfile.overall_mastery || 0,
            kc_masteries: [],
            kcMasteryMap: {},
            preferences: (createdProfile.preferences as LearnerPreferences) || defaultPreferences,
            created_at: createdProfile.created_at,
            updated_at: createdProfile.updated_at,
            recentPerformance: Array.isArray(createdProfile.recent_performance) 
              ? createdProfile.recent_performance 
              : [],
            overallMastery: createdProfile.overall_mastery || 0,
            lastUpdatedTimestamp: Date.now(),
            createdAt: Date.now(),
            aggregateMetrics: {
              overallMastery: 0,
              completedKCs: 0,
              totalKCsAttempted: 0
            }
          };

          setProfile(learnerProfile);
        } else {
          const defaultPreferences: LearnerPreferences = {
            preferredSubjects: [],
            learningStyle: 'visual',
            difficultyPreference: 3,
            sessionLength: 30
          };

          const learnerProfile: LearnerProfile = {
            userId: profileData.user_id,
            name: profileData.name || '',
            email: profileData.email || user.email || '',
            avatarUrl: profileData.avatar_url || '',
            avatarColor: '#6366f1',
            birth_date: profileData.birth_date || '',
            address: profileData.address || '',
            grade: profileData.grade || '',
            school: profileData.school || '',
            overall_mastery: profileData.overall_mastery || 0,
            kc_masteries: [],
            kcMasteryMap: {},
            preferences: (profileData.preferences as LearnerPreferences) || defaultPreferences,
            created_at: profileData.created_at,
            updated_at: profileData.updated_at,
            recentPerformance: Array.isArray(profileData.recent_performance) 
              ? profileData.recent_performance 
              : [],
            overallMastery: profileData.overall_mastery || 0,
            lastUpdatedTimestamp: Date.now(),
            createdAt: Date.now(),
            aggregateMetrics: {
              overallMastery: profileData.overall_mastery || 0,
              completedKCs: 0,
              totalKCsAttempted: 0
            }
          };

          setProfile(learnerProfile);
        }

        console.log('Profile loaded successfully');
      } catch (err) {
        console.error('Error loading profile:', err);
        setError(err instanceof Error ? err.message : 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const updateProfile = async (updates: Partial<LearnerProfile>) => {
    if (!user || !profile) return false;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: updates.name,
          avatar_url: updates.avatarUrl,
          birth_date: updates.birth_date,
          address: updates.address,
          grade: updates.grade,
          school: updates.school,
          preferences: updates.preferences as any,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (error) {
        throw error;
      }

      setProfile({ ...profile, ...updates });
      return true;
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err instanceof Error ? err.message : 'Failed to update profile');
      return false;
    }
  };

  return { profile, loading, error, updateProfile };
};
