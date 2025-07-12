
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { SupabaseProfileService } from '@/services/learnerProfile/SupabaseProfileService';
import { LearnerProfile } from '@/types/learnerProfile';

const profileService = new SupabaseProfileService();

export const useProfileFetch = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<LearnerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profileExists, setProfileExists] = useState(false);

  const fetchProfile = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const learnerProfile = await profileService.getProfile(user.id);
      if (learnerProfile) {
        setProfile(learnerProfile);
        setProfileExists(true);
      } else {
        // If no profile exists, create one
        const newProfile = await profileService.createInitialProfile(user.id);
        setProfile(newProfile);
        setProfileExists(true);
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch profile');
      setProfile(null);
      setProfileExists(false);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return {
    profile,
    profileData: profile,
    setProfileData: setProfile,
    profileExists,
    setProfileExists,
    loading,
    error,
    refetch: fetchProfile
  };
};
