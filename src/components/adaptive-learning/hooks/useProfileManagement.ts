
import { useCallback } from 'react';
import learnerProfileService from '@/services/learnerProfileService';
import type { LearnerProfile } from '@/types/learnerProfile';

export const useProfileManagement = () => {
  const loadLearnerProfile = useCallback(async (
    onSuccess: (profile: LearnerProfile) => void,
    onError: (error: string) => void
  ) => {
    try {
      console.log('🚀 Loading learner profile...');
      const testUserId = '12345678-1234-5678-9012-123456789012';
      const profile = await learnerProfileService.getProfile(testUserId);
      
      if (profile) {
        console.log('✅ Profile loaded successfully:', profile.userId);
        onSuccess(profile);
      } else {
        throw new Error('Failed to load profile');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error loading profile';
      console.error('❌ Profile loading failed:', errorMessage);
      onError(errorMessage);
    }
  }, []);

  return { loadLearnerProfile };
};
