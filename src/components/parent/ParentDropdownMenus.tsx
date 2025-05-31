
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BarChart3, Settings, ChevronDown, TrendingUp, Award, Calendar, MessageSquare } from "lucide-react";

const ParentDropdownMenus = () => {
  return (
    <div className="flex gap-4 mb-6">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="text-white border-gray-600 hover:bg-gray-700">
            <BarChart3 className="w-4 h-4 mr-2" />
            Progress Analytics
            <ChevronDown className="w-4 h-4 ml-2" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-gray-800 border-gray-700 text-white">
          <DropdownMenuItem className="hover:bg-gray-700">
            <TrendingUp className="w-4 h-4 mr-2" />
            Weekly Progress
          </DropdownMenuItem>
          <DropdownMenuItem className="hover:bg-gray-700">
            <BarChart3 className="w-4 h-4 mr-2" />
            Subject Performance
          </DropdownMenuItem>
          <DropdownMenuItem className="hover:bg-gray-700">
            <Award className="w-4 h-4 mr-2" />
            Achievements
          </DropdownMenuItem>
          <DropdownMenuItem className="hover:bg-gray-700">
            <Calendar className="w-4 h-4 mr-2" />
            Activity Timeline
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="text-white border-gray-600 hover:bg-gray-700">
            <Settings className="w-4 h-4 mr-2" />
            Parent Tools
            <ChevronDown className="w-4 h-4 ml-2" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-gray-800 border-gray-700 text-white">
          <DropdownMenuItem className="hover:bg-gray-700">
            <MessageSquare className="w-4 h-4 mr-2" />
            Contact Teachers
          </DropdownMenuItem>
          <DropdownMenuItem className="hover:bg-gray-700">
            <Calendar className="w-4 h-4 mr-2" />
            Schedule Meetings
          </DropdownMenuItem>
          <DropdownMenuItem className="hover:bg-gray-700">
            <Settings className="w-4 h-4 mr-2" />
            Account Settings
          </DropdownMenuItem>
          <DropdownMenuItem className="hover:bg-gray-700">
            <TrendingUp className="w-4 h-4 mr-2" />
            Set Learning Goals
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ParentDropdownMenus;
