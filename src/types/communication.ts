
import { UserRole } from "@/types/auth";

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  content: string;
  timestamp: string;
  conversationId: string;
  isRead: boolean;
}

export interface Conversation {
  id: string;
  name: string;
  type: 'direct' | 'group' | 'class' | 'class_teachers' | 'class_parents' | 'class_all' | 'school_all';
  participants: Participant[];
  lastMessage?: Message;
  unreadCount: number;
  createdAt: string;
  classId?: string;
  schoolId: string;
}

export interface Participant {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  isOnline?: boolean;
}

export interface MessageGroup {
  id: string;
  name: string;
  description: string;
  type: 'class' | 'class_teachers' | 'class_parents' | 'class_all' | 'school_all' | 'custom';
  participants: Participant[];
  classId?: string;
  icon: string;
}
