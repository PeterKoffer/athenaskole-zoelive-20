
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, BookOpen, School, GraduationCap } from "lucide-react";
import { MessageGroup } from "@/types/communication";

interface MessageGroupsListProps {
  groups: MessageGroup[];
  onGroupSelect: (groupId: string) => void;
}

const MessageGroupsList = ({ groups, onGroupSelect }: MessageGroupsListProps) => {
  const [selectedGrade, setSelectedGrade] = useState<string>("");
  const [selectedClass, setSelectedClass] = useState<string>("");

  // Generate grade options (0-10)
  const gradeOptions = Array.from({ length: 11 }, (_, i) => i.toString());
  
  // Generate class letter options (a-e)
  const classOptions = ['a', 'b', 'c', 'd', 'e'];

  // Generate dynamic groups based on selected grade and class
  const dynamicGroups = useMemo(() => {
    if (!selectedGrade || !selectedClass) {
      return groups; // Return original groups if no selection
    }

    const classId = `${selectedGrade}${selectedClass}`;
    const className = `${selectedGrade}.${selectedClass.toUpperCase()}`;

    return [
      {
        id: `class_${classId}`,
        name: `${className} - Students`,
        description: `All students in class ${className}`,
        type: 'class' as const,
        classId: classId,
        icon: 'GraduationCap',
        participants: [
          { id: '1', name: 'Sample Student 1', role: 'student' as const, email: 'student1@example.com' },
          { id: '2', name: 'Sample Student 2', role: 'student' as const, email: 'student2@example.com' }
        ]
      },
      {
        id: `class_${classId}_teachers`,
        name: `${className} - Teachers`,
        description: `Teachers for class ${className}`,
        type: 'class_teachers' as const,
        classId: classId,
        icon: 'BookOpen',
        participants: [
          { id: 'teacher1', name: `Teacher for ${className}`, role: 'teacher' as const, email: `teacher${classId}@school.dk` }
        ]
      },
      {
        id: `class_${classId}_all`,
        name: `${className} - Everyone`,
        description: `Students, teachers and parents for class ${className}`,
        type: 'class_all' as const,
        classId: classId,
        icon: 'School',
        participants: [
          { id: '1', name: 'Sample Student 1', role: 'student' as const, email: 'student1@example.com' },
          { id: '2', name: 'Sample Student 2', role: 'student' as const, email: 'student2@example.com' },
          { id: 'teacher1', name: `Teacher for ${className}`, role: 'teacher' as const, email: `teacher${classId}@school.dk` },
          { id: 'parent1', name: 'Parent 1', role: 'parent' as const, email: 'parent1@example.com' },
          { id: 'parent2', name: 'Parent 2', role: 'parent' as const, email: 'parent2@example.com' }
        ]
      },
      {
        id: 'school_all',
        name: 'Entire School',
        description: 'All users in the school',
        type: 'school_all' as const,
        icon: 'School',
        participants: [
          { id: '1', name: 'Sample Student', role: 'student' as const, email: 'student@example.com' },
          { id: 'teacher1', name: 'Sample Teacher', role: 'teacher' as const, email: 'teacher@school.dk' },
          { id: 'admin1', name: 'Principal', role: 'school_leader' as const, email: 'principal@school.dk' }
        ]
      }
    ];
  }, [selectedGrade, selectedClass, groups]);

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

      {/* Class Selector */}
      <div className="bg-gray-700 p-4 rounded-lg space-y-4">
        <h4 className="text-white font-medium">Select Specific Class</h4>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm text-gray-300 mb-2 block">Grade (0-10)</label>
            <Select value={selectedGrade} onValueChange={setSelectedGrade}>
              <SelectTrigger className="bg-gray-600 border-gray-500 text-white">
                <SelectValue placeholder="Select grade" />
              </SelectTrigger>
              <SelectContent className="bg-gray-600 border-gray-500">
                {gradeOptions.map((grade) => (
                  <SelectItem key={grade} value={grade} className="text-white hover:bg-gray-500">
                    Grade {grade}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm text-gray-300 mb-2 block">Class (A-E)</label>
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger className="bg-gray-600 border-gray-500 text-white">
                <SelectValue placeholder="Select class" />
              </SelectTrigger>
              <SelectContent className="bg-gray-600 border-gray-500">
                {classOptions.map((cls) => (
                  <SelectItem key={cls} value={cls} className="text-white hover:bg-gray-500">
                    Class {cls.toUpperCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button 
          onClick={handleCreateClassGroup}
          disabled={!selectedGrade || !selectedClass}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          Select Class {selectedGrade && selectedClass ? `${selectedGrade}.${selectedClass.toUpperCase()}` : ''}
        </Button>
      </div>

      {/* Predefined Groups */}
      <div>
        <h4 className="text-white font-medium mb-3">Predefined Groups</h4>
        <div className="grid gap-3">
          {dynamicGroups.map((group) => {
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
                    {group.participants.length} members
                  </Badge>
                </div>
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MessageGroupsList;
