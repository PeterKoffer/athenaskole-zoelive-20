
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
import { Shield, Users, Settings, BarChart3, Database, ChevronDown, Menu, School, UserPlus, MessageSquare, Lock, Activity } from "lucide-react";
import AdminNavbar from "@/components/admin/AdminNavbar";
import AdminStatsCards from "@/components/admin/AdminStatsCards";
import AdminOverviewTab from "@/components/admin/AdminOverviewTab";
import SystemManagement from "@/components/admin/SystemManagement";
import { AdminStats } from "@/types/admin";

const AdminDashboard = () => {
  const stats: AdminStats = {
    totalUsers: 1250,
    activeSchools: 12,
    systemUptime: 99.8,
    totalSessions: 5432
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <AdminNavbar />

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <AdminStatsCards stats={stats} />

        {/* Unified Admin Tools Dropdown Menu */}
        <div className="flex gap-4 mb-6">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="text-white border-gray-600 hover:bg-gray-700">
                <Menu className="w-4 h-4 mr-2" />
                Admin Tools & Management
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-gray-800 border-gray-700 text-white w-64">
              {/* User Management Submenu */}
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="hover:bg-gray-700">
                  <Users className="w-4 h-4 mr-2" />
                  User Management
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent className="bg-gray-800 border-gray-700 text-white">
                  <DropdownMenuItem className="hover:bg-gray-700">
                    <Users className="w-4 h-4 mr-2" />
                    View All Users
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-gray-700">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Add New User
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-gray-700">
                    <Lock className="w-4 h-4 mr-2" />
                    User Permissions
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-gray-700">
                    <Activity className="w-4 h-4 mr-2" />
                    User Activity Logs
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>

              <DropdownMenuSeparator className="bg-gray-700" />

              {/* System Management Submenu */}
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="hover:bg-gray-700">
                  <Settings className="w-4 h-4 mr-2" />
                  System Management
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent className="bg-gray-800 border-gray-700 text-white">
                  <DropdownMenuItem className="hover:bg-gray-700">
                    <Settings className="w-4 h-4 mr-2" />
                    System Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-gray-700">
                    <Database className="w-4 h-4 mr-2" />
                    Database Management
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-gray-700">
                    <Shield className="w-4 h-4 mr-2" />
                    Security Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-gray-700">
                    <Activity className="w-4 h-4 mr-2" />
                    System Monitoring
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
                    System Analytics
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-gray-700">
                    <Users className="w-4 h-4 mr-2" />
                    User Statistics
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-gray-700">
                    <School className="w-4 h-4 mr-2" />
                    School Performance
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-gray-700">
                    <Activity className="w-4 h-4 mr-2" />
                    Platform Usage
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>

              <DropdownMenuSeparator className="bg-gray-700" />

              {/* School Management */}
              <DropdownMenuItem className="hover:bg-gray-700">
                <School className="w-4 h-4 mr-2" />
                Manage Schools
              </DropdownMenuItem>

              <DropdownMenuSeparator className="bg-gray-700" />

              {/* Communication Tools */}
              <DropdownMenuItem className="hover:bg-gray-700">
                <MessageSquare className="w-4 h-4 mr-2" />
                Platform Communications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
                <p className="text-gray-400">User management tools coming soon...</p>
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
                <p className="text-gray-400">School management tools coming soon...</p>
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
