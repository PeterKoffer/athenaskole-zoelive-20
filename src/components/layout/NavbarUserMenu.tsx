
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
import { User, LogOut, BookOpen, GraduationCap } from "lucide-react";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/hooks/use-toast";

interface NavbarUserMenuProps {
  user: SupabaseUser | null;
  onGetStarted: () => void;
}

const NavbarUserMenu = ({ user, onGetStarted }: NavbarUserMenuProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCurriculumSystem = () => {
    navigate('/curriculum-system');
  };

  // Show simple Get Started button for non-authenticated users
  if (!user) {
    return (
      <Button 
        onClick={onGetStarted}
        className="bg-gradient-to-r from-lime-400 to-lime-600 hover:opacity-90 text-gray-900 font-semibold border-none"
      >
        Get Started
      </Button>
    );
  }

  // Show authenticated user menu
  const userName = user.user_metadata?.name || user.email?.split('@')[0] || 'User';
  const userInitials = userName.split(' ').map((n: string) => n[0]).join('').toUpperCase();

  return (
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
          onClick={() => navigate('/daily-program')}
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
  );
};

export default NavbarUserMenu;
