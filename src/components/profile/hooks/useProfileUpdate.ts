
import { useState } from 'react';
import { SupabaseProfileService } from '@/services/learnerProfile/SupabaseProfileService';
import { useAuth } from '@/hooks/useAuth';

const profileService = new SupabaseProfileService();

export const useProfileUpdate = (
  profileData: any,
  profileExists: boolean,
  setProfileExists: (exists: boolean) => void
) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleProfileUpdate = async (data: any) => {
    if (!user) return;
    
    setLoading(true);
    try {
      console.log('Profile update with Supabase service');
      
      if (profileExists) {
        // Update existing profile
        const currentProfile = await profileService.getProfile(user.id);
        if (currentProfile) {
          const updatedProfile = { ...currentProfile, ...data };
          await profileService.updateProfile(updatedProfile);
        }
      } else {
        // Create new profile
        await profileService.createInitialProfile(user.id);
        setProfileExists(true);
      }
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    handleProfileUpdate
  };
};
