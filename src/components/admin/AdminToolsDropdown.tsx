
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Menu, ChevronDown, Users, UserPlus, Shield, Lock, School, BarChart3, MessageSquare, Settings, Database, Activity, Brain } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface AdminToolsDropdownProps {
  onShowAIInsights: () => void;
}

const AdminToolsDropdown = ({ onShowAIInsights }: AdminToolsDropdownProps) => {
  const navigate = useNavigate();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="text-black bg-white border-gray-600 hover:bg-gray-100 hover:text-black">
          <Menu className="w-4 h-4 mr-2 text-black" />
          Admin Tools & Management
          <ChevronDown className="w-4 h-4 ml-2 text-black" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 bg-white border-gray-300 z-50">
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="text-gray-900 hover:bg-gray-100">
            <Users className="w-4 h-4 mr-2" />
            User Management
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="bg-white border-gray-300 z-50">
            <DropdownMenuItem className="text-gray-900 hover:bg-gray-100">
              <UserPlus className="w-4 h-4 mr-2" />
              Add New User
            </DropdownMenuItem>
            <DropdownMenuItem className="text-gray-900 hover:bg-gray-100">
              <Shield className="w-4 h-4 mr-2" />
              Manage Roles
            </DropdownMenuItem>
            <DropdownMenuItem className="text-gray-900 hover:bg-gray-100">
              <Lock className="w-4 h-4 mr-2" />
              User Permissions
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        
        <DropdownMenuSeparator className="bg-gray-300" />
        
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="text-gray-900 hover:bg-gray-100">
            <School className="w-4 h-4 mr-2" />
            School Administration
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="bg-white border-gray-300 z-50">
            <DropdownMenuItem 
              className="text-gray-900 hover:bg-gray-100"
              onClick={() => navigate('/school-dashboard')}
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              School Analytics
            </DropdownMenuItem>
            <DropdownMenuItem className="text-gray-900 hover:bg-gray-100">
              <Users className="w-4 h-4 mr-2" />
              Manage Schools
            </DropdownMenuItem>
            <DropdownMenuItem className="text-gray-900 hover:bg-gray-100">
              <MessageSquare className="w-4 h-4 mr-2" />
              Communication Hub
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSeparator className="bg-gray-300" />

        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="text-gray-900 hover:bg-gray-100">
            <Settings className="w-4 h-4 mr-2" />
            System Settings
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="bg-white border-gray-300 z-50">
            <DropdownMenuItem className="text-gray-900 hover:bg-gray-100">
              <Database className="w-4 h-4 mr-2" />
              Database Management
            </DropdownMenuItem>
            <DropdownMenuItem className="text-gray-900 hover:bg-gray-100">
              <Activity className="w-4 h-4 mr-2" />
              System Health
            </DropdownMenuItem>
            <DropdownMenuItem className="text-gray-900 hover:bg-gray-100">
              <Shield className="w-4 h-4 mr-2" />
              Security Settings
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSeparator className="bg-gray-300" />

        <DropdownMenuItem 
          className="text-purple-600 hover:bg-purple-50"
          onClick={onShowAIInsights}
        >
          <Brain className="w-4 h-4 mr-2" />
          AI Insights Dashboard
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AdminToolsDropdown;
