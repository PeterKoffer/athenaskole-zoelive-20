
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface ImprovedUserSelectorProps {
  users: User[];
  selectedUsers: User[];
  onUserSelect: (user: User) => void;
  onUserDeselect: (userId: string) => void;
  maxUsers?: number;
}

const ImprovedUserSelector = ({
  users,
  selectedUsers,
  onUserSelect,
  onUserDeselect,
  maxUsers = 2
}: ImprovedUserSelectorProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isUserSelected = (userId: string) => selectedUsers.some(u => u.id === userId);

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Search users by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
        />
      </div>

      {/* Selected Users Display */}
      {selectedUsers.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-300">Selected Users ({selectedUsers.length}/{maxUsers})</h4>
          <div className="flex flex-wrap gap-2">
            {selectedUsers.map((user) => (
              <div 
                key={user.id}
                className="flex items-center space-x-2 bg-blue-600/20 border border-blue-500/30 rounded-lg px-3 py-2"
              >
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-xs font-semibold text-white">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="text-sm">
                  <div className="text-white font-medium">{user.name}</div>
                  <div className="text-blue-300 text-xs">{user.email}</div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onUserDeselect(user.id)}
                  className="h-6 w-6 p-0 text-gray-400 hover:text-white hover:bg-red-500/20"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Available Users List */}
      <div className="space-y-2 max-h-60 overflow-y-auto">
        <h4 className="text-sm font-medium text-gray-300">Available Users</h4>
        {filteredUsers.map((user) => {
          const selected = isUserSelected(user.id);
          const canSelect = selectedUsers.length < maxUsers;
          
          return (
            <div
              key={user.id}
              className={`flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer ${
                selected
                  ? 'bg-blue-600/20 border-blue-500/50 text-white'
                  : canSelect
                  ? 'bg-gray-700/50 border-gray-600 hover:bg-gray-700 hover:border-gray-500 text-gray-300'
                  : 'bg-gray-800/50 border-gray-700 text-gray-500 cursor-not-allowed'
              }`}
              onClick={() => {
                if (selected) {
                  onUserDeselect(user.id);
                } else if (canSelect) {
                  onUserSelect(user);
                }
              }}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  selected ? 'bg-blue-500 text-white' : 'bg-gray-600 text-gray-300'
                }`}>
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className={`font-medium ${selected ? 'text-white' : 'text-gray-200'}`}>
                    {user.name}
                  </div>
                  <div className={`text-xs ${selected ? 'text-blue-200' : 'text-gray-400'}`}>
                    {user.email}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {selected && (
                  <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                )}
                {!canSelect && !selected && (
                  <div className="text-xs text-gray-500">Max reached</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ImprovedUserSelector;
