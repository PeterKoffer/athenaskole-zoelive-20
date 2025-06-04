
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { ArrowLeft, User, LogOut, BookOpen, GraduationCap, Home } from "lucide-react";
import MobileMenu from "./MobileMenu";
import NavbarButton from "./NavbarButton";
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

  const userName = user?.user_metadata?.name || user?.email?.split('@')[0] || 'User';
  const userInitials = userName.split(' ').map((n: string) => n[0]).join('').toUpperCase();
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
              
              <div 
                className="flex items-center space-x-2 cursor-pointer" 
                onClick={handleLogoClick}
              >
                <div className="w-8 h-8 bg-gradient-to-r from-lime-400 to-lime-600 rounded-lg flex items-center justify-center">
                  <span className="text-gray-900 font-bold text-lg">N</span>
                </div>
                <span className="text-white text-xl font-bold">Nelie</span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {user && (
                <>
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
                </>
              )}
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-4">
              <UserRoleDisplay role={userRole} />
              
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.user_metadata?.avatar_url} alt={userName} />
                        <AvatarFallback className="bg-lime-600 text-gray-900">
                          {userInitials}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 bg-gray-800 border-gray-700" align="end">
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium text-white">{userName}</p>
                        <p className="w-[200px] truncate text-sm text-gray-400">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <DropdownMenuSeparator className="bg-gray-700" />
                    <DropdownMenuItem 
                      onClick={() => navigate('/profile')}
                      className="text-white hover:bg-gray-700 focus:bg-gray-700"
                    >
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </DropdownMenuItem>
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
                    <DropdownMenuSeparator className="bg-gray-700" />
                    <DropdownMenuItem 
                      onClick={handleSignOut}
                      className="text-white hover:bg-gray-700 focus:bg-gray-700"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button 
                  onClick={onGetStarted}
                  className="bg-gradient-to-r from-lime-400 to-lime-600 hover:opacity-90 text-gray-900 font-semibold border-none"
                >
                  Get Started
                </Button>
              )}

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
