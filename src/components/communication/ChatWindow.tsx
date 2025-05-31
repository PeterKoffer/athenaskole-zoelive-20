
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Send, Users } from "lucide-react";
import { Conversation, Message } from "@/types/communication";
import { formatDistanceToNow } from "date-fns";
import { da } from "date-fns/locale";
import UserRoleDisplay from "@/components/layout/UserRoleDisplay";

interface ChatWindowProps {
  conversation: Conversation;
  messages: Message[];
  onSendMessage: (content: string) => void;
}

const ChatWindow = ({ conversation, messages, onSendMessage }: ChatWindowProps) => {
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage.trim());
      setNewMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="space-y-4">
      {/* Chat Header */}
      <div className="border-b border-gray-600 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">{conversation.name}</h3>
            <p className="text-sm text-gray-400">
              {conversation.participants.length} medlemmer
            </p>
          </div>
          <Badge variant="outline" className="text-gray-300 border-gray-500">
            <Users className="w-3 h-3 mr-1" />
            {conversation.participants.length}
          </Badge>
        </div>
      </div>

      {/* Participants List */}
      <div className="bg-gray-700 rounded-lg p-3">
        <p className="text-sm font-medium text-gray-300 mb-2">Deltagere:</p>
        <div className="flex flex-wrap gap-2">
          {conversation.participants.map((participant) => (
            <div key={participant.id} className="flex items-center space-x-1">
              <UserRoleDisplay role={participant.role} className="text-xs" />
              <span className="text-xs text-gray-300">{participant.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="bg-gray-700 rounded-lg p-4 h-64 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="text-center text-gray-400 py-8">
            <p>Ingen beskeder endnu</p>
            <p className="text-sm">Vær den første til at sende en besked!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((message) => (
              <div key={message.id} className="bg-gray-600 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <UserRoleDisplay role={message.senderRole} className="text-xs" />
                    <span className="text-sm font-medium text-white">
                      {message.senderName}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400">
                    {formatDistanceToNow(new Date(message.timestamp), { 
                      addSuffix: true, 
                      locale: da 
                    })}
                  </span>
                </div>
                <p className="text-gray-200 text-sm">{message.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Message Input */}
      <div className="flex space-x-2">
        <Input
          placeholder="Skriv din besked..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
        />
        <Button 
          onClick={handleSendMessage}
          disabled={!newMessage.trim()}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default ChatWindow;
