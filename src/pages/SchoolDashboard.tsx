
import { useState } from "react";
import SchoolNavbar from "@/components/school/SchoolNavbar";
import SchoolDashboardAccessControl from "@/components/school/SchoolDashboardAccessControl";
import SchoolWelcomeBanner from "@/components/school/SchoolWelcomeBanner";
import SchoolManagementDropdown from "@/components/school/SchoolManagementDropdown";
import TeachingSettingsModal from "@/components/school/TeachingSettingsModal";
import SchoolDashboardContent from "@/components/school/SchoolDashboardContent";

const SchoolDashboard = () => {
  const [showTeachingSettings, setShowTeachingSettings] = useState(false);

  const stats = {
    totalStudents: 485,
    totalTeachers: 28,
    averageProgress: 87.5,
    attendanceRate: 94.2
  };

  console.log('[SchoolDashboard] Rendering with stats:', stats);

  return (
    <SchoolDashboardAccessControl>
      <div className="min-h-screen bg-gray-900 text-white">
        <SchoolNavbar />

        <div className="max-w-7xl mx-auto p-6 space-y-6">
          <SchoolWelcomeBanner />
          
          <SchoolManagementDropdown 
            onShowTeachingSettings={() => setShowTeachingSettings(true)}
          />

          <TeachingSettingsModal 
            isOpen={showTeachingSettings}
            onClose={() => setShowTeachingSettings(false)}
          />

          <SchoolDashboardContent stats={stats} />
        </div>
      </div>
    </SchoolDashboardAccessControl>
  );
};

export default SchoolDashboard;
