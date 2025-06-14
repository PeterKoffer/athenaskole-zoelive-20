
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "lucide-react";
import AvatarUpload from "./AvatarUpload";
import ProfileForm from "./ProfileForm";

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

interface ProfileCardProps {
  profileData: ProfileData;
  loading: boolean;
  uploading: boolean;
  onDataChange: (data: ProfileData) => void;
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
          avatarUrl={profileData.avatar_url}
          name={profileData.name}
          uploading={uploading}
          onUpload={onAvatarUpload}
          avatarColor={profileData.avatar_color}
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
