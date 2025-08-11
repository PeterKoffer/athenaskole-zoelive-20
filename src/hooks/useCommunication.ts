import { useState, useEffect } from 'react';
import { Message, Conversation, MessageGroup } from '@/types/communication';

export const useCommunication = () => {
  const [conversations, _setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [messageGroups, setMessageGroups] = useState<MessageGroup[]>([]);
  const [loading, _setLoading] = useState(false);

  // Mock data for demonstration
  useEffect(() => {
    // Initialize with sample message groups in English
    const sampleGroups: MessageGroup[] = [
      {
        id: 'class_1a',
        name: '1.A - Students',
        description: 'All students in class 1.A',
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
        name: '1.A - Teachers',
        description: 'Teachers for class 1.A',
        type: 'class_teachers',
        classId: '1a',
        icon: 'BookOpen',
        participants: [
          { id: 'teacher1', name: 'Teacher Hansen', role: 'teacher', email: 'hansen@school.dk' }
        ]
      },
      {
        id: 'class_1a_all',
        name: '1.A - Everyone',
        description: 'Students, teachers and parents for class 1.A',
        type: 'class_all',
        classId: '1a',
        icon: 'School',
        participants: [
          { id: '1', name: 'Emma Nielsen', role: 'student', email: 'emma@example.com' },
          { id: '2', name: 'Lucas Hansen', role: 'student', email: 'lucas@example.com' },
          { id: 'teacher1', name: 'Teacher Hansen', role: 'teacher', email: 'hansen@school.dk' },
          { id: 'parent1', name: 'Anna Nielsen', role: 'parent', email: 'anna@example.com' },
          { id: 'parent2', name: 'Peter Hansen', role: 'parent', email: 'peter@example.com' }
        ]
      },
      {
        id: 'school_all',
        name: 'Entire School',
        description: 'All users in the school',
        type: 'school_all',
        icon: 'School',
        participants: [
          { id: '1', name: 'Emma Nielsen', role: 'student', email: 'emma@example.com' },
          { id: 'teacher1', name: 'Teacher Hansen', role: 'teacher', email: 'hansen@school.dk' },
          { id: 'admin1', name: 'Principal Nielsen', role: 'school_leader', email: 'principal@school.dk' }
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
