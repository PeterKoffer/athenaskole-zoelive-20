
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, BookOpen, School, GraduationCap } from "lucide-react";
import { MessageGroup } from "@/types/communication";

interface GroupCardProps {
  group: MessageGroup;
  onGroupSelect: (groupId: string) => void;
}

const GroupCard = ({ group, onGroupSelect }: GroupCardProps) => {
  const getGroupIcon = (type: string) => {
    switch (type) {
      case 'class':
        return GraduationCap;
      case 'class_teachers':
        return BookOpen;
      case 'class_all':
      case 'school_all':
        return School;
      default:
        return Users;
    }
  };

  const getGroupColor = (type: string) => {
    switch (type) {
      case 'class':
        return 'bg-blue-500';
      case 'class_teachers':
        return 'bg-purple-500';
      case 'class_all':
        return 'bg-orange-500';
      case 'school_all':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const Icon = getGroupIcon(group.type);

  return (
    <Button
      variant="outline"
      onClick={() => onGroupSelect(group.id)}
      className="p-4 h-auto justify-start text-left border-gray-600 hover:bg-gray-700 text-white"
    >
      <div className="flex items-center space-x-3 w-full">
        <div className={`p-2 rounded-full ${getGroupColor(group.type)}`}>
          <Icon className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1">
          <div className="font-medium">{group.name}</div>
          <div className="text-sm text-gray-400">{group.description}</div>
        </div>
        <Badge variant="outline" className="text-gray-300 border-gray-500">
          {group.participants.length} members
        </Badge>
      </div>
    </Button>
  );
};

export default GroupCard;
