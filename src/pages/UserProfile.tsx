
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import SubscriptionPlans from "@/components/SubscriptionPlans";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileTabs from "@/components/profile/ProfileTabs";
import ProfileCard from "@/components/profile/ProfileCard";

// Define the profile data interface
interface ProfileData {
  name: string;
  email: string;
  birth_date: string;
  grade: string;
  school: string;
  address: string;
  avatar_url: string;
}

const UserProfile = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [profileExists, setProfileExists] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    name: "",
    email: "",
    birth_date: "",
    grade: "",
    school: "",
    address: "",
    avatar_url: ""
  });

  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      console.log('🔍 Fetching profile for user:', user.id);
      
      // Use a direct query to the profiles table
      const { data, error } = await supabase
        .from('profiles' as any) // Type assertion to bypass TypeScript errors
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found" error
        console.error('❌ Error fetching profile:', error);
        throw error;
      }

      if (data) {
        console.log('✅ Profile found:', data);
        setProfileExists(true);
        setProfileData({
          name: data.name || user.user_metadata?.name || "",
          email: data.email || user.email || "",
          birth_date: data.birth_date || "",
          grade: data.grade || "",
          school: data.school || "",
          address: data.address || "",
          avatar_url: data.avatar_url || ""
        });
      } else {
        console.log('ℹ️ No profile found, using user metadata');
        // Profile doesn't exist yet
        setProfileExists(false);
        setProfileData({
          name: user.user_metadata?.name || "",
          email: user.email || "",
          birth_date: "",
          grade: "",
          school: "",
          address: "",
          avatar_url: ""
        });
      }
    } catch (error) {
      console.error('❌ Error in fetchProfile:', error);
      // Fallback to user metadata if profile fetch fails
      setProfileExists(false);
      setProfileData({
        name: user.user_metadata?.name || "",
        email: user.email || "",
        birth_date: "",
        grade: "",
        school: "",
        address: "",
        avatar_url: ""
      });
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${user?.id}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      setProfileData(prev => ({ ...prev, avatar_url: data.publicUrl }));

      toast({
        title: "Profile picture uploaded!",
        description: "Your profile picture has been updated.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    
    try {
      console.log('💾 Updating profile for user:', user.id);
      
      if (profileExists) {
        // Update existing profile
        const { error } = await supabase
          .from('profiles' as any) // Type assertion to bypass TypeScript errors
          .update({
            name: profileData.name,
            email: profileData.email,
            birth_date: profileData.birth_date || null,
            grade: profileData.grade,
            school: profileData.school,
            address: profileData.address,
            avatar_url: profileData.avatar_url,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id);

        if (error) throw error;
        console.log('✅ Profile updated successfully');
      } else {
        // Insert new profile
        const { error } = await supabase
          .from('profiles' as any) // Type assertion to bypass TypeScript errors
          .insert({
            id: user.id,
            user_id: user.id,
            name: profileData.name,
            email: profileData.email,
            birth_date: profileData.birth_date || null,
            grade: profileData.grade,
            school: profileData.school,
            address: profileData.address,
            avatar_url: profileData.avatar_url
          });

        if (error) throw error;
        setProfileExists(true);
        console.log('✅ Profile created successfully');
      }

      toast({
        title: "Profile updated!",
        description: "Your information has been saved.",
      });
    } catch (error: any) {
      console.error("❌ Profile update error:", error);
      toast({
        title: "Error",
        description: "Could not update profile: " + error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    navigate('/auth');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <ProfileHeader onSignOut={signOut} />

      {/* Add padding-bottom to ensure AI tutor doesn't cover content */}
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
            onSubmit={handleProfileUpdate}
            onAvatarUpload={handleAvatarUpload}
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

export default UserProfile;
