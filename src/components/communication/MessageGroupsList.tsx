
import { useState } from "react";
import { MessageGroup } from "@/types/communication";
import ClassSelector from "./ClassSelector";
import PredefinedGroupsList from "./PredefinedGroupsList";
import { useDynamicGroups } from "./DynamicGroupGenerator";

interface MessageGroupsListProps {
  groups: MessageGroup[];
  onGroupSelect: (groupId: string) => void;
}

const MessageGroupsList = ({ groups, onGroupSelect }: MessageGroupsListProps) => {
  const [selectedGrade, setSelectedGrade] = useState<string>("");
  const [selectedClass, setSelectedClass] = useState<string>("");

  // Generate dynamic groups based on selected grade and class
  const dynamicGroups = useDynamicGroups({
    selectedGrade,
    selectedClass,
    originalGroups: groups
  });

  const handleCreateClassGroup = () => {
    if (selectedGrade && selectedClass) {
      const classId = `${selectedGrade}${selectedClass}`;
      onGroupSelect(`class_${classId}`);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Messages to Groups</h3>
        <p className="text-gray-400 text-sm mb-4">
          Select a predefined group to send messages to multiple people at once.
        </p>
      </div>

      <ClassSelector
        selectedGrade={selectedGrade}
        selectedClass={selectedClass}
        onGradeChange={setSelectedGrade}
        onClassChange={setSelectedClass}
        onCreateClassGroup={handleCreateClassGroup}
      />

      <PredefinedGroupsList 
        groups={dynamicGroups}
        onGroupSelect={onGroupSelect}
      />
    </div>
  );
};

export default MessageGroupsList;
