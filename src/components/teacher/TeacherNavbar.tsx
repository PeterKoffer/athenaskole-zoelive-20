import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
const TeacherNavbar = () => {
  const navigate = useNavigate();
  const {
    signOut
  } = useAuth();
  return <nav className="bg-gray-800 border-b border-gray-700 p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => navigate('/')} className="text-gray-400 hover:text-white hover:bg-gray-700">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center space-x-3">
            <BookOpen className="w-8 h-8 text-purple-500" />
            <div>
              <h1 className="text-xl font-bold">Teacher Dashboard</h1>
              <p className="text-sm text-gray-400">Class Management</p>
            </div>
          </div>
        </div>
        <Button variant="outline" onClick={signOut} className="border-gray-600 text-slate-950 bg-slate-50">
          Log out
        </Button>
      </div>
    </nav>;
};
export default TeacherNavbar;