
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { BookOpen, Users, ClipboardList, MessageSquare, ChevronDown, BarChart3, Settings, UserPlus, School, Menu, GraduationCap, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SchoolManagementDropdownProps {
  onShowTeachingSettings: () => void;
}

const SchoolManagementDropdown = ({ onShowTeachingSettings }: SchoolManagementDropdownProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex gap-4 mb-6">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="border-gray-600 text-white bg-gray-800 hover:bg-gray-700">
            <Menu className="w-4 h-4 mr-2" />
            School Management Suite
            <ChevronDown className="w-4 h-4 ml-2" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-gray-800 border-gray-700 text-white w-64">
          {/* Student Management Submenu */}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="hover:bg-gray-700">
              <Users className="w-4 h-4 mr-2" />
              Student Management
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="bg-gray-800 border-gray-700 text-white">
              <DropdownMenuItem 
                className="hover:bg-gray-700"
                onClick={() => navigate('/school-dashboard')}
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Register New Student
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="hover:bg-gray-700"
                onClick={() => navigate('/school-dashboard')}
              >
                <Users className="w-4 h-4 mr-2" />
                View All Students
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="hover:bg-gray-700"
                onClick={() => navigate('/student-records')}
              >
                <ClipboardList className="w-4 h-4 mr-2" />
                Student Records
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          <DropdownMenuSeparator className="bg-gray-700" />

          {/* Analytics & Reports Submenu */}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="hover:bg-gray-700">
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics & Reports
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="bg-gray-800 border-gray-700 text-white">
              <DropdownMenuItem 
                className="hover:bg-gray-700"
                onClick={() => navigate('/school-dashboard')}
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Performance Statistics
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="hover:bg-gray-700"
                onClick={() => navigate('/academic-reports')}
              >
                <GraduationCap className="w-4 h-4 mr-2" />
                Academic Reports
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="hover:bg-gray-700"
                onClick={() => navigate('/attendance-analytics')}
              >
                <Users className="w-4 h-4 mr-2" />
                Attendance Analytics
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="hover:bg-gray-700"
                onClick={() => navigate('/progress-tracking')}
              >
                <ClipboardList className="w-4 h-4 mr-2" />
                Progress Tracking
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          <DropdownMenuSeparator className="bg-gray-700" />

          {/* Class Management */}
          <DropdownMenuItem 
            className="hover:bg-gray-700"
            onClick={() => navigate('/school-dashboard')}
          >
            <School className="w-4 h-4 mr-2" />
            Manage Classes
          </DropdownMenuItem>

          <DropdownMenuSeparator className="bg-gray-700" />

          {/* Communication Submenu */}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="hover:bg-gray-700">
              <MessageSquare className="w-4 h-4 mr-2" />
              Communication
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="bg-gray-800 border-gray-700 text-white">
              <DropdownMenuItem 
                className="hover:bg-gray-700"
                onClick={() => navigate('/school-dashboard')}
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Message Parents
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="hover:bg-gray-700"
                onClick={() => navigate('/teacher-communications')}
              >
                <Users className="w-4 h-4 mr-2" />
                Teacher Communications
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="hover:bg-gray-700"
                onClick={() => navigate('/announcements')}
              >
                <Calendar className="w-4 h-4 mr-2" />
                Announcements
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          <DropdownMenuSeparator className="bg-gray-700" />

          {/* System Settings with Teaching Perspective */}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="hover:bg-gray-700">
              <Settings className="w-4 h-4 mr-2" />
              System Settings
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="bg-gray-800 border-gray-700 text-white">
              <DropdownMenuItem 
                className="hover:bg-gray-700"
                onClick={onShowTeachingSettings}
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Teaching Perspective Settings
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-gray-700">
                <Settings className="w-4 h-4 mr-2" />
                General Settings
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default SchoolManagementDropdown;
