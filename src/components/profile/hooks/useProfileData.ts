
import { useProfileFetch } from "./useProfileFetch";
import { useAvatarUpload } from "./useAvatarUpload";
import { useProfileUpdate } from "./useProfileUpdate";
import { UseProfileDataReturn } from "./types";

export const useProfileData = (): UseProfileDataReturn => {
  const {
    profile,
    profileData,
    setProfileData,
    profileExists,
    setProfileExists,
    loading: fetchLoading,
    error: fetchError
  } = useProfileFetch();

  const { uploading, handleAvatarUpload } = useAvatarUpload(
    profileData,
    setProfileData
  );

  const { loading: updateLoading, handleProfileUpdate } = useProfileUpdate(
    profileData,
    profileExists,
    setProfileExists
  );

  return {
    profileData,
    setProfileData,
    loading: fetchLoading || updateLoading,
    uploading,
    handleAvatarUpload,
    handleProfileUpdate
  };
};
