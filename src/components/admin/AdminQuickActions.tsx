
import { Button } from "@/components/ui/button";
import { Brain, School, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface AdminQuickActionsProps {
  onShowAIInsights: () => void;
}

const AdminQuickActions = ({ onShowAIInsights }: AdminQuickActionsProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex gap-4">
      <Button 
        onClick={onShowAIInsights}
        className="bg-purple-600 hover:bg-purple-700 text-white"
      >
        <Brain className="w-4 h-4 mr-2" />
        AI Insights
      </Button>

      <Button 
        onClick={() => navigate('/school-dashboard')}
        className="bg-blue-600 hover:bg-blue-700 text-white"
      >
        <School className="w-4 h-4 mr-2" />
        School Management
      </Button>

      <Button 
        variant="outline"
        className="text-gray-900 bg-white border-gray-400 hover:bg-gray-50"
      >
        <Users className="w-4 h-4 mr-2 text-gray-900" />
        User Management
      </Button>
    </div>
  );
};

export default AdminQuickActions;
