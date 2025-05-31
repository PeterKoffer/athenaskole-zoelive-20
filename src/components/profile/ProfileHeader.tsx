
import { Button } from "@/components/ui/button";
import { ArrowLeft, LogOut, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ProfileHeaderProps {
  onSignOut: () => void;
}

const ProfileHeader = ({ onSignOut }: ProfileHeaderProps) => {
  const navigate = useNavigate();

  const handleRoleSelector = () => {
    navigate('/auth');
  };

  return (
    <nav className="bg-gray-800 border-b border-gray-700 p-4">
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/')} 
          className="text-gray-400 hover:text-white hover:bg-gray-700"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-400 via-blue-500 to-cyan-400 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">P</span>
          </div>
          <span className="text-white font-semibold">My Profile</span>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            onClick={handleRoleSelector}
            className="border-gray-600 bg-white text-black hover:bg-gray-100"
          >
            <Users className="w-4 h-4 mr-2" />
            Switch Role
          </Button>
          <Button 
            variant="outline" 
            onClick={onSignOut} 
            className="border-gray-600 bg-white text-black hover:bg-gray-100"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default ProfileHeader;
