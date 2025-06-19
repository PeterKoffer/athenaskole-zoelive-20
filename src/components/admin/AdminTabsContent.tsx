
import { TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, UserPlus, Shield, BarChart3, School, Brain } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AdminOverviewTab from "@/components/admin/AdminOverviewTab";
import SystemManagement from "@/components/admin/SystemManagement";

interface AdminTabsContentProps {
  onShowAIInsights: () => void;
}

const AdminTabsContent = ({ onShowAIInsights }: AdminTabsContentProps) => {
  const navigate = useNavigate();

  return (
    <>
      <TabsContent value="overview" className="space-y-6">
        <AdminOverviewTab />
      </TabsContent>

      <TabsContent value="users" className="space-y-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Users className="w-5 h-5 mr-2" />
              User Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-gray-400 mb-4">Advanced user management tools and analytics</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-gray-700 border-gray-600">
                  <CardContent className="p-4 text-center">
                    <UserPlus className="w-8 h-8 mx-auto mb-2 text-green-400" />
                    <h3 className="font-semibold text-white">Add Users</h3>
                    <p className="text-sm text-gray-400">Create new user accounts</p>
                  </CardContent>
                </Card>
                <Card className="bg-gray-700 border-gray-600">
                  <CardContent className="p-4 text-center">
                    <Shield className="w-8 h-8 mx-auto mb-2 text-blue-400" />
                    <h3 className="font-semibold text-white">Role Management</h3>
                    <p className="text-sm text-gray-400">Assign and modify user roles</p>
                  </CardContent>
                </Card>
                <Card className="bg-gray-700 border-gray-600">
                  <CardContent className="p-4 text-center">
                    <BarChart3 className="w-8 h-8 mx-auto mb-2 text-purple-400" />
                    <h3 className="font-semibold text-white">User Analytics</h3>
                    <p className="text-sm text-gray-400">Track user engagement</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="schools" className="space-y-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <School className="w-5 h-5 mr-2" />
              School Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-gray-400 mb-4">Comprehensive school administration tools</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="bg-gray-700 border-gray-600">
                  <CardContent className="p-4">
                    <School className="w-8 h-8 mb-2 text-orange-400" />
                    <h3 className="font-semibold text-white mb-2">School Registration</h3>
                    <p className="text-sm text-gray-400">Register new schools and manage existing ones</p>
                    <Button 
                      className="mt-3 w-full" 
                      variant="outline"
                      onClick={() => navigate('/school-dashboard')}
                    >
                      Manage Schools
                    </Button>
                  </CardContent>
                </Card>
                <Card className="bg-gray-700 border-gray-600">
                  <CardContent className="p-4">
                    <BarChart3 className="w-8 h-8 mb-2 text-green-400" />
                    <h3 className="font-semibold text-white mb-2">Performance Analytics</h3>
                    <p className="text-sm text-gray-400">Track school performance and student outcomes</p>
                    <Button className="mt-3 w-full" variant="outline">
                      View Analytics
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="system" className="space-y-6">
        <SystemManagement />
      </TabsContent>

      <TabsContent value="ai-insights" className="space-y-6">
        <Card className="bg-gradient-to-r from-purple-900 to-blue-900 border-purple-500">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Brain className="w-6 h-6 mr-3 text-purple-300" />
              AI Insights Dashboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-purple-100 mb-4">
                Access comprehensive AI-powered insights about educational trends, student performance, and platform optimization.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="bg-black/20 border-purple-400">
                  <CardContent className="p-4 text-center">
                    <Brain className="w-12 h-12 mx-auto mb-3 text-purple-300" />
                    <h3 className="font-semibold text-white mb-2">AI Analytics</h3>
                    <p className="text-sm text-purple-200 mb-4">
                      Get AI-powered insights on student learning patterns and educational trends
                    </p>
                    <Button 
                      onClick={onShowAIInsights}
                      className="bg-purple-600 hover:bg-purple-700 text-white w-full"
                    >
                      Open AI Dashboard
                    </Button>
                  </CardContent>
                </Card>
                <Card className="bg-black/20 border-purple-400">
                  <CardContent className="p-4 text-center">
                    <BarChart3 className="w-12 h-12 mx-auto mb-3 text-blue-300" />
                    <h3 className="font-semibold text-white mb-2">Smart Recommendations</h3>
                    <p className="text-sm text-purple-200 mb-4">
                      Receive personalized recommendations for platform improvements
                    </p>
                    <Button 
                      onClick={onShowAIInsights}
                      variant="outline" 
                      className="border-purple-400 text-purple-300 hover:bg-purple-600 hover:text-white w-full"
                    >
                      View Recommendations
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </>
  );
};

export default AdminTabsContent;
