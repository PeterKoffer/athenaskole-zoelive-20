
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Shield, Users, Building, Settings, BarChart3, ChevronDown, Activity, Database } from "lucide-react";
import AdminNavbar from "@/components/admin/AdminNavbar";
import AdminStatsCards from "@/components/admin/AdminStatsCards";
import AdminOverviewTab from "@/components/admin/AdminOverviewTab";
import SystemManagement from "@/components/admin/SystemManagement";
import { AdminStats } from "@/types/admin";

const AdminDashboard = () => {
  const stats: AdminStats = {
    totalSchools: 25,
    totalUsers: 5420,
    totalStudents: 4356,
    systemUptime: 99.8
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <AdminNavbar />

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <AdminStatsCards stats={stats} />

        {/* System Analytics and Management Dropdown Menus */}
        <div className="flex gap-4 mb-6">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="text-white border-gray-600 hover:bg-gray-700">
                <BarChart3 className="w-4 h-4 mr-2" />
                System Analytics
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-gray-800 border-gray-700 text-white">
              <DropdownMenuItem className="hover:bg-gray-700">
                <Activity className="w-4 h-4 mr-2" />
                System Performance
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-gray-700">
                <Users className="w-4 h-4 mr-2" />
                User Activity Reports
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-gray-700">
                <Building className="w-4 h-4 mr-2" />
                School Performance
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-gray-700">
                <Database className="w-4 h-4 mr-2" />
                Data Usage Statistics
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="text-white border-gray-600 hover:bg-gray-700">
                <Settings className="w-4 h-4 mr-2" />
                Admin Tools
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-gray-800 border-gray-700 text-white">
              <DropdownMenuItem className="hover:bg-gray-700">
                <Building className="w-4 h-4 mr-2" />
                School Management
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-gray-700">
                <Users className="w-4 h-4 mr-2" />
                User Management
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-gray-700">
                <Settings className="w-4 h-4 mr-2" />
                System Configuration
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-gray-700">
                <Shield className="w-4 h-4 mr-2" />
                Security Settings
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-gray-800">
            <TabsTrigger value="overview" className="data-[state=active]:bg-gray-700">Overview</TabsTrigger>
            <TabsTrigger value="schools" className="data-[state=active]:bg-gray-700">Schools</TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-gray-700">Users</TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-gray-700">Analytics</TabsTrigger>
            <TabsTrigger value="system" className="data-[state=active]:bg-gray-700">System</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <AdminOverviewTab />
          </TabsContent>

          <TabsContent value="schools" className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Building className="w-5 h-5 mr-2" />
                  School Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">School management functionality coming soon...</p>
              </CardContent>
            </Card>
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
                <p className="text-gray-400">User management functionality coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  System Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">System analytics coming soon...</p>
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
