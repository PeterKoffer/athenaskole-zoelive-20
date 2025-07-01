
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { UserMetadata } from "@/types/auth"; // Import UserMetadata
import { supabase } from "@/integrations/supabase/client";
import { ProfileData } from "./types";

export const useProfileFetch = () => {
  const { user } = useAuth();
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
          name: data.name || (user.user_metadata as UserMetadata)?.name || "",
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
          name: (user.user_metadata as UserMetadata)?.name || "",
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
        name: (user.user_metadata as UserMetadata)?.name || "",
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

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  return {
    profileData,
    setProfileData,
    profileExists,
    setProfileExists,
    fetchProfile
  };
};
