
import { Button } from "@/components/ui/button";
import { ArrowLeft, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ProfileHeaderProps {
  onSignOut: () => void;
}

const ProfileHeader = ({ onSignOut }: ProfileHeaderProps) => {
  const navigate = useNavigate();

  return (
    <nav className="bg-gray-800 border-b border-gray-700 p-4">
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/')}
          className="text-gray-400 hover:text-white hover:bg-gray-700"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Tilbage til forsiden
        </Button>
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-400 via-blue-500 to-cyan-400 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">Α</span>
          </div>
          <span className="text-white font-semibold">Min Profil</span>
        </div>
        <Button
          variant="outline"
          onClick={onSignOut}
          className="text-white border-gray-600 hover:bg-gray-700"
        >
          Log ud
        </Button>
      </div>
    </nav>
  );
};

export default ProfileHeader;
