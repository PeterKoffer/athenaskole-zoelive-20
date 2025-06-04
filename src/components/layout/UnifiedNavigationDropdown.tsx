
import { useNavigate } from "react-router-dom";
import { 
  Home, 
  BookOpen, 
  GraduationCap, 
  BarChart3, 
  Gamepad2, 
  Bot, 
  ChevronDown,
  Menu
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { User as SupabaseUser } from "@supabase/supabase-js";

interface UnifiedNavigationDropdownProps {
  user: SupabaseUser | null;
  onShowProgress?: () => void;
  onShowGames?: () => void;
  onShowAITutor?: () => void;
}

const UnifiedNavigationDropdown = ({ 
  user, 
  onShowProgress, 
  onShowGames, 
  onShowAITutor 
}: UnifiedNavigationDropdownProps) => {
  const navigate = useNavigate();

  const handleCurriculumSystem = () => {
    navigate('/curriculum-system');
  };

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline"
          className="bg-white/10 text-white border-white/20 hover:bg-white/20 h-10 px-4 rounded-lg backdrop-blur-sm"
        >
          <Menu className="w-4 h-4 mr-2" />
          Navigation
          <ChevronDown className="w-4 h-4 ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-gray-800 border-gray-700 z-50" align="start">
        <DropdownMenuLabel className="text-white">Home</DropdownMenuLabel>
        <DropdownMenuItem 
          onClick={() => navigate('/')}
          className="text-white hover:bg-gray-700 focus:bg-gray-700"
        >
          <Home className="mr-2 h-4 w-4" />
          Home
        </DropdownMenuItem>
        
        <DropdownMenuSeparator className="bg-gray-700" />
        
        <DropdownMenuLabel className="text-white">Learning</DropdownMenuLabel>
        <DropdownMenuItem 
          onClick={() => navigate('/daily-program')}
          className="text-white hover:bg-gray-700 focus:bg-gray-700"
        >
          <BookOpen className="mr-2 h-4 w-4" />
          Daily Program
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={handleCurriculumSystem}
          className="text-white hover:bg-gray-700 focus:bg-gray-700"
        >
          <GraduationCap className="mr-2 h-4 w-4" />
          Curriculum System
        </DropdownMenuItem>
        {onShowAITutor && (
          <DropdownMenuItem 
            onClick={onShowAITutor}
            className="text-white hover:bg-gray-700 focus:bg-gray-700"
          >
            <Bot className="mr-2 h-4 w-4" />
            AI Tutor
          </DropdownMenuItem>
        )}
        
        <DropdownMenuSeparator className="bg-gray-700" />
        
        <DropdownMenuLabel className="text-white">Activities</DropdownMenuLabel>
        {onShowGames && (
          <DropdownMenuItem 
            onClick={onShowGames}
            className="text-white hover:bg-gray-700 focus:bg-gray-700"
          >
            <Gamepad2 className="mr-2 h-4 w-4" />
            Games
          </DropdownMenuItem>
        )}
        {onShowProgress && (
          <DropdownMenuItem 
            onClick={onShowProgress}
            className="text-white hover:bg-gray-700 focus:bg-gray-700"
          >
            <BarChart3 className="mr-2 h-4 w-4" />
            Progress
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UnifiedNavigationDropdown;
