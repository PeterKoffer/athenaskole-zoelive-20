
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, User, LogOut, BookOpen, BarChart3, Gamepad2, Bot, GraduationCap, Home } from "lucide-react";
import { User as SupabaseUser } from "@supabase/supabase-js";

interface MobileMenuProps {
  isOpen: boolean;
  onToggle: () => void;
  user: SupabaseUser | null;
  onGetStarted: () => void;
  onSignOut: () => void;
  onShowProgress?: () => void;
  onShowGames?: () => void;
  onShowAITutor?: () => void;
  onCurriculumSystem?: () => void;
}

const MobileMenu = ({ 
  isOpen, 
  onToggle, 
  user, 
  onGetStarted, 
  onSignOut,
  onShowProgress,
  onShowGames,
  onShowAITutor,
  onCurriculumSystem
}: MobileMenuProps) => {
  const navigate = useNavigate();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleMenuItemClick = (action: () => void) => {
    action();
    setIsSheetOpen(false);
  };

  const menuItems = user ? [
    { 
      label: "Home", 
      icon: Home, 
      action: () => navigate('/') 
    },
    { 
      label: "Daily Program", 
      icon: BookOpen, 
      action: () => navigate('/daily-program') 
    },
    { 
      label: "Curriculum System", 
      icon: GraduationCap, 
      action: () => onCurriculumSystem?.() 
    },
    ...(onShowProgress ? [{ 
      label: "Progress", 
      icon: BarChart3, 
      action: onShowProgress 
    }] : []),
    ...(onShowGames ? [{ 
      label: "Games", 
      icon: Gamepad2, 
      action: onShowGames 
    }] : []),
    ...(onShowAITutor ? [{ 
      label: "AI Tutor", 
      icon: Bot, 
      action: onShowAITutor 
    }] : []),
    { 
      label: "Profile", 
      icon: User, 
      action: () => navigate('/profile') 
    },
    { 
      label: "Sign Out", 
      icon: LogOut, 
      action: onSignOut 
    }
  ] : [];

  return (
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="text-white hover:bg-gray-800">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="bg-gray-900 border-gray-800 w-[280px]">
        <div className="flex flex-col space-y-4 mt-8">
          {user ? (
            <div className="space-y-2">
              <div className="px-3 py-2 border-b border-gray-700">
                <p className="text-white font-medium">
                  {user.user_metadata?.name || user.email?.split('@')[0] || 'User'}
                </p>
                <p className="text-gray-400 text-sm">{user.email}</p>
              </div>
              
              {menuItems.map((item, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className="w-full justify-start text-white hover:bg-gray-800"
                  onClick={() => handleMenuItemClick(item.action)}
                >
                  <item.icon className="mr-3 h-4 w-4" />
                  {item.label}
                </Button>
              ))}
            </div>
          ) : (
            <Button 
              onClick={() => handleMenuItemClick(onGetStarted)}
              className="bg-gradient-to-r from-lime-400 to-lime-600 hover:opacity-90 text-gray-900 font-semibold border-none"
            >
              Get Started
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;
