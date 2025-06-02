
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, User, Users } from "lucide-react";
import { Participant } from "@/types/communication";
import UserRoleDisplay from "@/components/layout/UserRoleDisplay";

interface UserSelectorProps {
  onUserSelect: (users: Participant[]) => void;
  selectedUsers: Participant[];
  maxUsers?: number;
}

const UserSelector = ({ onUserSelect, selectedUsers, maxUsers = 2 }: UserSelectorProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Mock users data - in a real app this would come from your database
  const allUsers: Participant[] = [
    { id: '1', name: 'Emma Nielsen', role: 'student', email: 'emma@example.com' },
    { id: '2', name: 'Lucas Hansen', role: 'student', email: 'lucas@example.com' },
    { id: '3', name: 'Sofia Larsen', role: 'student', email: 'sofia@example.com' },
    { id: 'teacher1', name: 'Teacher Hansen', role: 'teacher', email: 'hansen@school.dk' },
    { id: 'teacher2', name: 'Teacher Andersen', role: 'teacher', email: 'andersen@school.dk' },
    { id: 'parent1', name: 'Anna Nielsen', role: 'parent', email: 'anna@example.com' },
    { id: 'parent2', name: 'Peter Hansen', role: 'parent', email: 'peter@example.com' },
    { id: 'admin1', name: 'Principal Nielsen', role: 'school_leader', email: 'principal@school.dk' },
  ];

  const filteredUsers = allUsers.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUserToggle = (user: Participant) => {
    const isSelected = selectedUsers.some(u => u.id === user.id);
    
    if (isSelected) {
      // Remove user
      const newSelection = selectedUsers.filter(u => u.id !== user.id);
      onUserSelect(newSelection);
    } else {
      // Add user (if under limit)
      if (selectedUsers.length < maxUsers) {
        onUserSelect([...selectedUsers, user]);
      }
    }
  };

  const isUserSelected = (user: Participant) => 
    selectedUsers.some(u => u.id === user.id);

  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-white font-medium mb-3">Select Users (max {maxUsers})</h4>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-gray-600 border-gray-500 text-white placeholder-gray-400 pl-10"
          />
        </div>
      </div>

      {selectedUsers.length > 0 && (
        <div className="bg-gray-700 p-3 rounded-lg">
          <p className="text-sm text-gray-300 mb-2">Selected users:</p>
          <div className="flex flex-wrap gap-2">
            {selectedUsers.map(user => (
              <Badge 
                key={user.id} 
                variant="outline" 
                className="text-white border-blue-400 bg-blue-600/20"
              >
                <UserRoleDisplay role={user.role} className="text-xs mr-1" />
                {user.name}
              </Badge>
            ))}
          </div>
        </div>
      )}

      <div className="max-h-64 overflow-y-auto space-y-2">
        {filteredUsers.map(user => (
          <Button
            key={user.id}
            variant="outline"
            onClick={() => handleUserToggle(user)}
            disabled={!isUserSelected(user) && selectedUsers.length >= maxUsers}
            className={`w-full p-3 h-auto justify-start text-left border-gray-600 hover:bg-gray-700 ${
              isUserSelected(user) 
                ? 'bg-blue-600/20 border-blue-400 text-white' 
                : 'text-gray-300'
            }`}
          >
            <div className="flex items-center space-x-3 w-full">
              <div className="p-1 rounded-full bg-gray-600">
                <User className="w-4 h-4 text-gray-300" />
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="font-medium">{user.name}</span>
                  <UserRoleDisplay role={user.role} className="text-xs" />
                </div>
                <div className="text-sm text-gray-400">{user.email}</div>
              </div>
              {isUserSelected(user) && (
                <Badge variant="outline" className="text-green-400 border-green-400">
                  Selected
                </Badge>
              )}
            </div>
          </Button>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center text-gray-400 py-4">
          No users found matching your search.
        </div>
      )}
    </div>
  );
};

export default UserSelector;
