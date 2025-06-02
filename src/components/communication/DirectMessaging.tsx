
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Users, School } from "lucide-react";
import { Participant } from "@/types/communication";
import UserSelector from "./UserSelector";
import ClassUsersList from "./ClassUsersList";

interface DirectMessagingProps {
  onStartConversation: (users: Participant[]) => void;
}

const DirectMessaging = ({ onStartConversation }: DirectMessagingProps) => {
  const [selectedUsers, setSelectedUsers] = useState<Participant[]>([]);

  const handleStartConversation = () => {
    if (selectedUsers.length > 0) {
      onStartConversation(selectedUsers);
      setSelectedUsers([]);
    }
  };

  const canStartConversation = selectedUsers.length > 0 && selectedUsers.length <= 2;

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-white mb-2">Direct Messages</h3>
        <p className="text-gray-400 text-sm mb-4">
          Send private messages to one or two people.
        </p>
      </div>

      <Tabs defaultValue="search" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 bg-gray-700">
          <TabsTrigger value="search" className="data-[state=active]:bg-gray-600">
            <Users className="w-4 h-4 mr-2" />
            Search Users
          </TabsTrigger>
          <TabsTrigger value="class" className="data-[state=active]:bg-gray-600">
            <School className="w-4 h-4 mr-2" />
            By Class
          </TabsTrigger>
        </TabsList>

        <TabsContent value="search">
          <UserSelector 
            onUserSelect={setSelectedUsers}
            selectedUsers={selectedUsers}
            maxUsers={2}
          />
        </TabsContent>

        <TabsContent value="class">
          <ClassUsersList 
            onUserSelect={setSelectedUsers}
            selectedUsers={selectedUsers}
            maxUsers={2}
          />
        </TabsContent>
      </Tabs>

      <div className="flex justify-between items-center pt-4 border-t border-gray-600">
        <div className="text-sm text-gray-400">
          {selectedUsers.length === 0 && "Select 1-2 users to start a conversation"}
          {selectedUsers.length === 1 && "1 user selected - you can add 1 more"}
          {selectedUsers.length === 2 && "2 users selected (maximum reached)"}
        </div>
        <Button 
          onClick={handleStartConversation}
          disabled={!canStartConversation}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <MessageSquare className="w-4 h-4 mr-2" />
          Start Conversation
        </Button>
      </div>
    </div>
  );
};

export default DirectMessaging;
