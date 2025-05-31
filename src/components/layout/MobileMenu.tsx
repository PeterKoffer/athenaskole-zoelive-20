
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useNavigation } from "@/hooks/useNavigation";
import { Monitor, Gamepad2, BookOpenCheck, Settings, LogOut, Menu, X, ArrowLeft } from "lucide-react";
import NavbarButton from "./NavbarButton";

interface MobileMenuProps {
  onShowProgress: () => void;
  onShowGames: () => void;
  onShowAITutor: () => void;
  onGetStarted: () => void;
  showBackButton?: boolean;
  onBack?: () => void;
}

const MobileMenu = ({
  onShowProgress,
  onShowGames,
  onShowAITutor,
  onGetStarted,
  showBackButton = false,
  onBack
}: MobileMenuProps) => {
  const { user, signOut } = useAuth();
  const { navigateToHome } = useNavigation();
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  const handleNavigation = (action: () => void) => {
    action();
    closeMenu();
  };

  const handleProfileClick = () => {
    navigateToHome();
    closeMenu();
  };

  const menuItems = [
    { icon: Monitor, label: "Progress", action: onShowProgress },
    { icon: Gamepad2, label: "Games", action: onShowGames },
    { icon: BookOpenCheck, label: "AI Tutor", action: onShowAITutor }
  ];

  return (
    <div className="md:hidden flex items-center space-x-2">
      {showBackButton && onBack && (
        <Button
          variant="outline"
          size="sm"
          onClick={onBack}
          className="bg-white text-black border-gray-300 hover:bg-gray-100 p-2"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
      )}
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white text-black border-gray-300 hover:bg-gray-100 z-50 relative"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </Button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 bg-gray-800 border-t border-gray-700 shadow-lg z-[60]">
          <div className="p-4 space-y-3">
            {user ? (
              <>
                {menuItems.map(({ icon, label, action }) => (
                  <Button
                    key={label}
                    variant="outline" 
                    className="w-full justify-start bg-white text-black border-gray-300 hover:bg-gray-100" 
                    onClick={() => handleNavigation(action)}
                  >
                    {React.createElement(icon, { className: "w-4 h-4 mr-3" })}
                    {label}
                  </Button>
                ))}
                <div className="border-t border-gray-700 pt-3 mt-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start mb-2 bg-white text-black border-gray-300 hover:bg-gray-100" 
                    onClick={handleProfileClick}
                  >
                    <Settings className="w-4 h-4 mr-3" />
                    Profile
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start bg-white text-black border-gray-300 hover:bg-gray-100" 
                    onClick={() => {
                      signOut();
                      closeMenu();
                    }}
                  >
                    <LogOut className="w-4 h-4 mr-3" />
                    Log Out
                  </Button>
                </div>
              </>
            ) : (
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full bg-white text-black border-gray-300 hover:bg-gray-100" 
                  onClick={() => handleNavigation(onGetStarted)}
                >
                  Sign In
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full bg-white text-black border-gray-300 hover:bg-gray-100" 
                  onClick={() => handleNavigation(onGetStarted)}
                >
                  Start Free
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
