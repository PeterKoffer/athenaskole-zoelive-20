
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Camera, User } from "lucide-react";

interface AvatarUploadProps {
  avatarUrl?: string;
  name?: string;
  uploading: boolean;
  onUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  avatarColor?: string;
}

const AvatarUpload = ({ 
  avatarUrl, 
  name, 
  uploading, 
  onUpload, 
  avatarColor = "#6366f1" 
}: AvatarUploadProps) => {
  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className="flex flex-col items-center mb-6">
      <div className="relative">
        <Avatar className="w-24 h-24 mb-4">
          {avatarUrl ? (
            <AvatarImage src={avatarUrl} alt={name || "Profile"} />
          ) : (
            <AvatarFallback 
              className="text-2xl font-bold text-white"
              style={{ backgroundColor: avatarColor }}
            >
              {getInitials(name)}
            </AvatarFallback>
          )}
        </Avatar>
        
        <div className="absolute -bottom-2 -right-2">
          <label htmlFor="avatar-upload" className="cursor-pointer">
            <Button
              type="button"
              size="sm"
              variant="secondary"
              className="rounded-full w-10 h-10 p-0 bg-gray-700 hover:bg-gray-600"
              disabled={uploading}
              asChild
            >
              <div>
                {uploading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Camera className="w-4 h-4" />
                )}
              </div>
            </Button>
          </label>
          <input
            id="avatar-upload"
            type="file"
            accept="image/*"
            onChange={onUpload}
            className="hidden"
            disabled={uploading}
          />
        </div>
      </div>
      
      <p className="text-sm text-gray-400 text-center">
        Click the camera icon to change your profile picture
      </p>
    </div>
  );
};

export default AvatarUpload;
