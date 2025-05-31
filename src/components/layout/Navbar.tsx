
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate, useLocation } from "react-router-dom";
import { Monitor, Gamepad2, BookOpenCheck, Settings, LogOut } from "lucide-react";
import MobileMenu from "./MobileMenu";
import GlobalCommunicationButton from "@/components/communication/GlobalCommunicationButton";

interface NavbarProps {
  onGetStarted: () => void;
  onShowProgress: () => void;
  onShowGames: () => void;
  onShowAITutor: () => void;
  onResetNavigation?: () => void;
}

const Navbar = ({
  onGetStarted,
  onShowProgress,
  onShowGames,
  onShowAITutor,
  onResetNavigation
}: NavbarProps) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (action: () => void) => {
    // If we're not on the homepage, navigate there first
    if (location.pathname !== '/') {
      navigate('/');
      // Use setTimeout to ensure navigation completes before executing action
      setTimeout(() => {
        action();
      }, 100);
    } else {
      action();
    }
  };

  const handleLogoClick = () => {
    if (location.pathname !== '/') {
      navigate('/');
    } else if (onResetNavigation) {
      onResetNavigation();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <nav className="bg-gray-800 border-b border-gray-700 p-4 relative z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <button onClick={handleLogoClick} className="flex items-center space-x-2 hover:opacity-80 transition-opacity z-10">
          <div className="w-8 h-8 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full flex items-center justify-center">
            <span className="text-lg">👩‍🏫</span>
          </div>
          <span className="font-bold text-xl bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent">
            NELIE
          </span>
        </button>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-4">
          {user ? (
            <>
              <Button variant="ghost" onClick={() => handleNavigation(onShowProgress)}>
                <Monitor className="w-4 h-4 mr-2" />
                Progress
              </Button>
              <Button variant="ghost" onClick={() => handleNavigation(onShowGames)}>
                <Gamepad2 className="w-4 h-4 mr-2" />
                Games
              </Button>
              <Button variant="ghost" onClick={() => handleNavigation(onShowAITutor)}>
                <BookOpenCheck className="w-4 h-4 mr-2" />
                AI Tutor
              </Button>
              <GlobalCommunicationButton />
              <Button variant="outline" onClick={() => navigate('/profile')} className="text-slate-950">
                <Settings className="w-4 h-4 mr-2" />
                Profile
              </Button>
              <Button variant="outline" onClick={signOut} className="text-slate-950">
                <LogOut className="w-4 h-4 mr-2" />
                Log Out
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" onClick={onGetStarted}>
                Sign In
              </Button>
              <Button variant="outline" onClick={onGetStarted} className="text-slate-950">
                Start Free
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu */}
        <MobileMenu
          onGetStarted={onGetStarted}
          onShowProgress={() => handleNavigation(onShowProgress)}
          onShowGames={() => handleNavigation(onShowGames)}
          onShowAITutor={() => handleNavigation(onShowAITutor)}
        />
      </div>
    </nav>
  );
};

export default Navbar;
