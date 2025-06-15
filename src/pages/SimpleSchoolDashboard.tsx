
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Users, BarChart3, ArrowLeft, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSimpleRoleAccess } from "@/hooks/useSimpleRoleAccess";
import TeachingPerspectiveSettingsPanel from "@/components/school/TeachingPerspectiveSettings";

const SimpleSchoolDashboard = () => {
  const { userRole, loading, canAccessSchoolDashboard } = useSimpleRoleAccess();
  const navigate = useNavigate();

  console.log('[SimpleSchoolDashboard] Role:', userRole, 'Loading:', loading);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-white text-lg font-semibold">Loading...</h2>
        </div>
      </div>
    );
  }

  if (!canAccessSchoolDashboard()) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-gray-400">Current role: {userRole || 'None'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header with Back Button */}
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')} 
            className="text-gray-400 hover:text-white hover:bg-gray-700 mr-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>

        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-lg mb-6">
          <h1 className="text-3xl font-bold mb-2">School Dashboard</h1>
          <p className="text-purple-100">Welcome to your simplified school management system.</p>
          <div className="mt-4 text-sm">
            <span className="bg-white/20 px-3 py-1 rounded-full">Role: {userRole}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Students</p>
                  <p className="text-2xl font-bold text-white">485</p>
                </div>
                <Users className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Average Progress</p>
                  <p className="text-2xl font-bold text-white">87.5%</p>
                </div>
                <BarChart3 className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Attendance Rate</p>
                  <p className="text-2xl font-bold text-white">94.2%</p>
                </div>
                <BarChart3 className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-gray-800">
            <TabsTrigger value="overview" className="data-[state=active]:bg-purple-600">Overview</TabsTrigger>
            <TabsTrigger value="students" className="data-[state=active]:bg-purple-600">Students</TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-purple-600">Analytics</TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-purple-600">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">School Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">Welcome to your school dashboard. This is a simplified version that should load properly.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="students">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Student Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">Student management features will be available here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Analytics Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">Analytics and reporting features will be available here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <div className="space-y-6">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Settings className="w-5 h-5 mr-2" />
                    School Settings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 mb-4">Configure your school's teaching preferences and policies.</p>
                </CardContent>
              </Card>
              
              {/* Teaching Perspective Settings */}
              <TeachingPerspectiveSettingsPanel />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SimpleSchoolDashboard;
