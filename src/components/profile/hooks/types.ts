
export interface UseProfileDataReturn {
  profileData: any;
  setProfileData: (data: any) => void;
  loading: boolean;
  uploading: boolean;
  handleAvatarUpload: (file: File) => Promise<void>;
  handleProfileUpdate: (data: any) => Promise<void>;
}
