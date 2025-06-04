
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useNavigation } from "@/hooks/useNavigation";
import { Monitor, Gamepad2, BookOpenCheck, Settings, LogOut, Menu, ChevronDown, MessageSquare } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import MobileMenu from "./MobileMenu";
import GlobalCommunicationButton from "../communication/GlobalCommunicationButton";

interface NavbarProps {
  onGetStarted: () => void;
  onShowProgress: () => void;
  onShowGames: () => void;
  onShowAITutor: () => void;
  onResetNavigation?: () => void;
  showBackButton?: boolean;
  onBack?: () => void;
}

const Navbar = ({
  onGetStarted,
  onShowProgress,
  onShowGames,
  onShowAITutor,
  onResetNavigation,
  showBackButton = false,
  onBack
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

  const handleProfileClick = () => {
    window.location.href = '/profile';
  };

  return (
    <nav className="bg-gray-800 border-b border-gray-700 p-4 relative z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <button onClick={handleLogoClick} className="flex items-center space-x-2 hover:opacity-80 transition-opacity z-10">
            <div className="w-16 h-16 flex items-center justify-center">
              <img 
                src="/lovable-uploads/50b77ea0-3474-47cb-8e98-16b77f963d10.png" 
                alt="Nelie AI Tutor Robot"
                className="w-16 h-16 object-contain"
                draggable={false}
                style={{ 
                  userSelect: 'none'
                }}
              />
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent">
              NELIE
            </span>
          </button>
        </div>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="bg-blue-200 text-blue-800 border-blue-300 hover:bg-blue-300 h-10 px-4">
                    <Menu className="w-4 h-4 mr-2" />
                    Menu
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-white border border-gray-200 shadow-lg z-50">
                  <DropdownMenuItem 
                    onClick={() => handleNavigation(onShowProgress)}
                    className="cursor-pointer hover:bg-gray-100"
                  >
                    <Monitor className="w-4 h-4 mr-2" />
                    Progress
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => handleNavigation(onShowGames)}
                    className="cursor-pointer hover:bg-gray-100"
                  >
                    <Gamepad2 className="w-4 h-4 mr-2" />
                    Games
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => handleNavigation(onShowAITutor)}
                    className="cursor-pointer hover:bg-gray-100"
                  >
                    <BookOpenCheck className="w-4 h-4 mr-2" />
                    AI Tutor
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => window.location.href = '/communication'}
                    className="cursor-pointer hover:bg-gray-100"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Messages
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={handleProfileClick}
                    className="cursor-pointer hover:bg-gray-100"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={signOut}
                    className="cursor-pointer hover:bg-gray-100"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Log Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
          showBackButton={showBackButton}
          onBack={onBack}
        />
      </div>
    </nav>
  );
};

export default Navbar;
