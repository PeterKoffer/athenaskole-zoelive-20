
import { useState } from 'react';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export const useFloatingTutorMessages = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm Nelie, your AI learning companion. How can I help you today?",
      isUser: false,
      timestamp: new Date()
    }
  ]);

  const addMessage = (text: string, isUser: boolean) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      isUser,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const addUserMessage = (text: string) => addMessage(text, true);
  const addNelieMessage = (text: string) => addMessage(text, false);

  return {
    messages,
    addUserMessage,
    addNelieMessage
  };
};
