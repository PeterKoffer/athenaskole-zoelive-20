
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Camera } from "lucide-react";

interface AvatarUploadProps {
  avatarUrl: string;
  name: string;
  uploading: boolean;
  onUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const AvatarUpload = ({ avatarUrl, name, uploading, onUpload }: AvatarUploadProps) => {
  return (
    <div className="flex flex-col items-center mb-8">
      <div className="relative">
        <Avatar className="w-24 h-24 mb-4">
          <AvatarImage src={avatarUrl} />
          <AvatarFallback className="bg-gradient-to-br from-purple-400 to-cyan-400 text-white text-xl">
            {name ? name.charAt(0).toUpperCase() : 'U'}
          </AvatarFallback>
        </Avatar>
        <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 bg-purple-600 hover:bg-purple-700 rounded-full p-2 cursor-pointer">
          <Camera className="w-4 h-4 text-white" />
          <input
            id="avatar-upload"
            type="file"
            accept="image/*"
            onChange={onUpload}
            className="hidden"
            disabled={uploading}
          />
        </label>
      </div>
      {uploading && <p className="text-gray-400 text-sm">Uploader billede...</p>}
    </div>
  );
};

export default AvatarUpload;
