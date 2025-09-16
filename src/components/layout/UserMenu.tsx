
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useRoleAccess } from '@/hooks/useRoleAccess';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  User, 
  LogOut, 
  UserCog,
  ChevronDown,
  Bug
} from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/hooks/use-toast';
import { UserRole } from '@/types/auth';

const UserMenu = () => {
  const { user } = useAuth();
  const { userRole, setUserRoleManually } = useRoleAccess();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
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

  const handleRoleChange = (role: UserRole) => {
    setUserRoleManually(role);
    toast({
      title: "Role Changed",
      description: `You are now logged in as a ${role}`,
    });
  };

  const getUserInitials = () => {
    if (user?.user_metadata?.name) {
      return user.user_metadata.name.split(' ').map((n: string) => n[0]).join('').toUpperCase();
    }
    return user?.email?.substring(0, 2).toUpperCase() || 'U';
  };

  const getUserDisplayName = () => {
    return user?.user_metadata?.name || user?.email || 'User';
  };

  const roles: { value: UserRole; label: string }[] = [
    { value: 'student', label: 'Student' },
    { value: 'teacher', label: 'Teacher' },
    { value: 'parent', label: 'Parent' },
    { value: 'school_staff', label: 'School Staff' },
    { value: 'school_leader', label: 'School Leader' },
    { value: 'admin', label: 'Admin' },
  ];

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-auto px-3 text-white hover:text-lime-400 hover:bg-gray-800">
          <div className="flex items-center space-x-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-lime-400 text-gray-900 text-sm font-medium">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-start text-left">
              <span className="text-sm font-medium truncate max-w-32">
                {getUserDisplayName()}
              </span>
              {userRole && (
                <span className="text-xs text-gray-400 capitalize">
                  {userRole.replace('_', ' ')}
                </span>
              )}
            </div>
            <ChevronDown className="h-4 w-4" />
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 max-w-[calc(100vw-1rem)]" align="end" forceMount sideOffset={5}>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {getUserDisplayName()}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
            {userRole && (
              <p className="text-xs leading-none text-muted-foreground capitalize">
                Current role: {userRole.replace('_', ' ')}
              </p>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={() => navigate('/')}>
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        {import.meta.env.DEV && (
          <DropdownMenuItem onClick={() => navigate('/dev/events')}>
            <Bug className="mr-2 h-4 w-4" />
            <span>Dev · Events</span>
          </DropdownMenuItem>
        )}

        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <UserCog className="mr-2 h-4 w-4" />
            <span>Switch Role</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            {roles.map((role) => (
              <DropdownMenuItem
                key={role.value}
                onClick={() => handleRoleChange(role.value)}
                className={userRole === role.value ? 'bg-accent' : ''}
              >
                <span className={userRole === role.value ? 'font-medium' : ''}>
                  {role.label}
                </span>
                {userRole === role.value && (
                  <span className="ml-auto text-xs text-muted-foreground">
                    Current
                  </span>
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;