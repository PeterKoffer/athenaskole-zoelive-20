
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
  if (loading) {
    return <div>Loading profile...</div>;
  }

  if (!profileData) {
    return <div>No profile data found.</div>
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
          avatarUrl={profileData.avatarUrl}
          name={profileData.name}
          uploading={uploading}
          onUpload={onAvatarUpload}
          avatarColor={profileData.avatarColor}
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
