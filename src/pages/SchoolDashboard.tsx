
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare } from "lucide-react";
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
