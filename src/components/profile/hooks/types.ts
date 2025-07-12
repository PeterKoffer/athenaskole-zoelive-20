
import { LearnerProfile } from '@/types/learnerProfile';

export interface UseProfileDataReturn {
  profileData: LearnerProfile | null;
  setProfileData: (data: Partial<LearnerProfile>) => void;
  loading: boolean;
  uploading: boolean;
  handleAvatarUpload: (file: File) => Promise<void>;
  handleProfileUpdate: (data: Partial<LearnerProfile>) => Promise<void>;
}
