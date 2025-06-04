
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Shield, Users, Settings, BarChart3, Database, ChevronDown, Menu, School, UserPlus, MessageSquare, Lock, Activity, Brain } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "@/components/admin/AdminNavbar";
import AdminStatsCards from "@/components/admin/AdminStatsCards";
import AdminOverviewTab from "@/components/admin/AdminOverviewTab";
import SystemManagement from "@/components/admin/SystemManagement";
import AIInsightsDashboard from "@/components/ai-insights/AIInsightsDashboard";
import { AdminStats } from "@/types/admin";
import { useState } from "react";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [showAIInsights, setShowAIInsights] = useState(false);

  const stats: AdminStats = {
    totalSchools: 12,
    totalUsers: 1250,
    totalStudents: 5432,
    systemUptime: 99.8
  };

  const handleShowAIInsights = () => {
    setShowAIInsights(true);
  };

  const handleCloseAIInsights = () => {
    setShowAIInsights(false);
  };

  if (showAIInsights) {
    return <AIInsightsDashboard onClose={handleCloseAIInsights} />;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <AdminNavbar />

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <AdminStatsCards stats={stats} />

        {/* Admin Tools Dropdown Menu - Now Visible with Functions */}
        <div className="flex gap-4 mb-6">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="text-black bg-white border-gray-600 hover:bg-gray-100">
                <Menu className="w-4 h-4 mr-2" />
                Admin Tools & Management
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64 bg-gray-800 border-gray-700">
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="text-white hover:bg-gray-700">
                  <Users className="w-4 h-4 mr-2" />
                  User Management
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent className="bg-gray-800 border-gray-700">
                  <DropdownMenuItem className="text-white hover:bg-gray-700">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Add New User
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-white hover:bg-gray-700">
                    <Shield className="w-4 h-4 mr-2" />
                    Manage Roles
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-white hover:bg-gray-700">
                    <Lock className="w-4 h-4 mr-2" />
                    User Permissions
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              
              <DropdownMenuSeparator className="bg-gray-600" />
              
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="text-white hover:bg-gray-700">
                  <School className="w-4 h-4 mr-2" />
                  School Administration
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent className="bg-gray-800 border-gray-700">
                  <DropdownMenuItem 
                    className="text-white hover:bg-gray-700"
                    onClick={() => navigate('/school-dashboard')}
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    School Analytics
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-white hover:bg-gray-700">
                    <Users className="w-4 h-4 mr-2" />
                    Manage Schools
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-white hover:bg-gray-700">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Communication Hub
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>

              <DropdownMenuSeparator className="bg-gray-600" />

              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="text-white hover:bg-gray-700">
                  <Settings className="w-4 h-4 mr-2" />
                  System Settings
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent className="bg-gray-800 border-gray-700">
                  <DropdownMenuItem className="text-white hover:bg-gray-700">
                    <Database className="w-4 h-4 mr-2" />
                    Database Management
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-white hover:bg-gray-700">
                    <Activity className="w-4 h-4 mr-2" />
                    System Health
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-white hover:bg-gray-700">
                    <Shield className="w-4 h-4 mr-2" />
                    Security Settings
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>

              <DropdownMenuSeparator className="bg-gray-600" />

              <DropdownMenuItem 
                className="text-purple-400 hover:bg-gray-700"
                onClick={handleShowAIInsights}
              >
                <Brain className="w-4 h-4 mr-2" />
                AI Insights Dashboard
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Quick Access AI Insights Button */}
          <Button 
            onClick={handleShowAIInsights}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            <Brain className="w-4 h-4 mr-2" />
            AI Insights
          </Button>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-gray-800">
            <TabsTrigger value="overview" className="data-[state=active]:bg-gray-700">Overview</TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-gray-700">Users</TabsTrigger>
            <TabsTrigger value="schools" className="data-[state=active]:bg-gray-700">Schools</TabsTrigger>
            <TabsTrigger value="system" className="data-[state=active]:bg-gray-700">System</TabsTrigger>
          </TabsList>

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
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
