
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, BarChart3, Gamepad2, MessageCircle, Calendar, BookOpen, GraduationCap, School, Users, Settings, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useRoleAccess } from "@/hooks/useRoleAccess";

interface UnifiedNavigationDropdownProps {
  user: any;
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

  if (!user) return null;

  const isStudent = userRole === 'student';
  const isParent = userRole === 'parent';
  const canAccessCalendar = userRole !== null; // All authenticated users can access calendar
  const hasReadOnlyCalendar = isStudent || isParent;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="text-white hover:text-lime-400 hover:bg-gray-800">
          Navigation
          <ChevronDown className="w-4 h-4 ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-gray-800 border-gray-700 text-white w-64 z-50">
        
        {/* Dashboard Access */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="hover:bg-gray-700">
            <GraduationCap className="w-4 h-4 mr-2" />
            Dashboards
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="bg-gray-800 border-gray-700 text-white">
            {userRole === 'admin' && (
              <DropdownMenuItem onClick={() => navigate('/admin-dashboard')} className="hover:bg-gray-700">
                <Settings className="w-4 h-4 mr-2" />
                Admin Dashboard
              </DropdownMenuItem>
            )}
            {canAccessSchoolDashboard() && (
              <DropdownMenuItem onClick={() => navigate('/school-dashboard')} className="hover:bg-gray-700">
                <School className="w-4 h-4 mr-2" />
                School Dashboard
              </DropdownMenuItem>
            )}
            {userRole === 'teacher' && (
              <DropdownMenuItem onClick={() => navigate('/teacher-dashboard')} className="hover:bg-gray-700">
                <BookOpen className="w-4 h-4 mr-2" />
                Teacher Dashboard
              </DropdownMenuItem>
            )}
            {userRole === 'parent' && (
              <DropdownMenuItem onClick={() => navigate('/parent-dashboard')} className="hover:bg-gray-700">
                <Users className="w-4 h-4 mr-2" />
                Parent Dashboard
              </DropdownMenuItem>
            )}
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSeparator className="bg-gray-700" />

        {/* Calendar Access */}
        {canAccessCalendar && (
          <>
            <DropdownMenuItem onClick={() => navigate('/calendar')} className="hover:bg-gray-700">
              <Calendar className="w-4 h-4 mr-2" />
              School Calendar {hasReadOnlyCalendar && "(View Only)"}
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-gray-700" />
          </>
        )}

        {/* Learning Tools */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="hover:bg-gray-700">
            <BookOpen className="w-4 h-4 mr-2" />
            Learning Tools
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="bg-gray-800 border-gray-700 text-white">
            <DropdownMenuItem onClick={() => navigate('/daily-program')} className="hover:bg-gray-700">
              <BookOpen className="w-4 h-4 mr-2" />
              Daily Program
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/adaptive-learning')} className="hover:bg-gray-700">
              <GraduationCap className="w-4 h-4 mr-2" />
              Adaptive Learning
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/ai-learning')} className="hover:bg-gray-700">
              <MessageCircle className="w-4 h-4 mr-2" />
              AI Learning
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSeparator className="bg-gray-700" />

        {/* Interactive Features */}
        {onShowProgress && (
          <DropdownMenuItem onClick={onShowProgress} className="hover:bg-gray-700">
            <BarChart3 className="w-4 h-4 mr-2" />
            Progress
          </DropdownMenuItem>
        )}

        {onShowGames && (
          <DropdownMenuItem onClick={onShowGames} className="hover:bg-gray-700">
            <Gamepad2 className="w-4 h-4 mr-2" />
            Games
          </DropdownMenuItem>
        )}

        {onShowAITutor && (
          <DropdownMenuItem onClick={onShowAITutor} className="hover:bg-gray-700">
            <MessageCircle className="w-4 h-4 mr-2" />
            AI Tutor
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator className="bg-gray-700" />

        {/* Profile */}
        <DropdownMenuItem onClick={() => navigate('/profile')} className="hover:bg-gray-700">
          <User className="w-4 h-4 mr-2" />
          Profile
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UnifiedNavigationDropdown;
