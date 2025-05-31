
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useNavigation } from "@/hooks/useNavigation";
import { Monitor, Gamepad2, BookOpenCheck, Settings, LogOut } from "lucide-react";
import MobileMenu from "./MobileMenu";
import NavbarButton from "./NavbarButton";

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
  const { handleNavigation, navigateToHome, isHomePage } = useNavigation();

  const handleLogoClick = () => {
    if (!isHomePage) {
      navigateToHome();
    } else if (onResetNavigation) {
      onResetNavigation();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const navItems = [
    { icon: Monitor, label: "Progress", action: onShowProgress },
    { icon: Gamepad2, label: "Games", action: onShowGames },
    { icon: BookOpenCheck, label: "AI Tutor", action: onShowAITutor }
  ];

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
              {navItems.map(({ icon, label, action }) => (
                <NavbarButton
                  key={label}
                  icon={icon}
                  label={label}
                  onClick={() => handleNavigation(action)}
                />
              ))}
              <Button 
                variant="outline" 
                className="bg-white text-black border-gray-300 hover:bg-gray-100 h-10 px-4"
              >
                Messages
              </Button>
              <NavbarButton
                icon={Settings}
                label="Profile"
                onClick={() => navigateToHome()}
              />
              <NavbarButton
                icon={LogOut}
                label="Log Out"
                onClick={signOut}
              />
            </>
          ) : (
            <>
              <Button 
                variant="outline" 
                onClick={onGetStarted}
                className="bg-white text-black border-gray-300 hover:bg-gray-100 h-10 px-4"
              >
                Sign In
              </Button>
              <Button 
                variant="outline" 
                onClick={onGetStarted} 
                className="bg-white text-black border-gray-300 hover:bg-gray-100 h-10 px-4"
              >
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
