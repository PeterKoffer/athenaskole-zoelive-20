
import { useAuth } from "@/hooks/useAuth";
import { useRoleAccess } from "@/hooks/useRoleAccess";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  BarChart3, 
  Gamepad2, 
  MessageCircle, 
  LogOut,
  Brain
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  onGetStarted: () => void;
  onShowProgress?: () => void;
  onShowGames?: () => void;
  onShowAITutor?: () => void;
  onShowInsights?: () => void;
}

const MobileMenu = ({ 
  isOpen, 
  onClose, 
  user, 
  onGetStarted, 
  onShowProgress, 
  onShowGames, 
  onShowAITutor,
  onShowInsights
}: MobileMenuProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { canAccessAIInsights } = useRoleAccess();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
      navigate('/');
      onClose();
    } catch (error) {
      console.error('Error logging out:', error);
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleMenuItemClick = (action: () => void) => {
    action();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="md:hidden bg-gray-800 border-t border-gray-700">
      <div className="px-4 py-4 space-y-2">
        {user ? (
          <>
            <div className="px-3 py-2 text-sm text-gray-300 border-b border-gray-700 mb-2">
              Welcome, {user.user_metadata?.name || user.email}
            </div>
            
            {onShowProgress && (
              <Button
                variant="ghost"
                className="w-full justify-start text-white hover:text-lime-400 hover:bg-gray-700"
                onClick={() => handleMenuItemClick(onShowProgress)}
              >
                <BarChart3 className="w-4 h-4 mr-3" />
                Progress
              </Button>
            )}
            
            {onShowGames && (
              <Button
                variant="ghost"
                className="w-full justify-start text-white hover:text-lime-400 hover:bg-gray-700"
                onClick={() => handleMenuItemClick(onShowGames)}
              >
                <Gamepad2 className="w-4 h-4 mr-3" />
                Games
              </Button>
            )}
            
            {onShowAITutor && (
              <Button
                variant="ghost"
                className="w-full justify-start text-white hover:text-lime-400 hover:bg-gray-700"
                onClick={() => handleMenuItemClick(onShowAITutor)}
              >
                <MessageCircle className="w-4 h-4 mr-3" />
                AI Tutor
              </Button>
            )}

            {onShowInsights && canAccessAIInsights() && (
              <Button
                variant="ghost"
                className="w-full justify-start text-purple-400 hover:text-purple-300 hover:bg-gray-700 relative"
                onClick={() => handleMenuItemClick(onShowInsights)}
              >
                <Brain className="w-4 h-4 mr-3" />
                AI Insights
                <Badge className="ml-auto bg-purple-500 text-white text-xs">
                  NEW
                </Badge>
              </Button>
            )}
            
            <Button
              variant="ghost"
              className="w-full justify-start text-white hover:text-lime-400 hover:bg-gray-700"
              onClick={() => {
                navigate('/profile');
                onClose();
              }}
            >
              <User className="w-4 h-4 mr-3" />
              Profile
            </Button>
            
            <Button
              variant="ghost"
              className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-gray-700"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-3" />
              Logout
            </Button>
          </>
        ) : (
          <Button
            onClick={() => {
              onGetStarted();
              onClose();
            }}
            className="w-full bg-lime-400 hover:bg-lime-500 text-gray-900 font-semibold"
          >
            Get Started
          </Button>
        )}
      </div>
    </div>
  );
};

export default MobileMenu;
