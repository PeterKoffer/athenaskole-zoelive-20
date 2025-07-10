
import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { SupabaseProfileService } from '@/services/learnerProfile/SupabaseProfileService';
import { useToast } from '@/hooks/use-toast';

const ProfileDebugButton = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const checkProfile = async () => {
    if (!user?.id) {
      toast({
        title: "Debug Check",
        description: "No user logged in",
        variant: "destructive"
      });
      return;
    }

    try {
      console.log('🔍 Debug: Checking profile for user:', user.id);
      
      const profileService = new SupabaseProfileService();
      const profile = await profileService.getProfile(user.id);
      
      console.log('📊 Profile Result:', profile);
      
      if (profile) {
        toast({
          title: "Profile Found",
          description: `Profile exists with ${Object.keys(profile.knowledgeComponents).length} KCs`,
        });
      } else {
        toast({
          title: "No Profile Found",
          description: "Profile doesn't exist - attempting to create...",
          variant: "destructive"
        });
        
        // Try to create initial profile
        const newProfile = await profileService.createInitialProfile(user.id);
        console.log('🆕 Created Profile:', newProfile);
        
        toast({
          title: "Profile Created",
          description: "Initial profile created successfully",
        });
      }
    } catch (error) {
      console.error('❌ Debug error:', error);
      toast({
        title: "Debug Error",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive"
      });
    }
  };

  return (
    <Button
      onClick={checkProfile}
      variant="outline"
      size="sm"
      className="border-yellow-400/50 text-yellow-400 hover:bg-yellow-400/10"
    >
      🔍 Check Profile
    </Button>
  );
};

export default ProfileDebugButton;
