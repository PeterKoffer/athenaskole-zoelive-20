
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Users } from "lucide-react";
import { Conversation } from "@/types/communication";
import { formatDistanceToNow } from "date-fns";
import { da } from "date-fns/locale";

interface ConversationsListProps {
  conversations: Conversation[];
  onConversationSelect: (conversationId: string) => void;
}

const ConversationsList = ({ conversations, onConversationSelect }: ConversationsListProps) => {
  if (conversations.length === 0) {
    return (
      <div className="text-center text-gray-400 py-8">
        <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>Ingen aktive samtaler endnu</p>
        <p className="text-sm">Start en samtale ved at vælge en gruppe</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Aktive samtaler</h3>
      </div>

      <div className="space-y-2">
        {conversations.map((conversation) => (
          <Button
            key={conversation.id}
            variant="outline"
            onClick={() => onConversationSelect(conversation.id)}
            className="p-4 h-auto justify-start text-left border-gray-600 hover:bg-gray-700 text-white w-full"
          >
            <div className="flex items-center space-x-3 w-full">
              <div className="p-2 bg-blue-500 rounded-full">
                <Users className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{conversation.name}</div>
                {conversation.lastMessage && (
                  <div className="text-sm text-gray-400 truncate">
                    {conversation.lastMessage.content}
                  </div>
                )}
                <div className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(conversation.createdAt), { 
                    addSuffix: true, 
                    locale: da 
                  })}
                </div>
              </div>
              <div className="flex flex-col items-end space-y-1">
                <Badge variant="outline" className="text-gray-300 border-gray-500 text-xs">
                  {conversation.participants.length}
                </Badge>
                {conversation.unreadCount > 0 && (
                  <Badge className="bg-red-500 text-white text-xs">
                    {conversation.unreadCount}
                  </Badge>
                )}
              </div>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default ConversationsList;
