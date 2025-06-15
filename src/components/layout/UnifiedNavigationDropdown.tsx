
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { useNavigate } from "react-router-dom";
import { useRoleAccess } from "@/hooks/useRoleAccess";
import { 
  BookOpen, 
  Users, 
  GraduationCap, 
  Home, 
  School, 
  Calendar, 
  Shield,
  ChevronDown
} from "lucide-react";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface UnifiedNavigationDropdownProps {
  user?: any;
  onShowProgress?: () => void;
  onShowGames?: () => void;
  onShowAITutor?: () => void;
}

const UnifiedNavigationDropdown = ({
  user,
  onShowProgress,
  onShowGames,
  onShowAITutor
}: UnifiedNavigationDropdownProps) => {
  const navigate = useNavigate();
  const { userRole, canAccessSchoolDashboard } = useRoleAccess();

  console.log('[UnifiedNavigationDropdown] Current role:', userRole, 'Can access school dashboard:', canAccessSchoolDashboard());

  const handleNavigation = (path: string, action?: () => void) => {
    console.log('[UnifiedNavigationDropdown] Navigating to:', path);
    if (action) {
      action();
    } else {
      navigate(path);
    }
  };

  const dashboardItems = [
    {
      title: "Daily Program",
      href: "/daily-program",
      description: "Access your daily learning activities and progress",
      icon: Calendar,
      show: true
    },
    ...(canAccessSchoolDashboard() ? [{
      title: "School Dashboard",
      href: "/school-dashboard", 
      description: "Manage school operations and view analytics",
      icon: School,
      show: true
    }] : []),
    ...(userRole === 'teacher' ? [{
      title: "Teacher Dashboard",
      href: "/teacher-dashboard",
      description: "Manage your classes and student progress", 
      icon: GraduationCap,
      show: true
    }] : []),
    ...(userRole === 'parent' ? [{
      title: "Parent Dashboard", 
      href: "/parent-dashboard",
      description: "Monitor your child's progress and communicate",
      icon: Users,
      show: true
    }] : []),
    ...(userRole === 'admin' ? [{
      title: "Admin Dashboard",
      href: "/admin-dashboard", 
      description: "Full system management and administration",
      icon: Shield,
      show: true
    }] : [])
  ];

  const learningItems = [
    {
      title: "Progress Dashboard",
      description: "View your learning progress and achievements",
      action: onShowProgress,
      icon: BookOpen,
      show: !!onShowProgress
    },
    {
      title: "Learning Games", 
      description: "Play educational games and challenges",
      action: onShowGames,
      icon: Users,
      show: !!onShowGames
    },
    {
      title: "AI Tutor",
      description: "Get personalized help from your AI assistant", 
      action: onShowAITutor,
      icon: GraduationCap,
      show: !!onShowAITutor
    }
  ];

  if (!user) return null;

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-transparent text-white hover:text-lime-400 hover:bg-gray-800">
            <Home className="w-4 h-4 mr-2" />
            Navigate
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid gap-3 p-6 w-[600px] grid-cols-2">
              <div className="space-y-3">
                <h4 className="text-lg font-medium leading-none">Dashboards</h4>
                {dashboardItems.filter(item => item.show).map((item) => (
                  <ListItem
                    key={item.title}
                    title={item.title}
                    href={item.href}
                    onClick={() => handleNavigation(item.href)}
                    icon={item.icon}
                  >
                    {item.description}
                  </ListItem>
                ))}
              </div>
              <div className="space-y-3">
                <h4 className="text-lg font-medium leading-none">Learning</h4>
                {learningItems.filter(item => item.show).map((item) => (
                  <ListItem
                    key={item.title}
                    title={item.title}
                    onClick={() => item.action && handleNavigation('', item.action)}
                    icon={item.icon}
                  >
                    {item.description}
                  </ListItem>
                ))}
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

const ListItem = forwardRef<
  React.ElementRef<"button">,
  {
    title: string;
    icon?: React.ElementType;
    onClick?: () => void;
    children?: React.ReactNode;
    className?: string;
    href?: string;
  }
>(({ className, title, children, icon: Icon, onClick, href, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <button
          ref={ref}
          type="button"
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground w-full text-left",
            className
          )}
          onClick={onClick}
        >
          <div className="flex items-center space-x-2">
            {Icon && <Icon className="w-4 h-4" />}
            <div className="text-sm font-medium leading-none">{title}</div>
          </div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </button>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

export default UnifiedNavigationDropdown;
