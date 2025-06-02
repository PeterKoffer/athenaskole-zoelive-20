
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Users, Mail, Send } from "lucide-react";
import { useCommunication } from "@/hooks/useCommunication";
import { Participant } from "@/types/communication";
import MessageGroupsList from "./MessageGroupsList";
import ConversationsList from "./ConversationsList";
import ChatWindow from "./ChatWindow";
import DirectMessaging from "./DirectMessaging";

const CommunicationCenter = () => {
  const {
    conversations,
    messages,
    activeConversation,
    messageGroups,
    setActiveConversation,
    sendMessage,
    createConversationFromGroup
  } = useCommunication();

  const [selectedTab, setSelectedTab] = useState("direct");

  const handleGroupSelect = (groupId: string) => {
    const group = messageGroups.find(g => g.id === groupId);
    if (group) {
      const conversation = createConversationFromGroup(group);
      setActiveConversation(conversation.id);
      setSelectedTab("chat");
    }
  };

  const handleStartDirectConversation = (users: Participant[]) => {
    // Create a direct conversation
    const conversationName = users.length === 1 
      ? `Chat with ${users[0].name}`
      : `Chat with ${users.map(u => u.name.split(' ')[0]).join(' & ')}`;
    
    const directConversation = {
      id: `direct_${Date.now()}`,
      name: conversationName,
      type: 'direct' as const,
      participants: users,
      unreadCount: 0,
      createdAt: new Date().toISOString(),
      schoolId: 'aarhus_west'
    };

    setActiveConversation(directConversation.id);
    setSelectedTab("chat");
  };

  const activeMessages = messages.filter(msg => msg.conversationId === activeConversation);
  const activeConversationData = conversations.find(c => c.id === activeConversation) ||
    (activeConversation?.startsWith('direct_') ? {
      id: activeConversation,
      name: `Direct Message`,
      type: 'direct' as const,
      participants: [],
      unreadCount: 0,
      createdAt: new Date().toISOString(),
      schoolId: 'aarhus_west'
    } : null);

  return (
    <div className="space-y-6">
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <MessageSquare className="w-5 h-5 mr-2" />
            Communication
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-gray-700">
              <TabsTrigger value="direct" className="data-[state=active]:bg-gray-600">
                <MessageSquare className="w-4 h-4 mr-2" />
                Direct
              </TabsTrigger>
              <TabsTrigger value="groups" className="data-[state=active]:bg-gray-600">
                <Users className="w-4 h-4 mr-2" />
                Groups
              </TabsTrigger>
              <TabsTrigger value="conversations" className="data-[state=active]:bg-gray-600">
                <Mail className="w-4 h-4 mr-2" />
                Conversations
              </TabsTrigger>
              <TabsTrigger value="chat" className="data-[state=active]:bg-gray-600">
                <Send className="w-4 h-4 mr-2" />
                Chat
              </TabsTrigger>
            </TabsList>

            <TabsContent value="direct" className="space-y-4">
              <DirectMessaging onStartConversation={handleStartDirectConversation} />
            </TabsContent>

            <TabsContent value="groups" className="space-y-4">
              <MessageGroupsList 
                groups={messageGroups} 
                onGroupSelect={handleGroupSelect}
              />
            </TabsContent>

            <TabsContent value="conversations" className="space-y-4">
              <ConversationsList 
                conversations={conversations}
                onConversationSelect={setActiveConversation}
              />
            </TabsContent>

            <TabsContent value="chat" className="space-y-4">
              {activeConversationData ? (
                <ChatWindow
                  conversation={activeConversationData}
                  messages={activeMessages}
                  onSendMessage={(content) => sendMessage(content, activeConversation!)}
                />
              ) : (
                <div className="text-center text-gray-400 py-8">
                  Select a group, start a direct conversation, or choose an existing conversation to start chatting
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default CommunicationCenter;
