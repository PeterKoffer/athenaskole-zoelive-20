
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import UserRoleDisplay from "@/components/layout/UserRoleDisplay";
import GlobalCommunicationButton from "@/components/communication/GlobalCommunicationButton";
import DashboardHomeButton from "@/components/layout/DashboardHomeButton";

const TeacherNavbar = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  return (
    <nav className="bg-gray-800 border-b border-gray-700 p-4 overflow-x-hidden">
      <div className="max-w-7xl mx-auto flex justify-between items-center min-w-0">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')} 
            className="text-gray-400 hover:text-white hover:bg-gray-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          {/* Dashboard button */}
          <DashboardHomeButton className="ml-2" />
          <div className="flex items-center space-x-3">
            <BookOpen className="w-8 h-8 text-purple-500" />
            <div>
              <h1 className="text-xl font-bold">Teacher Dashboard</h1>
              <p className="text-sm text-gray-400">Class Management</p>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <GlobalCommunicationButton />
          <UserRoleDisplay role="teacher" />
          <Button 
            variant="outline" 
            onClick={signOut} 
            className="border-gray-600 text-slate-950 bg-slate-50"
          >
            Log out
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default TeacherNavbar;
