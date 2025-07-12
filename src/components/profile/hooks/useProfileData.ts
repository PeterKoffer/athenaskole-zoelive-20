
import { useProfileFetch } from "./useProfileFetch";
import { useAvatarUpload } from "./useAvatarUpload";
import { useProfileUpdate } from "./useProfileUpdate";
import { UseProfileDataReturn } from "./types";

export const useProfileData = (): UseProfileDataReturn => {
  const {
    profileData,
    setProfileData,
    loading: fetchLoading,
    error: fetchError,
    refetch,
  } = useProfileFetch();

  const { uploading, handleAvatarUpload } = useAvatarUpload(
    profileData,
    setProfileData
  );

  const { loading: updateLoading, handleProfileUpdate: updateProfile } = useProfileUpdate();

  const handleProfileUpdate = async (data: any) => {
    await updateProfile(data);
    refetch();
  };

  return {
    profileData,
    setProfileData,
    loading: fetchLoading || updateLoading,
    uploading,
    handleAvatarUpload,
    handleProfileUpdate
  };
};
