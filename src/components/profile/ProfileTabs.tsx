
import { Button } from "@/components/ui/button";
import { User, Badge } from "lucide-react";

interface ProfileTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const ProfileTabs = ({ activeTab, onTabChange }: ProfileTabsProps) => {
  return (
    <div className="flex space-x-1 mb-8 bg-gray-800 p-1 rounded-lg">
      <Button
        variant={activeTab === "profile" ? "default" : "ghost"}
        onClick={() => onTabChange("profile")}
        className={`flex-1 ${activeTab === "profile" ? "bg-gradient-to-r from-purple-400 to-cyan-400 text-white" : "text-gray-300 hover:text-white hover:bg-gray-700"}`}
      >
        <User className="w-4 h-4 mr-2" />
        Profil
      </Button>
      <Button
        variant={activeTab === "subscription" ? "default" : "ghost"}
        onClick={() => onTabChange("subscription")}
        className={`flex-1 ${activeTab === "subscription" ? "bg-gradient-to-r from-purple-400 to-cyan-400 text-white" : "text-gray-300 hover:text-white hover:bg-gray-700"}`}
      >
        <Badge className="w-4 h-4 mr-2" />
        Abonnement
      </Button>
    </div>
  );
};

export default ProfileTabs;
