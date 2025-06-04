
import { useNavigate } from "react-router-dom";
import { Home, BookOpen, GraduationCap, BarChart3, Gamepad2, Bot, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { User as SupabaseUser } from "@supabase/supabase-js";

interface NavbarDesktopMenuProps {
  user: SupabaseUser | null;
  onShowProgress?: () => void;
  onShowGames?: () => void;
  onShowAITutor?: () => void;
}

const NavbarDesktopMenu = ({ 
  user, 
  onShowProgress, 
  onShowGames, 
  onShowAITutor 
}: NavbarDesktopMenuProps) => {
  const navigate = useNavigate();

  const handleCurriculumSystem = () => {
    navigate('/curriculum-system');
  };

  if (!user) return null;

  return (
    <div className="hidden md:flex space-x-1">
      {/* Learning Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline"
            className="bg-white/10 text-white border-white/20 hover:bg-white/20 h-10 px-4 rounded-lg backdrop-blur-sm"
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Learning
            <ChevronDown className="w-4 h-4 ml-2" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-gray-800 border-gray-700" align="start">
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
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Activities Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline"
            className="bg-white/10 text-white border-white/20 hover:bg-white/20 h-10 px-4 rounded-lg backdrop-blur-sm"
          >
            <Gamepad2 className="w-4 h-4 mr-2" />
            Activities
            <ChevronDown className="w-4 h-4 ml-2" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-gray-800 border-gray-700" align="start">
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

      {/* Home Button */}
      <Button 
        variant="outline"
        onClick={() => navigate('/')}
        className="bg-white/10 text-white border-white/20 hover:bg-white/20 h-10 px-4 rounded-lg backdrop-blur-sm"
      >
        <Home className="w-4 h-4 mr-2" />
        Home
      </Button>
    </div>
  );
};

export default NavbarDesktopMenu;
