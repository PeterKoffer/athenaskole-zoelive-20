
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GraduationCap, BookOpen, Heart } from "lucide-react";
import { Participant } from "@/types/communication";
import UserRoleDisplay from "@/components/layout/UserRoleDisplay";

interface ClassUsersListProps {
  onUserSelect: (users: Participant[]) => void;
  selectedUsers: Participant[];
  maxUsers?: number;
}

const ClassUsersList = ({ onUserSelect, selectedUsers, maxUsers = 2 }: ClassUsersListProps) => {
  const [selectedGrade, setSelectedGrade] = useState<string>("");
  const [selectedClass, setSelectedClass] = useState<string>("");

  // Mock class data with users
  const classes = {
    "0": {
      "a": {
        students: [
          { id: '0a1', name: 'Mikkel Jensen', role: 'student' as const, email: 'mikkel@example.com' },
          { id: '0a2', name: 'Ida Petersen', role: 'student' as const, email: 'ida@example.com' }
        ],
        teachers: [
          { id: '0at1', name: 'Teacher Larsen', role: 'teacher' as const, email: 'larsen@school.dk' }
        ],
        parents: [
          { id: '0ap1', name: 'Mette Jensen', role: 'parent' as const, email: 'mette@example.com' },
          { id: '0ap2', name: 'Lars Petersen', role: 'parent' as const, email: 'lars@example.com' }
        ]
      }
    },
    "1": {
      "a": {
        students: [
          { id: '1', name: 'Emma Nielsen', role: 'student' as const, email: 'emma@example.com' },
          { id: '2', name: 'Lucas Hansen', role: 'student' as const, email: 'lucas@example.com' }
        ],
        teachers: [
          { id: 'teacher1', name: 'Teacher Hansen', role: 'teacher' as const, email: 'hansen@school.dk' }
        ],
        parents: [
          { id: 'parent1', name: 'Anna Nielsen', role: 'parent' as const, email: 'anna@example.com' },
          { id: 'parent2', name: 'Peter Hansen', role: 'parent' as const, email: 'peter@example.com' }
        ]
      },
      "b": {
        students: [
          { id: '3', name: 'Sofia Larsen', role: 'student' as const, email: 'sofia@example.com' }
        ],
        teachers: [
          { id: 'teacher2', name: 'Teacher Andersen', role: 'teacher' as const, email: 'andersen@school.dk' }
        ],
        parents: [
          { id: 'parent3', name: 'Maria Larsen', role: 'parent' as const, email: 'maria@example.com' }
        ]
      }
    }
  };

  const gradeOptions = Object.keys(classes);
  const classOptions = selectedGrade ? Object.keys(classes[selectedGrade as keyof typeof classes] || {}) : [];
  
  const currentClassData = selectedGrade && selectedClass 
    ? classes[selectedGrade as keyof typeof classes]?.[selectedClass as keyof typeof classes[keyof typeof classes]]
    : null;

  const handleUserToggle = (user: Participant) => {
    const isSelected = selectedUsers.some(u => u.id === user.id);
    
    if (isSelected) {
      const newSelection = selectedUsers.filter(u => u.id !== user.id);
      onUserSelect(newSelection);
    } else {
      if (selectedUsers.length < maxUsers) {
        onUserSelect([...selectedUsers, user]);
      }
    }
  };

  const isUserSelected = (user: Participant) => 
    selectedUsers.some(u => u.id === user.id);


  const UserGroup = ({ title, users, icon: Icon }: { title: string, users: Participant[], icon: any }) => (
    <div className="space-y-2">
      <div className="flex items-center space-x-2 text-gray-300">
        <Icon className="w-4 h-4" />
        <h5 className="font-medium">{title}</h5>
        <Badge variant="outline" className="text-xs border-gray-500">
          {users.length}
        </Badge>
      </div>
      <div className="space-y-1">
        {users.map(user => (
          <Button
            key={user.id}
            variant="outline"
            onClick={() => handleUserToggle(user)}
            disabled={!isUserSelected(user) && selectedUsers.length >= maxUsers}
            className={`w-full p-2 h-auto justify-start text-left border-gray-600 hover:bg-gray-700 ${
              isUserSelected(user) 
                ? 'bg-blue-600/20 border-blue-400 text-white' 
                : 'text-gray-300'
            }`}
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center space-x-2">
                <UserRoleDisplay role={user.role} className="text-xs" />
                <span className="text-sm">{user.name}</span>
              </div>
              {isUserSelected(user) && (
                <Badge variant="outline" className="text-green-400 border-green-400 text-xs">
                  ✓
                </Badge>
              )}
            </div>
          </Button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-white font-medium mb-3">Select Users by Class</h4>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm text-gray-300 mb-2 block">Grade</label>
            <Select value={selectedGrade} onValueChange={setSelectedGrade}>
              <SelectTrigger className="bg-gray-600 border-gray-500 text-white">
                <SelectValue placeholder="Grade" />
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
            <label className="text-sm text-gray-300 mb-2 block">Class</label>
            <Select value={selectedClass} onValueChange={setSelectedClass} disabled={!selectedGrade}>
              <SelectTrigger className="bg-gray-600 border-gray-500 text-white">
                <SelectValue placeholder="Class" />
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
      </div>

      {currentClassData && (
        <div className="bg-gray-700 p-4 rounded-lg space-y-4">
          <h5 className="text-white font-medium">
            Class {selectedGrade}.{selectedClass.toUpperCase()} Members
          </h5>
          
          <UserGroup 
            title="Students" 
            users={currentClassData.students} 
            icon={GraduationCap}
          />
          
          <UserGroup 
            title="Teachers" 
            users={currentClassData.teachers} 
            icon={BookOpen}
          />
          
          <UserGroup 
            title="Parents" 
            users={currentClassData.parents} 
            icon={Heart}
          />
        </div>
      )}

      {!selectedGrade && (
        <div className="text-center text-gray-400 py-4">
          Select a grade and class to see the members.
        </div>
      )}
    </div>
  );
};

export default ClassUsersList;
