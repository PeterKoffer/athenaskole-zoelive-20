
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";
import SchoolStatsCards from "@/components/school/SchoolStatsCards";
import SchoolOverviewTab from "@/components/school/SchoolOverviewTab";
import ClassManagement from "@/components/school/ClassManagement";
import AnalyticsDashboard from "@/components/school/AnalyticsDashboard";
import StudentRegistration from "@/components/school/StudentRegistration";
import CommunicationCenter from "@/components/communication/CommunicationCenter";

interface SchoolDashboardContentProps {
  stats: {
    totalStudents: number;
    totalTeachers: number;
    averageProgress: number;
    attendanceRate: number;
  };
}

const SchoolDashboardContent = ({ stats }: SchoolDashboardContentProps) => {
  console.log('[SchoolDashboardContent] Rendering with stats:', stats);

  return (
    <>
      <SchoolStatsCards stats={stats} />

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
    </>
  );
};

export default SchoolDashboardContent;
