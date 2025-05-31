
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Monitor, Gamepad2, BookOpenCheck, Settings, LogOut, Menu, X } from "lucide-react";

interface MobileMenuProps {
  onShowProgress: () => void;
  onShowGames: () => void;
  onShowAITutor: () => void;
  onGetStarted: () => void;
}

const MobileMenu = ({
  onShowProgress,
  onShowGames,
  onShowAITutor,
  onGetStarted
}: MobileMenuProps) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  const handleNavigation = (action: () => void) => {
    action();
    closeMenu();
  };

  return (
    <div className="md:hidden">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="text-white z-50 relative"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </Button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 bg-gray-800 border-t border-gray-700 shadow-lg z-[60]">
          <div className="p-4 space-y-3">
            {user ? (
              <>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-white" 
                  onClick={() => handleNavigation(onShowProgress)}
                >
                  <Monitor className="w-4 h-4 mr-3" />
                  Fremskridt
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-white" 
                  onClick={() => handleNavigation(onShowGames)}
                >
                  <Gamepad2 className="w-4 h-4 mr-3" />
                  Spil
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-white" 
                  onClick={() => handleNavigation(onShowAITutor)}
                >
                  <BookOpenCheck className="w-4 h-4 mr-3" />
                  AI Lærer
                </Button>
                <div className="border-t border-gray-700 pt-3 mt-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start mb-2" 
                    onClick={() => {
                      navigate('/profile');
                      closeMenu();
                    }}
                  >
                    <Settings className="w-4 h-4 mr-3" />
                    Profil
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start" 
                    onClick={() => {
                      signOut();
                      closeMenu();
                    }}
                  >
                    <LogOut className="w-4 h-4 mr-3" />
                    Log ud
                  </Button>
                </div>
              </>
            ) : (
              <div className="space-y-2">
                <Button 
                  variant="ghost" 
                  className="w-full text-white" 
                  onClick={() => handleNavigation(onGetStarted)}
                >
                  Log ind
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={() => handleNavigation(onGetStarted)}
                >
                  Start Gratis
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileMenu;
