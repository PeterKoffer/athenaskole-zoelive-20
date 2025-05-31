
import { useState } from "react";
import { Message, LearningOption } from "./types";
import { predefinedResponses, learningOptionResponses } from "./predefinedResponses";

interface UseMessageHandlerProps {
  user?: any;
  currentSubject: string;
  setIsSpeaking: (speaking: boolean) => void;
}

export const useMessageHandler = ({ user, currentSubject, setIsSpeaking }: UseMessageHandlerProps) => {
  const firstName = user?.user_metadata?.name?.split(' ')[0] || 'Student';
  
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant" as const,
      content: user ? `Hi ${firstName}! This is what we'll work on today. Where would you like to start? 🎓` : "Hi! I'm your AI tutor. What would you like to learn today? 🎓",
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
      const responses = predefinedResponses[currentSubject] || predefinedResponses.math;
      let randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      // Replace any full name references with first name
      if (user?.user_metadata?.name) {
        const fullName = user.user_metadata.name;
        randomResponse = randomResponse.replace(new RegExp(fullName, 'g'), firstName);
      }
      
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
        utterance.lang = 'en-US';
        utterance.rate = 0.8;
        utterance.onend = () => setIsSpeaking(false);
        speechSynthesis.speak(utterance);
      }
    }, 1000);
  };

  const handleLearningOption = (option: LearningOption) => {
    const optionMessage: Message = {
      role: "user" as const,
      content: `I would like to ${option.title.toLowerCase()}`,
      timestamp: new Date(),
      showOptions: false
    };

    setMessages(prev => [...prev, optionMessage]);

    setTimeout(() => {
      let response = learningOptionResponses[option.id] || learningOptionResponses.default;
      
      // Replace any name references with first name
      if (user?.user_metadata?.name) {
        const fullName = user.user_metadata.name;
        response = response.replace(new RegExp(fullName, 'g'), firstName);
      }

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
