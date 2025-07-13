
import { Button } from "@/components/ui/button";

interface ProfileTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const ProfileTabs = ({ activeTab, onTabChange }: ProfileTabsProps) => {
  const tabs = [
    { id: "profile", label: "Profile" },
    { id: "subscription", label: "Subscription" }
  ];

  return (
    <div className="flex space-x-1 mb-6 bg-gray-800 p-1 rounded-lg">
      {tabs.map((tab) => (
        <Button
          key={tab.id}
          variant={activeTab === tab.id ? "default" : "ghost"}
          onClick={() => onTabChange(tab.id)}
          className={`flex-1 ${
            activeTab === tab.id
              ? "bg-purple-600 text-white hover:bg-purple-700"
              : "text-gray-400 hover:text-white hover:bg-gray-700"
          }`}
        >
          {tab.label}
        </Button>
      ))}
    </div>
  );
};

export default ProfileTabs;
