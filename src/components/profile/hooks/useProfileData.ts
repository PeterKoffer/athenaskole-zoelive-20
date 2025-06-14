
import { useProfileFetch } from "./useProfileFetch";
import { useAvatarUpload } from "./useAvatarUpload";
import { useProfileUpdate } from "./useProfileUpdate";
import { UseProfileDataReturn } from "./types";

export const useProfileData = (): UseProfileDataReturn => {
  const {
    profileData,
    setProfileData,
    profileExists,
    setProfileExists
  } = useProfileFetch();

  const { uploading, handleAvatarUpload } = useAvatarUpload(
    profileData,
    setProfileData
  );

  const { loading, handleProfileUpdate } = useProfileUpdate(
    profileData,
    profileExists,
    setProfileExists
  );

  return {
    profileData,
    setProfileData,
    loading,
    uploading,
    handleAvatarUpload,
    handleProfileUpdate
  };
};
