
import { useState } from "react";
import { Message, LearningOption } from "./types";
import { predefinedResponses, learningOptionResponses } from "./predefinedResponses";

interface UseMessageHandlerProps {
  user?: any;
  currentSubject: string;
  setIsSpeaking: (speaking: boolean) => void;
}

export const useMessageHandler = ({ user, currentSubject, setIsSpeaking }: UseMessageHandlerProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant" as const,
      content: user ? `Hej ${user.user_metadata?.name || 'Elev'}! Dette er hvad vi vil arbejde på i dag. Hvor vil du gerne begynde? 🇩🇰` : "Hej! Jeg er din AI-lærer. Hvad vil du gerne lære i dag? 🇩🇰",
      timestamp: new Date(),
      showOptions: user ? true : false
    }
  ]);

  const handleSendMessage = (message: string) => {
    const userMessage: Message = {
      role: "user" as const,
      content: message,
      timestamp: new Date(),
      showOptions: false
    };

    setMessages(prev => [...prev, userMessage]);

    setTimeout(() => {
      const responses = predefinedResponses[currentSubject] || predefinedResponses.matematik;
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const aiResponse: Message = {
        role: "assistant" as const,
        content: randomResponse,
        timestamp: new Date(),
        showOptions: false
      };
      
      setMessages(prev => [...prev, aiResponse]);
      
      if ('speechSynthesis' in window) {
        setIsSpeaking(true);
        const utterance = new SpeechSynthesisUtterance(randomResponse);
        utterance.lang = 'da-DK';
        utterance.rate = 0.8;
        utterance.onend = () => setIsSpeaking(false);
        speechSynthesis.speak(utterance);
      }
    }, 1000);
  };

  const handleLearningOption = (option: LearningOption) => {
    const optionMessage: Message = {
      role: "user" as const,
      content: `Jeg vil gerne ${option.title.toLowerCase()}`,
      timestamp: new Date(),
      showOptions: false
    };

    setMessages(prev => [...prev, optionMessage]);

    setTimeout(() => {
      const response = learningOptionResponses[option.id] || learningOptionResponses.default;

      const aiResponse: Message = {
        role: "assistant" as const,
        content: response,
        timestamp: new Date(),
        showOptions: false
      };
      
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  return {
    messages,
    handleSendMessage,
    handleLearningOption
  };
};
