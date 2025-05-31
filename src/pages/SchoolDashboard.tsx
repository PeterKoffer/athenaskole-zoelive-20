
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare } from "lucide-react";
import ClassManagement from "@/components/school/ClassManagement";
import AnalyticsDashboard from "@/components/school/AnalyticsDashboard";
import StudentRegistration from "@/components/school/StudentRegistration";
import SchoolNavbar from "@/components/school/SchoolNavbar";
import SchoolStatsCards from "@/components/school/SchoolStatsCards";
import SchoolOverviewTab from "@/components/school/SchoolOverviewTab";

const SchoolDashboard = () => {
  const stats = {
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
            <TabsTrigger value="overview" className="data-[state=active]:bg-gray-700">Overblik</TabsTrigger>
            <TabsTrigger value="classes" className="data-[state=active]:bg-gray-700">Klasser</TabsTrigger>
            <TabsTrigger value="students" className="data-[state=active]:bg-gray-700">Elever</TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-gray-700">Statistik</TabsTrigger>
            <TabsTrigger value="registration" className="data-[state=active]:bg-gray-700">Registrering</TabsTrigger>
            <TabsTrigger value="communication" className="data-[state=active]:bg-gray-700">Kommunikation</TabsTrigger>
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
                <CardTitle className="text-white">Elev overblik</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">Detaljeret elev statistik og fremskridt kommer snart...</p>
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
                  Kommunikation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">Kommunikationsplatform med lærere og elever kommer snart...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SchoolDashboard;
