
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface LearningHeaderProps {
  title?: string;
  backTo?: string;
  backLabel?: string;
}

const LearningHeader = ({ 
  title, 
  backTo = "/", 
  backLabel = "Back to Program" 
}: LearningHeaderProps) => {
  const navigate = useNavigate();

  return (
    <nav className="bg-gray-800 border-b border-gray-700 p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Left side - AI Tutor logo */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full flex items-center justify-center">
            <span className="text-lg">👩‍🏫</span>
          </div>
          <span className="font-bold text-xl bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent">
            NELIE
          </span>
        </div>

        {/* Center - Back button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate(backTo)}
          className="text-gray-400 hover:text-white hover:bg-gray-700"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {backLabel}
        </Button>

        {/* Right side - Empty for balance */}
        <div className="w-8"></div>
      </div>
    </nav>
  );
};

export default LearningHeader;
