
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import MobileMenu from "./MobileMenu";
import NavbarLogo from "./NavbarLogo";
import NavbarDesktopMenu from "./NavbarDesktopMenu";
import NavbarUserMenu from "./NavbarUserMenu";
import UserRoleDisplay from "./UserRoleDisplay";
import { UserRole } from "@/types/auth";

interface NavbarProps {
  onGetStarted: () => void;
  onShowProgress?: () => void;
  onShowGames?: () => void;
  onShowAITutor?: () => void;
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
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    if (onResetNavigation) {
      onResetNavigation();
    }
  };

  const handleLogoClick = () => {
    if (onResetNavigation) {
      onResetNavigation();
    }
    navigate('/');
  };

  const handleCurriculumSystem = () => {
    navigate('/curriculum-system');
  };

  const userRole = (user?.user_metadata?.role as UserRole) || 'student';

  return (
    <>
      <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left side */}
            <div className="flex items-center space-x-4">
              {showBackButton && onBack && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={onBack}
                  className="text-white hover:bg-gray-800"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              )}
              
              <NavbarLogo onLogoClick={handleLogoClick} />
            </div>

            {/* Desktop Navigation */}
            <NavbarDesktopMenu 
              user={user}
              onShowProgress={onShowProgress}
              onShowGames={onShowGames}
              onShowAITutor={onShowAITutor}
            />

            {/* Right side */}
            <div className="flex items-center space-x-4">
              <UserRoleDisplay role={userRole} />
              
              <NavbarUserMenu 
                user={user}
                onGetStarted={onGetStarted}
                onSignOut={handleSignOut}
              />

              {/* Mobile menu button */}
              <div className="md:hidden">
                <MobileMenu 
                  isOpen={isMenuOpen} 
                  onToggle={() => setIsMenuOpen(!isMenuOpen)}
                  user={user}
                  onGetStarted={onGetStarted}
                  onSignOut={handleSignOut}
                  onShowProgress={onShowProgress}
                  onShowGames={onShowGames}
                  onShowAITutor={onShowAITutor}
                  onCurriculumSystem={handleCurriculumSystem}
                />
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
