
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import AdminNavbar from "@/components/admin/AdminNavbar";
import AdminStatsCards from "@/components/admin/AdminStatsCards";
import AdminToolsDropdown from "@/components/admin/AdminToolsDropdown";
import AdminQuickActions from "@/components/admin/AdminQuickActions";
import AdminTabsContent from "@/components/admin/AdminTabsContent";
import AIInsightsDashboard from "@/components/ai-insights/AIInsightsDashboard";
import UserImpersonation from "@/components/admin/UserImpersonation";
import { AdminStats } from "@/types/admin";

const AdminDashboard = () => {
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

        <div className="flex gap-4 mb-6">
          <AdminToolsDropdown onShowAIInsights={handleShowAIInsights} />
          <AdminQuickActions onShowAIInsights={handleShowAIInsights} />
        </div>

        <UserImpersonation />

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-gray-800">
            <TabsTrigger value="overview" className="data-[state=active]:bg-gray-700">Overview</TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-gray-700">Users</TabsTrigger>
            <TabsTrigger value="schools" className="data-[state=active]:bg-gray-700">Schools</TabsTrigger>
            <TabsTrigger value="lesson-coverage" className="data-[state=active]:bg-gray-700">Lesson Coverage</TabsTrigger>
            <TabsTrigger value="system" className="data-[state=active]:bg-gray-700">System</TabsTrigger>
            <TabsTrigger value="ai-insights" className="data-[state=active]:bg-purple-700 data-[state=active]:text-white">AI Insights</TabsTrigger>
          </TabsList>

          <AdminTabsContent onShowAIInsights={handleShowAIInsights} />
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
