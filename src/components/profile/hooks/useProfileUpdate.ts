
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ProfileData } from "./types";

export const useProfileUpdate = (
  profileData: ProfileData,
  profileExists: boolean,
  setProfileExists: (exists: boolean) => void
) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

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
    loading,
    handleProfileUpdate
  };
};
