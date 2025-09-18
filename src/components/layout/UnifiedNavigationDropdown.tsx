
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
  Settings
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

  console.log('[UnifiedNavigationDropdown] =================');
  console.log('[UnifiedNavigationDropdown] Current role:', userRole);
  console.log('[UnifiedNavigationDropdown] Can access school dashboard:', canAccessSchoolDashboard());
  console.log('[UnifiedNavigationDropdown] User:', user?.email);
  console.log('[UnifiedNavigationDropdown] =================');

  // Simplified navigation handler
  const navigateToPage = (path: string) => {
    console.log('[UnifiedNavigationDropdown] Direct navigation to:', path);
    navigate(path);
  };

  const executeAction = (action: () => void) => {
    console.log('[UnifiedNavigationDropdown] Executing action');
    action();
  };

  const dashboardItems = [
    {
      title: "Today's Adventure",
      href: "/adventure",
      description: "Start your daily learning adventure",
      icon: Calendar,
      show: true
    },
    {
      title: "Calendar",
      href: "/calendar",
      description: "View upcoming events and keyword schedules",
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
    ...(userRole === 'teacher' ? [
      {
        title: "Teacher Dashboard",
        href: "/teacher-dashboard",
        description: "Manage your classes and student progress", 
        icon: GraduationCap,
        show: true
      },
      {
        title: "My Classes",
        href: "/teacher-dashboard/classes",
        description: "View and manage your class schedules",
        icon: BookOpen,
        show: true
      },
      {
        title: "Student Progress",
        href: "/teacher-dashboard/progress",
        description: "Track student performance and analytics",
        icon: Users,
        show: true
      },
      {
        title: "AI Content Preferences",
        href: "/teacher-dashboard/ai-preferences",
        description: "Configure AI-generated content settings",
        icon: Settings,
        show: true
      },
      {
        title: "Lesson Duration",
        href: "/teacher-dashboard/duration",
        description: "Set lesson durations per class",
        icon: Calendar,
        show: true
      }
    ] : []),
    ...(userRole === 'parent' ? [{
      title: "Parent Dashboard", 
      href: "/parent-dashboard",
      description: "Monitor your child's progress and communicate",
      icon: Users,
      show: true
    }] : []),
    ...(userRole === 'admin' ? [
      {
        title: "Admin Dashboard",
        href: "/admin-dashboard", 
        description: "Full system management and administration",
        icon: Shield,
        show: true
      }
    ] : [])
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

  console.log('[UnifiedNavigationDropdown] Dashboard items that will show:', dashboardItems.filter(item => item.show));
  console.log('[UnifiedNavigationDropdown] Learning items that will show:', learningItems.filter(item => item.show));

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
                    onClick={() => navigateToPage(item.href)}
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
                    onClick={() => item.action && executeAction(item.action)}
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
>(({ className, title, children, icon: Icon, onClick }, ref) => {
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
