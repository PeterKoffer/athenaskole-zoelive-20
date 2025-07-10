
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { SupabaseProfileService } from '@/services/learnerProfile/SupabaseProfileService';
import { useToast } from '@/hooks/use-toast';

const ProfileServiceTest = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);

  const profileService = new SupabaseProfileService();

  const testCreateProfile = async () => {
    if (!user?.id) {
      toast({
        title: "Error",
        description: "No user logged in",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      console.log('🧪 Testing profile creation...');
      const profile = await profileService.createInitialProfile(user.id);
      setProfileData(profile);
      
      toast({
        title: "Success",
        description: "Initial profile created successfully",
      });
      
      console.log('✅ Profile created:', profile);
    } catch (error) {
      console.error('❌ Error creating profile:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create profile",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const testGetProfile = async () => {
    if (!user?.id) {
      toast({
        title: "Error",
        description: "No user logged in",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      console.log('🧪 Testing profile retrieval...');
      const profile = await profileService.getProfile(user.id);
      setProfileData(profile);
      
      if (profile) {
        toast({
          title: "Success",
          description: "Profile retrieved successfully",
        });
        console.log('✅ Profile retrieved:', profile);
      } else {
        toast({
          title: "Info",
          description: "No profile found",
        });
        console.log('ℹ️ No profile found');
      }
    } catch (error) {
      console.error('❌ Error getting profile:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to get profile",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const testKcMasteryUpdate = async () => {
    if (!user?.id) {
      toast({
        title: "Error",
        description: "No user logged in",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      console.log('🧪 Testing KC mastery update...');
      
      const updatedProfile = await profileService.updateKcMastery(
        user.id,
        'kc-math-addition-test',
        {
          isCorrect: true,
          newAttempt: true,
          interactionType: 'question_attempt',
          interactionDetails: {
            timeTakenMs: 5000,
            hintsUsed: 0
          }
        }
      );
      
      setProfileData(updatedProfile);
      
      toast({
        title: "Success",
        description: "KC mastery updated successfully",
      });
      
      console.log('✅ KC mastery updated, profile:', updatedProfile);
    } catch (error) {
      console.error('❌ Error updating KC mastery:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update KC mastery",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Profile Service Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2 flex-wrap">
          <Button 
            onClick={testCreateProfile} 
            disabled={loading || !user}
            variant="outline"
          >
            {loading ? 'Loading...' : 'Create Profile'}
          </Button>
          
          <Button 
            onClick={testGetProfile} 
            disabled={loading || !user}
            variant="outline"
          >
            {loading ? 'Loading...' : 'Get Profile'}
          </Button>
          
          <Button 
            onClick={testKcMasteryUpdate} 
            disabled={loading || !user}
            variant="outline"
          >
            {loading ? 'Loading...' : 'Test KC Update'}
          </Button>
        </div>

        {!user && (
          <p className="text-sm text-muted-foreground">
            Please log in to test the profile service
          </p>
        )}

        {profileData && (
          <div className="mt-4">
            <h3 className="text-sm font-medium mb-2">Profile Data:</h3>
            <pre className="text-xs bg-muted p-3 rounded overflow-auto max-h-96">
              {JSON.stringify(profileData, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfileServiceTest;
