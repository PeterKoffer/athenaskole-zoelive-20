
import { useState } from 'react';
import { SupabaseProfileService } from '@/services/learnerProfile/SupabaseProfileService';
import { useAuth } from '@/hooks/useAuth';
import { LearnerProfile } from '@/types/learnerProfile';
import { toast } from '@/hooks/use-toast';

const profileService = new SupabaseProfileService();

export const useProfileUpdate = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleProfileUpdate = async (data: Partial<LearnerProfile>) => {
    if (!user) return;
    
    setLoading(true);
    try {
      const currentProfile = await profileService.getProfile(user.id);
      if (currentProfile) {
        const updatedProfile = { ...currentProfile, ...data };
        await profileService.updateProfile(updatedProfile);
        toast({
          title: "Profile Updated",
          description: "Your profile has been successfully updated.",
        });
      } else {
        toast({
          title: "Profile Not Found",
          description: "Could not find a profile to update.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Profile update error:', error);
      toast({
        title: "Update Failed",
        description: "There was an error updating your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    handleProfileUpdate
  };
};
