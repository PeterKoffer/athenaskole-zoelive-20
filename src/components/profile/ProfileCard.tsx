
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "lucide-react";
import AvatarUpload from "./AvatarUpload";
import ProfileForm from "./ProfileForm";
import { LearnerProfile } from "@/types/learnerProfile";

interface ProfileCardProps {
  profileData: LearnerProfile;
  loading: boolean;
  uploading: boolean;
  onDataChange: (data: Partial<LearnerProfile>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onAvatarUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const ProfileCard = ({ 
  profileData, 
  loading, 
  uploading, 
  onDataChange, 
  onSubmit, 
  onAvatarUpload 
}: ProfileCardProps) => {
  console.log('ProfileCard render:', { profileData: !!profileData, loading, uploading });

  if (loading) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mr-4"></div>
          <span>Loading profile...</span>
        </CardContent>
      </Card>
    );
  }

  if (!profileData) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="text-center py-12">
          <div className="text-gray-400">No profile data found.</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <User className="w-5 h-5 mr-2" />
          Profile Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <AvatarUpload
          avatarUrl={profileData.avatarUrl || ''}
          name={profileData.name || 'User'}
          uploading={uploading}
          onUpload={onAvatarUpload}
          avatarColor={profileData.avatarColor || '#6366f1'}
        />
        <ProfileForm
          profileData={profileData}
          loading={loading}
          onDataChange={onDataChange}
          onSubmit={onSubmit}
        />
      </CardContent>
    </Card>
  );
};

export default ProfileCard;
