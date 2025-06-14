
export interface ProfileData {
  name: string;
  email: string;
  birth_date: string;
  grade: string;
  school: string;
  address: string;
  avatar_url: string;
  avatar_color?: string;
}

export interface UseProfileDataReturn {
  profileData: ProfileData;
  setProfileData: (data: ProfileData) => void;
  loading: boolean;
  uploading: boolean;
  handleAvatarUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleProfileUpdate: (e: React.FormEvent) => void;
}
