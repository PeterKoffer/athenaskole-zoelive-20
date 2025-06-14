
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ProfileData {
  name: string;
  email: string;
  birth_date: string;
  grade: string;
  school: string;
  address: string;
  avatar_url: string;
  avatar_color?: string;
}

export const useProfileData = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [profileExists, setProfileExists] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    name: "",
    email: "",
    birth_date: "",
    grade: "",
    school: "",
    address: "",
    avatar_url: "",
    avatar_color: "from-purple-400 to-cyan-400"
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      console.log('🔍 Fetching profile for user:', user.id);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
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
          avatar_url: data.avatar_url || "",
          avatar_color: data.avatar_color || "from-purple-400 to-cyan-400"
        });
      } else {
        console.log('ℹ️ No profile found, using user metadata');
        setProfileExists(false);
        setProfileData({
          name: user.user_metadata?.name || "",
          email: user.email || "",
          birth_date: "",
          grade: "",
          school: "",
          address: "",
          avatar_url: "",
          avatar_color: "from-purple-400 to-cyan-400"
        });
      }
    } catch (error) {
      console.error('❌ Error in fetchProfile:', error);
      setProfileExists(false);
      setProfileData({
        name: user.user_metadata?.name || "",
        email: user.email || "",
        birth_date: "",
        grade: "",
        school: "",
        address: "",
        avatar_url: "",
        avatar_color: "from-purple-400 to-cyan-400"
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
        const { error } = await supabase
          .from('profiles')
          .update({
            name: profileData.name,
            email: profileData.email,
            birth_date: profileData.birth_date || null,
            grade: profileData.grade,
            school: profileData.school,
            address: profileData.address,
            avatar_url: profileData.avatar_url,
            avatar_color: profileData.avatar_color,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id);

        if (error) throw error;
        console.log('✅ Profile updated successfully');
      } else {
        const { error } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            user_id: user.id,
            name: profileData.name,
            email: profileData.email,
            birth_date: profileData.birth_date || null,
            grade: profileData.grade,
            school: profileData.school,
            address: profileData.address,
            avatar_url: profileData.avatar_url,
            avatar_color: profileData.avatar_color
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

  return {
    profileData,
    setProfileData,
    loading,
    uploading,
    handleAvatarUpload,
    handleProfileUpdate
  };
};
