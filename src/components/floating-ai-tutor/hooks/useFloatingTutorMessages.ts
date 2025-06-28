
import { useState } from 'react';
import { Message } from '../types';

export const useFloatingTutorMessages = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hi! I'm Nelie, your AI learning companion. How can I help you today?",
      timestamp: new Date()
    }
  ]);

  const addUserMessage = (content: string) => {
    const newMessage: Message = {
      role: 'user',
      content,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const addNelieMessage = (content: string) => {
    const newMessage: Message = {
      role: 'assistant', 
      content,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  return {
    messages,
    addUserMessage,
    addNelieMessage,
    setMessages
  };
};
