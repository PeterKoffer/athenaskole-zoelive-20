
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import SubscriptionPlans from "@/components/SubscriptionPlans";
import ProfileHeader from "./ProfileHeader";
import ProfileTabs from "./ProfileTabs";
import ProfileCard from "./ProfileCard";
import { useSimpleProfile } from "./hooks/useSimpleProfile";
import { LearnerProfile } from "@/types/learnerProfile";
import { toast } from "@/hooks/use-toast";

const ProfileContainer = () => {
  const navigate = useNavigate();
  const { user, signOut, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [uploading, setUploading] = useState(false);
  
  const { profile, loading: profileLoading, error, updateProfile } = useSimpleProfile();

  console.log('ProfileContainer render:', { 
    user: user?.email, 
    authLoading, 
    profileLoading, 
    profile: profile?.name,
    error,
    hasProfile: !!profile
  });

  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // If auth is still loading, show loading state
  if (authLoading) {
    console.log('Auth loading...');
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading authentication...</p>
        </div>
      </div>
    );
  }

  // If user is not authenticated, redirect to auth
  if (!user) {
    console.log('No user, redirecting to auth');
    navigate('/auth');
    return null;
  }

  console.log('User authenticated:', user.email);

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      // For now, just show a message that avatar upload would be implemented
      toast({
        title: "Avatar Upload",
        description: "Avatar upload functionality would be implemented here.",
      });
      console.log('Avatar upload requested for file:', file.name);
    } catch (error) {
      console.error('Avatar upload error:', error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload avatar. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) {
      console.error('No profile data to submit');
      return;
    }

    console.log('Submitting profile update...');
    const success = await updateProfile(profile);
    if (success) {
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
    } else {
      toast({
        title: "Update Failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDataChange = (data: Partial<LearnerProfile>) => {
    console.log('Profile data change:', data);
    // This will be handled by the form components directly
  };

  if (error) {
    console.error('Profile error:', error);
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Error Loading Profile</h2>
          <p className="text-gray-400 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <ProfileHeader onSignOut={signOut} />

      <div className="max-w-4xl mx-auto p-6 pb-24">
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Profile</h1>
            <p className="text-gray-400">Manage your information and subscription</p>
          </div>
          <button
            onClick={() => navigate('/auth')}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Switch Role
          </button>
        </div>

        <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {activeTab === "profile" && (
          <div>
            {profileLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="ml-4">Loading profile...</p>
              </div>
            ) : profile ? (
              <ProfileCard
                profileData={profile}
                loading={false}
                uploading={uploading}
                onDataChange={handleDataChange}
                onSubmit={handleFormSubmit}
                onAvatarUpload={handleAvatarUpload}
              />
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-400 mb-4">No profile data found.</p>
                <div className="text-sm text-gray-500 mb-4">
                  User ID: {user.id}<br/>
                  Email: {user.email}
                </div>
                <button 
                  onClick={() => window.location.reload()} 
                  className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded"
                >
                  Retry Loading Profile
                </button>
              </div>
            )}
          </div>
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
