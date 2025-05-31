
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, BookOpen, School, GraduationCap } from "lucide-react";
import { MessageGroup } from "@/types/communication";

interface MessageGroupsListProps {
  groups: MessageGroup[];
  onGroupSelect: (groupId: string) => void;
}

const MessageGroupsList = ({ groups, onGroupSelect }: MessageGroupsListProps) => {
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

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Beskeder til grupper</h3>
        <p className="text-gray-400 text-sm mb-4">
          Vælg en foruddefineret gruppe for at sende beskeder til flere personer på én gang.
        </p>
      </div>

      <div className="grid gap-3">
        {groups.map((group) => {
          const Icon = getGroupIcon(group.type);
          return (
            <Button
              key={group.id}
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
                  {group.participants.length} medlemmer
                </Badge>
              </div>
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default MessageGroupsList;
