
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { SupabaseProfileService } from '@/services/learnerProfile/SupabaseProfileService';

const profileService = new SupabaseProfileService();

export const useProfileFetch = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      console.log('Fetching profile with SupabaseProfileService');
      const learnerProfile = await profileService.getProfile(user.id);
      
      if (learnerProfile) {
        // Transform LearnerProfile to the format expected by the UI
        const uiProfile = {
          user_id: learnerProfile.userId,
          name: learnerProfile.preferences?.preferredSubjects?.join(', ') || '',
          email: '', // This might be available from auth.user if needed
          // Map other fields as needed
        };
        setProfile(uiProfile);
      } else {
        setProfile(null);
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  return {
    profile,
    profileData: profile,
    setProfileData: setProfile,
    profileExists: !!profile,
    setProfileExists: () => {},
    loading,
    error,
    refetch: fetchProfile
  };
};
