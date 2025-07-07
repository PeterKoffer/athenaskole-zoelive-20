
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import SubscriptionPlans from "@/components/SubscriptionPlans";
import ProfileHeader from "./ProfileHeader";
import ProfileTabs from "./ProfileTabs";
import ProfileCard from "./ProfileCard";
import { useProfileData } from "./hooks/useProfileData";

const ProfileContainer = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  
  const {
    profileData,
    setProfileData,
    loading,
    uploading,
    handleAvatarUpload,
    handleProfileUpdate
  } = useProfileData();

  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleAvatarUploadWrapper = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleAvatarUpload(file);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleProfileUpdate(profileData);
  };

  if (!user) {
    navigate('/auth');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <ProfileHeader onSignOut={signOut} />

      <div className="max-w-4xl mx-auto p-6 pb-24">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Profile</h1>
          <p className="text-gray-400">Manage your information and subscription</p>
        </div>

        <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {activeTab === "profile" && (
          <ProfileCard
            profileData={profileData}
            loading={loading}
            uploading={uploading}
            onDataChange={setProfileData}
            onSubmit={handleFormSubmit}
            onAvatarUpload={handleAvatarUploadWrapper}
          />
        )}

        {activeTab === "subscription" && (
          <div>
            <SubscriptionPlans />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileContainer;
