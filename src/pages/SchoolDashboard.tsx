import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { BookOpen, Users, ClipboardList, MessageSquare, ChevronDown, BarChart3, Settings, UserPlus, School, Menu, GraduationCap, Calendar } from "lucide-react";
import SchoolNavbar from "@/components/school/SchoolNavbar";
import SchoolStatsCards from "@/components/school/SchoolStatsCards";
import SchoolOverviewTab from "@/components/school/SchoolOverviewTab";
import ClassManagement from "@/components/school/ClassManagement";
import AnalyticsDashboard from "@/components/school/AnalyticsDashboard";
import StudentRegistration from "@/components/school/StudentRegistration";
const SchoolDashboard = () => {
  const stats = {
    totalStudents: 485,
    totalTeachers: 28,
    averageProgress: 87.5,
    attendanceRate: 94.2
  };
  return <div className="min-h-screen bg-gray-900 text-white">
      <SchoolNavbar />

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <SchoolStatsCards stats={stats} />

        {/* Unified School Management Dropdown Menu */}
        <div className="flex gap-4 mb-6">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="border-gray-600 text-slate-950 bg-slate-50">
                <Menu className="w-4 h-4 mr-2" />
                School Management & Analytics
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
                  <DropdownMenuItem className="hover:bg-gray-700">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Register New Student
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-gray-700">
                    <Users className="w-4 h-4 mr-2" />
                    View All Students
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-gray-700">
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
                  <DropdownMenuItem className="hover:bg-gray-700">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Performance Statistics
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-gray-700">
                    <GraduationCap className="w-4 h-4 mr-2" />
                    Academic Reports
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-gray-700">
                    <Users className="w-4 h-4 mr-2" />
                    Attendance Analytics
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-gray-700">
                    <ClipboardList className="w-4 h-4 mr-2" />
                    Progress Tracking
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>

              <DropdownMenuSeparator className="bg-gray-700" />

              {/* Class Management */}
              <DropdownMenuItem className="hover:bg-gray-700">
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
                  <DropdownMenuItem className="hover:bg-gray-700">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Message Parents
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-gray-700">
                    <Users className="w-4 h-4 mr-2" />
                    Teacher Communications
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-gray-700">
                    <Calendar className="w-4 h-4 mr-2" />
                    Announcements
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>

              <DropdownMenuSeparator className="bg-gray-700" />

              {/* System Settings */}
              <DropdownMenuItem className="hover:bg-gray-700">
                <Settings className="w-4 h-4 mr-2" />
                System Settings
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-gray-800">
            <TabsTrigger value="overview" className="data-[state=active]:bg-gray-700">Overview</TabsTrigger>
            <TabsTrigger value="students" className="data-[state=active]:bg-gray-700">Students</TabsTrigger>
            <TabsTrigger value="classes" className="data-[state=active]:bg-gray-700">Classes</TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-gray-700">Analytics</TabsTrigger>
            <TabsTrigger value="registration" className="data-[state=active]:bg-gray-700">Registration</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <SchoolOverviewTab />
          </TabsContent>

          <TabsContent value="students" className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Student Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">Student management tools coming soon...</p>
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
        </Tabs>
      </div>
    </div>;
};
export default SchoolDashboard;