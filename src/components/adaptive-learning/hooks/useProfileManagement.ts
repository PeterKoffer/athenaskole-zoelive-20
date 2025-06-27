
import { useCallback } from 'react';
import learnerProfileService from '@/services/learnerProfile/LearnerProfileService';
import { MOCK_USER_ID } from '@/services/learnerProfile/MockProfileService';
import { LearnerProfile } from '@/types/learnerProfile';

export const useProfileManagement = () => {
  const loadLearnerProfile = useCallback(async (
    onSuccess: (profile: LearnerProfile) => void,
    onError: (error: string) => void
  ) => {
    try {
      console.log('👤 Loading learner profile for user:', MOCK_USER_ID);
      const profile = await learnerProfileService.getProfile(MOCK_USER_ID);
      
      if (!profile) {
        throw new Error('No profile returned from service');
      }

      console.log('✅ Profile loaded successfully:', {
        userId: profile.userId,
        kcCount: Object.keys(profile.kcMasteryMap || {}).length
      });

      onSuccess(profile);
    } catch (error) {
      const errorMsg = `Failed to load learner profile: ${error instanceof Error ? error.message : 'Unknown error'}`;
      console.error('❌ Profile loading failed:', error);
      onError(errorMsg);
    }
  }, []);

  return { loadLearnerProfile };
};
