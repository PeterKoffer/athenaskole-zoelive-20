
export interface ProfileData {
  name: string;
  email: string;
  birth_date: string;
  address: string;
  grade: string;
  school: string;
  avatar_url?: string;
  avatar_color?: string;
}

export interface UseProfileDataReturn {
  profileData: ProfileData;
  setProfileData: (data: ProfileData) => void;
  loading: boolean;
  uploading: boolean;
  handleAvatarUpload: (file: File) => Promise<void>;
  handleProfileUpdate: (data: ProfileData) => Promise<void>;
}
