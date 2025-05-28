import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import SubscriptionPlans from "@/components/SubscriptionPlans";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileTabs from "@/components/profile/ProfileTabs";
import ProfileCard from "@/components/profile/ProfileCard";

const UserProfile = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [profileData, setProfileData] = useState({
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

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (data) {
      setProfileData({
        name: data.name || user.user_metadata?.name || "",
        email: data.email || user.email || "",
        birth_date: data.birth_date || "",
        grade: data.grade || "",
        school: data.school || "",
        address: data.address || "",
        avatar_url: data.avatar_url || ""
      });
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('Du skal vælge et billede at uploade.');
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
        title: "Profilbillede uploadet!",
        description: "Dit profilbillede er blevet opdateret.",
      });
    } catch (error: any) {
      toast({
        title: "Fejl",
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
    
    const { error } = await supabase
      .from('profiles')
      .upsert({
        user_id: user.id,
        ...profileData,
        updated_at: new Date().toISOString()
      });

    if (error) {
      toast({
        title: "Fejl",
        description: "Kunne ikke opdatere profil: " + error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Profil opdateret!",
        description: "Dine oplysninger er blevet gemt.",
      });
    }

    setLoading(false);
  };

  if (!user) {
    navigate('/auth');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <ProfileHeader onSignOut={signOut} />

      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Min Profil</h1>
          <p className="text-gray-400">Administrer dine oplysninger og abonnement</p>
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
