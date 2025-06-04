
import { useNavigate } from "react-router-dom";
import { Home, BookOpen, GraduationCap } from "lucide-react";
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
    <div className="hidden md:flex items-center space-x-1">
      <NavbarButton 
        onClick={() => navigate('/')} 
        icon={Home}
      >
        Home
      </NavbarButton>
      <NavbarButton 
        onClick={() => navigate('/daily-program')} 
        icon={BookOpen}
      >
        Daily Program
      </NavbarButton>
      <NavbarButton 
        onClick={handleCurriculumSystem} 
        icon={GraduationCap}
      >
        Curriculum System
      </NavbarButton>
      {onShowProgress && (
        <NavbarButton onClick={onShowProgress}>
          Progress
        </NavbarButton>
      )}
      {onShowGames && (
        <NavbarButton onClick={onShowGames}>
          Games
        </NavbarButton>
      )}
      {onShowAITutor && (
        <NavbarButton onClick={onShowAITutor}>
          AI Tutor
        </NavbarButton>
      )}
    </div>
  );
};

export default NavbarDesktopMenu;
