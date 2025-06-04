
import { useNavigate } from "react-router-dom";
import { Home, BookOpen, GraduationCap, BarChart3, Gamepad2, Bot } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import NavbarButton from "./NavbarButton";
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
    <NavigationMenu className="hidden md:flex">
      <NavigationMenuList className="space-x-1">
        <NavigationMenuItem>
          <NavbarButton 
            onClick={() => navigate('/')} 
            icon={Home}
          >
            Home
          </NavbarButton>
        </NavigationMenuItem>
        
        <NavigationMenuItem>
          <NavbarButton 
            onClick={() => navigate('/daily-program')} 
            icon={BookOpen}
          >
            Daily Program
          </NavbarButton>
        </NavigationMenuItem>
        
        <NavigationMenuItem>
          <NavbarButton 
            onClick={handleCurriculumSystem} 
            icon={GraduationCap}
          >
            Curriculum System
          </NavbarButton>
        </NavigationMenuItem>
        
        {onShowProgress && (
          <NavigationMenuItem>
            <NavbarButton 
              onClick={onShowProgress}
              icon={BarChart3}
            >
              Progress
            </NavbarButton>
          </NavigationMenuItem>
        )}
        
        {onShowGames && (
          <NavigationMenuItem>
            <NavbarButton 
              onClick={onShowGames}
              icon={Gamepad2}
            >
              Games
            </NavbarButton>
          </NavigationMenuItem>
        )}
        
        {onShowAITutor && (
          <NavigationMenuItem>
            <NavbarButton 
              onClick={onShowAITutor}
              icon={Bot}
            >
              AI Tutor
            </NavbarButton>
          </NavigationMenuItem>
        )}
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default NavbarDesktopMenu;
