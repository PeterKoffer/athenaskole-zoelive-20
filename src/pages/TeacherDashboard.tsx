import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { BookOpen, Users, ClipboardList, MessageSquare, ChevronDown, BarChart3, Settings, GraduationCap, Menu } from "lucide-react";
import TeacherNavbar from "@/components/teacher/TeacherNavbar";
import TeacherStatsCards from "@/components/teacher/TeacherStatsCards";
import TeacherOverviewTab from "@/components/teacher/TeacherOverviewTab";
import ClassroomManagement from "@/components/teacher/ClassroomManagement";
import { TeacherStats } from "@/types/teacher";
const TeacherDashboard = () => {
  const stats: TeacherStats = {
    totalStudents: 28,
    activeClasses: 3,
    completedLessons: 45,
    averageGrade: 8.2
  };
  return <div className="min-h-screen bg-gray-900 text-white">
      <TeacherNavbar />

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <TeacherStatsCards stats={stats} />

        {/* Unified Teacher Tools and Analytics Dropdown Menu */}
        <div className="flex gap-4 mb-6">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="border-gray-600 text-slate-950 bg-slate-50">
                <Menu className="w-4 h-4 mr-2" />
                Teacher Tools & Analytics
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-gray-800 border-gray-700 text-white w-64">
              {/* Student Analytics Submenu */}
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="hover:bg-gray-700">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Student Analytics
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent className="bg-gray-800 border-gray-700 text-white">
                  <DropdownMenuItem className="hover:bg-gray-700">
                    <GraduationCap className="w-4 h-4 mr-2" />
                    Grade Reports
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-gray-700">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Progress Tracking
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-gray-700">
                    <Users className="w-4 h-4 mr-2" />
                    Attendance Reports
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-gray-700">
                    <ClipboardList className="w-4 h-4 mr-2" />
                    Assignment Statistics
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>

              <DropdownMenuSeparator className="bg-gray-700" />

              {/* Teaching Tools Submenu */}
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="hover:bg-gray-700">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Teaching Tools
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent className="bg-gray-800 border-gray-700 text-white">
                  <DropdownMenuItem className="hover:bg-gray-700">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Lesson Planning
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-gray-700">
                    <ClipboardList className="w-4 h-4 mr-2" />
                    Assignment Creation
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-gray-700">
                    <Settings className="w-4 h-4 mr-2" />
                    Class Settings
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>

              <DropdownMenuSeparator className="bg-gray-700" />

              {/* Communication Tools */}
              <DropdownMenuItem className="hover:bg-gray-700">
                <MessageSquare className="w-4 h-4 mr-2" />
                Communication Center
              </DropdownMenuItem>

              <DropdownMenuSeparator className="bg-gray-700" />

              {/* Class Management */}
              <DropdownMenuItem className="hover:bg-gray-700">
                <Users className="w-4 h-4 mr-2" />
                Manage Classes
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-gray-800">
            <TabsTrigger value="overview" className="data-[state=active]:bg-gray-700">Overview</TabsTrigger>
            <TabsTrigger value="classes" className="data-[state=active]:bg-gray-700">Classes</TabsTrigger>
            <TabsTrigger value="students" className="data-[state=active]:bg-gray-700">Students</TabsTrigger>
            <TabsTrigger value="lessons" className="data-[state=active]:bg-gray-700">Lessons</TabsTrigger>
            <TabsTrigger value="communication" className="data-[state=active]:bg-gray-700">Communication</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <TeacherOverviewTab />
          </TabsContent>

          <TabsContent value="classes" className="space-y-6">
            <ClassroomManagement />
          </TabsContent>

          <TabsContent value="students" className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Student Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">Student progress tracking coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="lessons" className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Lesson Planning
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">Lesson planning tools coming soon...</p>
              </CardContent>
            </Card>
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
                <p className="text-gray-400">Communication tools coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>;
};
export default TeacherDashboard;