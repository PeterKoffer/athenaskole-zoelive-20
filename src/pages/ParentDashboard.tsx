
import ParentNavbar from "@/components/parent/ParentNavbar";
import ChildSelector from "@/components/parent/ChildSelector";
import ParentDropdownMenus from "@/components/parent/ParentDropdownMenus";
import WeeklyProgressSection from "@/components/parent/WeeklyProgressSection";
import ParentTabsContent from "@/components/parent/ParentTabsContent";

const ParentDashboard = () => {
  const children = [
    {
      id: 1,
      name: "Emma",
      class: "3.A",
      avatar: "👧",
      subjects: {
        mathematics: { progress: 85, recentActivity: "Completed fractions lesson" },
        danish: { progress: 92, recentActivity: "Read H.C. Andersen fairy tale" },
        english: { progress: 78, recentActivity: "Practiced colors and numbers" }
      },
      weeklyGoal: 120,
      weeklyProgress: 95,
      streak: 5
    }
  ];

  const selectedChild = children[0];

  const recentMessages = [
    { from: "Teacher Hansen", subject: "Emma is doing really well", time: "2 hours ago", unread: true },
    { from: "School", subject: "Parent meeting next week", time: "1 day ago", unread: false },
    { from: "Teacher Andersen", subject: "Mathematics progress", time: "3 days ago", unread: false }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <ParentNavbar />

      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <ChildSelector selectedChild={selectedChild} />
        <ParentDropdownMenus />
        <WeeklyProgressSection selectedChild={selectedChild} />
        <ParentTabsContent selectedChild={selectedChild} recentMessages={recentMessages} />
      </div>
    </div>
  );
};

export default ParentDashboard;
