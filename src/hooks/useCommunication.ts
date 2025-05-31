
import { useState, useEffect } from 'react';
import { Message, Conversation, Participant, MessageGroup } from '@/types/communication';
import { UserRole } from '@/types/auth';

export const useCommunication = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [messageGroups, setMessageGroups] = useState<MessageGroup[]>([]);
  const [loading, setLoading] = useState(false);

  // Mock data for demonstration
  useEffect(() => {
    // Initialize with sample message groups
    const sampleGroups: MessageGroup[] = [
      {
        id: 'class_1a',
        name: '1.A - Elever',
        description: 'Alle elever i klasse 1.A',
        type: 'class',
        classId: '1a',
        icon: 'Users',
        participants: [
          { id: '1', name: 'Emma Nielsen', role: 'student', email: 'emma@example.com' },
          { id: '2', name: 'Lucas Hansen', role: 'student', email: 'lucas@example.com' }
        ]
      },
      {
        id: 'class_1a_teachers',
        name: '1.A - Lærere',
        description: 'Lærere for klasse 1.A',
        type: 'class_teachers',
        classId: '1a',
        icon: 'BookOpen',
        participants: [
          { id: 'teacher1', name: 'Lærer Hansen', role: 'teacher', email: 'hansen@school.dk' }
        ]
      },
      {
        id: 'class_1a_all',
        name: '1.A - Alle',
        description: 'Elever, lærere og forældre for klasse 1.A',
        type: 'class_all',
        classId: '1a',
        icon: 'School',
        participants: [
          { id: '1', name: 'Emma Nielsen', role: 'student', email: 'emma@example.com' },
          { id: '2', name: 'Lucas Hansen', role: 'student', email: 'lucas@example.com' },
          { id: 'teacher1', name: 'Lærer Hansen', role: 'teacher', email: 'hansen@school.dk' },
          { id: 'parent1', name: 'Anna Nielsen', role: 'parent', email: 'anna@example.com' },
          { id: 'parent2', name: 'Peter Hansen', role: 'parent', email: 'peter@example.com' }
        ]
      },
      {
        id: 'school_all',
        name: 'Hele Skolen',
        description: 'Alle brugere på skolen',
        type: 'school_all',
        icon: 'School',
        participants: [
          { id: '1', name: 'Emma Nielsen', role: 'student', email: 'emma@example.com' },
          { id: 'teacher1', name: 'Lærer Hansen', role: 'teacher', email: 'hansen@school.dk' },
          { id: 'admin1', name: 'Skoleleder Nielsen', role: 'school_leader', email: 'leder@school.dk' }
        ]
      }
    ];
    setMessageGroups(sampleGroups);
  }, []);

  const sendMessage = (content: string, conversationId: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: 'current_user',
      senderName: 'Current User',
      senderRole: 'school_leader',
      content,
      timestamp: new Date().toISOString(),
      conversationId,
      isRead: false
    };
    
    setMessages(prev => [...prev, newMessage]);
  };

  const createConversationFromGroup = (group: MessageGroup): Conversation => {
    return {
      id: group.id,
      name: group.name,
      type: group.type,
      participants: group.participants,
      unreadCount: 0,
      createdAt: new Date().toISOString(),
      classId: group.classId,
      schoolId: 'aarhus_west'
    };
  };

  const markAsRead = (conversationId: string) => {
    setMessages(prev => 
      prev.map(msg => 
        msg.conversationId === conversationId ? { ...msg, isRead: true } : msg
      )
    );
  };

  return {
    conversations,
    messages,
    activeConversation,
    messageGroups,
    loading,
    setActiveConversation,
    sendMessage,
    createConversationFromGroup,
    markAsRead
  };
};
