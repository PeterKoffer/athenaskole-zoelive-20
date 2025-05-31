
import ParentNavbar from "@/components/parent/ParentNavbar";
import ChildSelector from "@/components/parent/ChildSelector";
import WeeklyProgressSection from "@/components/parent/WeeklyProgressSection";
import ParentTabsContent from "@/components/parent/ParentTabsContent";
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
import { 
  Menu, 
  ChevronDown, 
  BarChart3, 
  MessageSquare, 
  Calendar, 
  Settings, 
  BookOpen,
  Bell,
  Users,
  FileText,
  Clock
} from "lucide-react";

const ParentDashboard = () => {
  const children = [
    {
      id: 1,
      name: "Emma",
      class: "3.A",
      avatar: "👧",
      subjects: {
        mathematics: { progress: 85, recentActivity: "Completed fractions lesson" },
        danish: { progress: 92, recentActivity: "Read H.C. Andersen fairy tale" },
        english: { progress: 78, recentActivity: "Practiced colors and numbers" }
      },
      weeklyGoal: 120,
      weeklyProgress: 95,
      streak: 5
    }
  ];

  const selectedChild = children[0];

  const recentMessages = [
    { from: "Teacher Hansen", subject: "Emma is doing really well", time: "2 hours ago", unread: true },
    { from: "School", subject: "Parent meeting next week", time: "1 day ago", unread: false },
    { from: "Teacher Andersen", subject: "Mathematics progress", time: "3 days ago", unread: false }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <ParentNavbar />

      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <ChildSelector selectedChild={selectedChild} />
        
        {/* Unified Parent Tools Dropdown Menu */}
        <div className="flex gap-4 mb-6">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="text-white border-gray-600 hover:bg-gray-700">
                <Menu className="w-4 h-4 mr-2" />
                Parent Tools & Reports
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-gray-800 border-gray-700 text-white w-64">
              {/* Progress & Analytics Submenu */}
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="hover:bg-gray-700">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Progress & Analytics
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent className="bg-gray-800 border-gray-700 text-white">
                  <DropdownMenuItem className="hover:bg-gray-700">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Weekly Reports
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-gray-700">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Subject Progress
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-gray-700">
                    <Clock className="w-4 h-4 mr-2" />
                    Study Time Analytics
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-gray-700">
                    <FileText className="w-4 h-4 mr-2" />
                    Grade Reports
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>

              <DropdownMenuSeparator className="bg-gray-700" />

              {/* Communication Submenu */}
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="hover:bg-gray-700">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Communication
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent className="bg-gray-800 border-gray-700 text-white">
                  <DropdownMenuItem className="hover:bg-gray-700">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Message Teachers
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-gray-700">
                    <Users className="w-4 h-4 mr-2" />
                    Parent-Teacher Meetings
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-gray-700">
                    <Bell className="w-4 h-4 mr-2" />
                    Notifications Settings
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>

              <DropdownMenuSeparator className="bg-gray-700" />

              {/* School Calendar & Events */}
              <DropdownMenuItem className="hover:bg-gray-700">
                <Calendar className="w-4 h-4 mr-2" />
                School Calendar
              </DropdownMenuItem>

              <DropdownMenuSeparator className="bg-gray-700" />

              {/* Settings & Support */}
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="hover:bg-gray-700">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings & Support
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent className="bg-gray-800 border-gray-700 text-white">
                  <DropdownMenuItem className="hover:bg-gray-700">
                    <Settings className="w-4 h-4 mr-2" />
                    Account Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-gray-700">
                    <Bell className="w-4 h-4 mr-2" />
                    Notification Preferences
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-gray-700">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Help & Support
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <WeeklyProgressSection selectedChild={selectedChild} />
        <ParentTabsContent selectedChild={selectedChild} recentMessages={recentMessages} />
      </div>
    </div>
  );
};

export default ParentDashboard;
