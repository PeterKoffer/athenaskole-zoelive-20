
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MessageSquare, ChevronDown, BarChart3, Users, UserPlus, Settings } from "lucide-react";
import ClassManagement from "@/components/school/ClassManagement";
import AnalyticsDashboard from "@/components/school/AnalyticsDashboard";
import StudentRegistration from "@/components/school/StudentRegistration";
import SchoolNavbar from "@/components/school/SchoolNavbar";
import SchoolStatsCards from "@/components/school/SchoolStatsCards";
import SchoolOverviewTab from "@/components/school/SchoolOverviewTab";
import { SchoolStats } from "@/types/school";

const SchoolDashboard = () => {
  const stats: SchoolStats = {
    totalStudents: 456,
    totalTeachers: 32,
    averageProgress: 78,
    attendanceRate: 94
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <SchoolNavbar />

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <SchoolStatsCards stats={stats} />

        {/* Statistics and Actions Dropdown Menus */}
        <div className="flex gap-4 mb-6">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="text-white border-gray-600 hover:bg-gray-700">
                <BarChart3 className="w-4 h-4 mr-2" />
                Statistics & Analytics
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-gray-800 border-gray-700 text-white">
              <DropdownMenuItem className="hover:bg-gray-700">
                <BarChart3 className="w-4 h-4 mr-2" />
                Performance Analytics
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-gray-700">
                <Users className="w-4 h-4 mr-2" />
                Student Progress Reports
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-gray-700">
                <BarChart3 className="w-4 h-4 mr-2" />
                Attendance Statistics
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-gray-700">
                <BarChart3 className="w-4 h-4 mr-2" />
                Grade Distribution
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="text-white border-gray-600 hover:bg-gray-700">
                <Settings className="w-4 h-4 mr-2" />
                Management Tools
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-gray-800 border-gray-700 text-white">
              <DropdownMenuItem className="hover:bg-gray-700">
                <Users className="w-4 h-4 mr-2" />
                Class Management
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-gray-700">
                <UserPlus className="w-4 h-4 mr-2" />
                Student Registration
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-gray-700">
                <Settings className="w-4 h-4 mr-2" />
                Teacher Management
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-gray-700">
                <MessageSquare className="w-4 h-4 mr-2" />
                Communication Center
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-gray-800">
            <TabsTrigger value="overview" className="data-[state=active]:bg-gray-700">Overview</TabsTrigger>
            <TabsTrigger value="classes" className="data-[state=active]:bg-gray-700">Classes</TabsTrigger>
            <TabsTrigger value="students" className="data-[state=active]:bg-gray-700">Students</TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-gray-700">Analytics</TabsTrigger>
            <TabsTrigger value="registration" className="data-[state=active]:bg-gray-700">Registration</TabsTrigger>
            <TabsTrigger value="communication" className="data-[state=active]:bg-gray-700">Communication</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <SchoolOverviewTab />
          </TabsContent>

          <TabsContent value="classes" className="space-y-6">
            <ClassManagement />
          </TabsContent>

          <TabsContent value="students" className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Student Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">Detailed student statistics and progress coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <AnalyticsDashboard />
          </TabsContent>

          <TabsContent value="registration" className="space-y-6">
            <StudentRegistration />
          </TabsContent>

          <TabsContent value="communication" className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Communication
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">Communication platform with teachers and students coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SchoolDashboard;
