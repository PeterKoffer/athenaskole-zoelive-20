
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabaseStudentProfileService } from '@/services/SupabaseStudentProfileService';
import { StudentProfile } from '@/types/studentProfile';
import { useToast } from './use-toast';

export const useStudentProfile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      if (!user?.id) return;

      setLoading(true);
      setError(null);
      
      try {
        const studentProfile = await supabaseStudentProfileService.getProfile(user.id);
        setProfile(studentProfile);
      } catch (err) {
        console.error('Error loading student profile:', err);
        setError('Failed to load student profile');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user]);

  const createProfile = async (profileData: Omit<StudentProfile, 'id'>) => {
    if (!user?.id) return false;
    
    setLoading(true);
    setError(null);
    
    try {
      const newProfile = await supabaseStudentProfileService.createProfile(user.id, profileData);
      if (newProfile) {
        setProfile(newProfile);
        toast({
          title: "Profile Created",
          description: "Your student profile has been created successfully.",
        });
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error creating student profile:', err);
      setError('Failed to create student profile');
      toast({
        title: "Error",
        description: "Failed to create student profile. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<Omit<StudentProfile, 'id'>>) => {
    if (!user?.id) return false;
    
    setLoading(true);
    setError(null);
    
    try {
      const updatedProfile = await supabaseStudentProfileService.updateProfile(user.id, updates);
      if (updatedProfile) {
        setProfile(updatedProfile);
        toast({
          title: "Profile Updated",
          description: "Your student profile has been updated successfully.",
        });
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error updating student profile:', err);
      setError('Failed to update student profile');
      toast({
        title: "Error",
        description: "Failed to update student profile. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteProfile = async () => {
    if (!user?.id) return false;
    
    setLoading(true);
    setError(null);
    
    try {
      const success = await supabaseStudentProfileService.deleteProfile(user.id);
      if (success) {
        setProfile(null);
        toast({
          title: "Profile Deleted",
          description: "Your student profile has been deleted successfully.",
        });
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error deleting student profile:', err);
      setError('Failed to delete student profile');
      toast({
        title: "Error",
        description: "Failed to delete student profile. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    profile,
    loading,
    error,
    createProfile,
    updateProfile,
    deleteProfile
  };
};
