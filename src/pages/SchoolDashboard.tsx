
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { BookOpen, Users, ClipboardList, MessageSquare, ChevronDown, BarChart3, Settings, UserPlus, School, Menu, GraduationCap, Calendar } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SchoolNavbar from "@/components/school/SchoolNavbar";
import SchoolStatsCards from "@/components/school/SchoolStatsCards";
import SchoolOverviewTab from "@/components/school/SchoolOverviewTab";
import ClassManagement from "@/components/school/ClassManagement";
import AnalyticsDashboard from "@/components/school/AnalyticsDashboard";
import StudentRegistration from "@/components/school/StudentRegistration";
import CommunicationCenter from "@/components/communication/CommunicationCenter";
import TeachingPerspectiveSettingsPanel from "@/components/school/TeachingPerspectiveSettings";
import { useRoleAccess } from "@/hooks/useRoleAccess";
import { useAuth } from "@/hooks/useAuth";

const SchoolDashboard = () => {
  const { userRole } = useRoleAccess();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [showTeachingSettings, setShowTeachingSettings] = useState(false);

  console.log('[SchoolDashboard] Rendering with role:', userRole, 'loading:', loading);

  const stats = {
    totalStudents: 485,
    totalTeachers: 28,
    averageProgress: 87.5,
    attendanceRate: 94.2
  };

  // Show loading state while auth is still loading
  if (loading || userRole === null) {
    console.log('[SchoolDashboard] Showing loading state');
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-white text-lg font-semibold">Loading School Dashboard...</h2>
          <p className="text-gray-400 mt-2">Preparing your educational management system...</p>
        </div>
      </div>
    );
  }

  // Check access permissions - allow school_leader, admin, and school_staff
  const allowedRoles = ['admin', 'school_leader', 'school_staff'];
  const hasAccess = allowedRoles.includes(userRole);
  
  console.log('[SchoolDashboard] Access check - userRole:', userRole, 'hasAccess:', hasAccess);

  if (!hasAccess) {
    console.log('[SchoolDashboard] Access denied for role:', userRole);
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🏫</div>
          <h1 className="text-2xl font-bold mb-4">School Dashboard Access Required</h1>
          <p className="text-gray-400">You need administrator, school leader, or staff privileges to access this dashboard.</p>
          <p className="text-gray-400 mt-2">Current role: {userRole || 'None'}</p>
        </div>
      </div>
    );
  }

  console.log('[SchoolDashboard] Rendering dashboard content');

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <SchoolNavbar />

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-lg mb-6">
          <h1 className="text-3xl font-bold mb-2">Welcome to Your School Dashboard</h1>
          <p className="text-purple-100">
            Manage your educational institution with AI-powered insights and comprehensive tools.
          </p>
          <div className="mt-4 text-sm">
            <span className="bg-white/20 px-3 py-1 rounded-full">
              Logged in as: {userRole} • {user?.email || 'Guest User'}
            </span>
          </div>
        </div>

        <SchoolStatsCards stats={stats} />

        {/* Management Dropdown */}
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
                    onClick={() => setShowTeachingSettings(true)}
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

        {/* Teaching Perspective Settings Modal/Panel */}
        {showTeachingSettings && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-white">Teaching Perspective Settings</h2>
                <Button 
                  variant="ghost" 
                  onClick={() => setShowTeachingSettings(false)}
                  className="text-gray-400 hover:text-white"
                >
                  ×
                </Button>
              </div>
              <TeachingPerspectiveSettingsPanel />
            </div>
          </div>
        )}

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-gray-800">
            <TabsTrigger value="overview" className="data-[state=active]:bg-purple-600">Overview</TabsTrigger>
            <TabsTrigger value="students" className="data-[state=active]:bg-purple-600">Students</TabsTrigger>
            <TabsTrigger value="classes" className="data-[state=active]:bg-purple-600">Classes</TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-purple-600">Analytics</TabsTrigger>
            <TabsTrigger value="registration" className="data-[state=active]:bg-purple-600">Registration</TabsTrigger>
            <TabsTrigger value="communication" className="data-[state=active]:bg-purple-600">Communication</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <SchoolOverviewTab />
          </TabsContent>

          <TabsContent value="students" className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Advanced Student Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 p-4 rounded-lg">
                    <h3 className="font-semibold text-white mb-2">Student Profiles</h3>
                    <p className="text-gray-300 text-sm">Comprehensive student information and progress tracking</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-600/20 to-blue-600/20 p-4 rounded-lg">
                    <h3 className="font-semibold text-white mb-2">Performance Analytics</h3>
                    <p className="text-gray-300 text-sm">AI-powered insights into student learning patterns</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 p-4 rounded-lg">
                    <h3 className="font-semibold text-white mb-2">Intervention Alerts</h3>
                    <p className="text-gray-300 text-sm">Early warning system for students needing support</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="classes" className="space-y-6">
            <ClassManagement />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <AnalyticsDashboard />
          </TabsContent>

          <TabsContent value="registration" className="space-y-6">
            <StudentRegistration />
          </TabsContent>

          <TabsContent value="communication" className="space-y-6">
            <CommunicationCenter />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SchoolDashboard;
