
import { useProfileFetch } from "./useProfileFetch";
import { useAvatarUpload } from "./useAvatarUpload";
import { useProfileUpdate } from "./useProfileUpdate";
import { UseProfileDataReturn } from "./types";
import { LearnerProfile } from "@/types/learnerProfile";

export const useProfileData = (): UseProfileDataReturn => {
  const {
    profileData,
    setProfileData: setProfileDataState,
    loading: fetchLoading,
    error: fetchError,
    refetch,
  } = useProfileFetch();

  const { uploading, handleAvatarUpload } = useAvatarUpload(
    profileData,
    setProfileDataState
  );

  const { loading: updateLoading, handleProfileUpdate: updateProfile } = useProfileUpdate();

  // Create a wrapper function that handles partial updates
  const setProfileData = (data: Partial<LearnerProfile>) => {
    if (profileData) {
      setProfileDataState({ ...profileData, ...data });
    }
  };

  const handleProfileUpdate = async (data: Partial<LearnerProfile>) => {
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
