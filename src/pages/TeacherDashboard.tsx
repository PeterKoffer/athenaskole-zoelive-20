
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Users, ClipboardList, MessageSquare } from "lucide-react";
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

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <TeacherNavbar />

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <TeacherStatsCards stats={stats} />

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
    </div>
  );
};

export default TeacherDashboard;
