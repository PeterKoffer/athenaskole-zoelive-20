
import { MessageGroup } from "@/types/communication";
import GroupCard from "./GroupCard";

interface PredefinedGroupsListProps {
  groups: MessageGroup[];
  onGroupSelect: (groupId: string) => void;
}

const PredefinedGroupsList = ({ groups, onGroupSelect }: PredefinedGroupsListProps) => {
  return (
    <div>
      <h4 className="text-white font-medium mb-3">Predefined Groups</h4>
      <div className="grid gap-3">
        {groups.map((group) => (
          <GroupCard
            key={group.id}
            group={group}
            onGroupSelect={onGroupSelect}
          />
        ))}
      </div>
    </div>
  );
};

export default PredefinedGroupsList;
