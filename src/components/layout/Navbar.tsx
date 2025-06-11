
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRoleAccess } from "@/hooks/useRoleAccess";
import MobileMenu from "./MobileMenu";
import NavbarLogo from "./NavbarLogo";
import NavbarUserMenu from "./NavbarUserMenu";
import NavbarButton from "./NavbarButton";
import UnifiedNavigationDropdown from "./UnifiedNavigationDropdown";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Brain, Home } from "lucide-react";

interface NavbarProps {
  onGetStarted: () => void;
  onShowProgress?: () => void;
  onShowGames?: () => void;
  onShowAITutor?: () => void;
  onShowInsights?: () => void;
  onResetNavigation?: () => void;
  showBackButton?: boolean;
  onBack?: () => void;
}

const Navbar = ({ 
  onGetStarted, 
  onShowProgress, 
  onShowGames, 
  onShowAITutor, 
  onShowInsights,
  onResetNavigation,
  showBackButton,
  onBack
}: NavbarProps) => {
  const { user } = useAuth();
  const { canAccessAIInsights } = useRoleAccess();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side */}
          <div className="flex items-center space-x-4">
            {showBackButton && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onBack}
                className="text-white hover:text-lime-400 hover:bg-gray-800"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
            )}
            <NavbarLogo onResetNavigation={onResetNavigation} />
            
            {/* Home button close to Nelie */}
            {onResetNavigation && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onResetNavigation}
                className="text-white hover:text-lime-400 hover:bg-gray-800 flex items-center gap-2"
              >
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">Home</span>
              </Button>
            )}
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <UnifiedNavigationDropdown 
              user={user}
              onShowProgress={onShowProgress}
              onShowGames={onShowGames}
              onShowAITutor={onShowAITutor}
            />
            
            {/* AI Insights Button - Only for admins and school leaders */}
            {user && onShowInsights && canAccessAIInsights() && (
              <NavbarButton
                onClick={onShowInsights}
                variant="outline"
                className="border-purple-600 text-purple-400 hover:bg-purple-600 hover:text-white"
                showBadge={true}
                badgeText="NEW"
                badgeColor="bg-purple-500"
              >
                <Brain className="w-4 h-4 mr-2" />
                AI Insights
              </NavbarButton>
            )}

            <NavbarUserMenu user={user} onGetStarted={onGetStarted} />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white hover:text-lime-400"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <MobileMenu 
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        user={user}
        onGetStarted={onGetStarted}
        onShowProgress={onShowProgress}
        onShowGames={onShowGames}
        onShowAITutor={onShowAITutor}
        onShowInsights={canAccessAIInsights() ? onShowInsights : undefined}
      />
    </nav>
  );
};

export default Navbar;
