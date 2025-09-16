import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { BookOpen, Users, Calendar, Settings, BarChart2 } from "lucide-react";

// This is the main dashboard for authenticated users.
// It provides a comprehensive overview of the application and serves as the main entry point.
const Dashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <WelcomeHeader user={user} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <DashboardCard
            icon={<BookOpen className="w-5 h-5 mr-2 text-blue-400" />}
            title="Daily Program"
            description="Explore your personalized learning content for today"
            onClick={() => navigate("/")}
          />
          <DashboardCard
            icon={<Users className="w-5 h-5 mr-2 text-green-400" />}
            title="Profile"
            description="Manage your profile and learning preferences"
            onClick={() => navigate("/")}
          />
          <DashboardCard
            icon={<Calendar className="w-5 h-5 mr-2 text-purple-400" />}
            title="Preferences"
            description="Customize your learning experience and settings"
            onClick={() => navigate("/preferences")}
          />
          <DashboardCard
            icon={<BarChart2 className="w-5 h-5 mr-2 text-yellow-400" />}
            title="Progress"
            description="Track your learning progress and achievements"
            onClick={() => navigate("/progress")}
          />
          <DashboardCard
            icon={<Settings className="w-5 h-5 mr-2 text-red-400" />}
            title="Settings"
            description="Manage your account and notification settings"
            onClick={() => navigate("/settings")}
          />
        </div>
      </div>
    </div>
  );
};

// A reusable component for the loading spinner.
const LoadingSpinner = () => (
  <div className="min-h-screen bg-gray-900 flex items-center justify-center">
    <div className="text-center text-white">
      <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p>Loading...</p>
    </div>
  </div>
);

// A reusable component for the welcome header.
interface WelcomeHeaderProps { user: any }
const WelcomeHeader = ({ user }: WelcomeHeaderProps) => (
  <div className="mb-8">
    <h1 className="text-4xl font-bold text-white mb-2">
      Welcome back{user?.email ? `, ${user.email.split("@")[0]}` : "!"}
    </h1>
    <p className="text-gray-400">
      Here's a quick overview of your learning journey.
    </p>
  </div>
);

// A reusable component for the dashboard cards.
interface DashboardCardProps { icon: React.ReactNode; title: string; description: string; onClick: () => void }
const DashboardCard = ({ icon, title, description, onClick }: DashboardCardProps) => (
  <Card
    className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors cursor-pointer"
    onClick={onClick}
  >
    <CardHeader className="pb-3">
      <CardTitle className="text-white flex items-center">
        {icon}
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-gray-300 text-sm">{description}</p>
    </CardContent>
  </Card>
);

export default Dashboard;
