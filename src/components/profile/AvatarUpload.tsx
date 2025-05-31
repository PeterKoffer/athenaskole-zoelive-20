
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Camera, Users, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface AvatarUploadProps {
  avatarUrl: string;
  name: string;
  uploading: boolean;
  onUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const AvatarUpload = ({ avatarUrl, name, uploading, onUpload }: AvatarUploadProps) => {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleRoleSelector = () => {
    navigate('/auth');
  };

  return (
    <div className="flex flex-col items-center mb-8">
      <div className="relative">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="relative cursor-pointer">
              <Avatar className="w-24 h-24 mb-4 hover:opacity-80 transition-opacity">
                <AvatarImage src={avatarUrl} />
                <AvatarFallback className="bg-gradient-to-br from-purple-400 to-cyan-400 text-white text-xl">
                  {name ? name.charAt(0).toUpperCase() : 'U'}
                </AvatarFallback>
              </Avatar>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            className="w-48 bg-gray-800 border-gray-700 text-white z-[9999]" 
            align="center"
            side="bottom"
            sideOffset={5}
          >
            <DropdownMenuItem 
              onClick={handleRoleSelector}
              className="text-white hover:bg-gray-700 focus:bg-gray-700 cursor-pointer"
            >
              <Users className="w-4 h-4 mr-2" />
              Switch Role
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-gray-600" />
            <DropdownMenuItem 
              onClick={signOut}
              className="text-white hover:bg-gray-700 focus:bg-gray-700 cursor-pointer"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
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
      {uploading && <p className="text-gray-400 text-sm">Uploading image...</p>}
    </div>
  );
};

export default AvatarUpload;
