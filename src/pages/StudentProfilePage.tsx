
import React, { useState } from 'react';
import { useStudentProfile } from '@/hooks/useStudentProfile';
import { useAuth } from '@/hooks/useAuth';
import StudentProfileForm from '@/components/student/StudentProfileForm';
import StudentProfileDisplay from '@/components/student/StudentProfileDisplay';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

const StudentProfilePage = () => {
  const { user } = useAuth();
  const { profile, loading, createProfile, updateProfile } = useStudentProfile();
  const [isEditing, setIsEditing] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Please log in to view your student profile.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading student profile...</p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (profileData: any) => {
    const success = profile 
      ? await updateProfile(profileData)
      : await createProfile(profileData);
    
    if (success) {
      setIsEditing(false);
    }
    
    return success;
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Student Profile</h1>
          <p className="text-muted-foreground">
            Manage your learning preferences and track your progress
          </p>
        </div>

        {!profile || isEditing ? (
          <StudentProfileForm
            profile={profile || undefined}
            onSubmit={handleSubmit}
            loading={loading}
          />
        ) : (
          <StudentProfileDisplay
            profile={profile}
            onEdit={() => setIsEditing(true)}
          />
        )}
      </div>
    </div>
  );
};

export default StudentProfilePage;
