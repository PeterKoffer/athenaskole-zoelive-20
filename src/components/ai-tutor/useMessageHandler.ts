
import { useState } from "react";
import { Message, LearningOption } from "./types";
import { predefinedResponses, learningOptionResponses } from "./predefinedResponses";
import { nlpService } from "@/services/NlpService";
import { personality } from "./personality";

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
      const { intent, entities } = nlpService.getIntentAndEntities(message);
      let response;

      switch (intent) {
        case 'help':
          response = personality.responses.help[Math.floor(Math.random() * personality.responses.help.length)];
          break;
        case 'question':
          if (entities.question) {
            response = `That's a great question about ${entities.question}! Let me see if I can find the answer for you.`;
          } else {
            response = "That's a great question! Let me see if I can find the answer for you.";
          }

          break;
        case 'joke':
          response = "Why did the scarecrow win an award? Because he was outstanding in his field!";
          break;
        default:
          const encouragement = personality.responses.encouragement[Math.floor(Math.random() * personality.responses.encouragement.length)];
          const responses = predefinedResponses[currentSubject] || predefinedResponses.math;
          response = `${encouragement} ${responses[Math.floor(Math.random() * responses.length)]}`;
      }
      
      // Replace any full name references with first name
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
      
      if ('speechSynthesis' in window) {
        setIsSpeaking(true);
        const utterance = new SpeechSynthesisUtterance(response);
        utterance.lang = 'en-US';
        utterance.rate = 0.8;
        utterance.pitch = 1.2; // Higher pitch for female voice
        utterance.onend = () => setIsSpeaking(false);
        
        // Try to use a female voice if available
        const voices = speechSynthesis.getVoices();
        const femaleVoice = voices.find(voice => 
          voice.name.toLowerCase().includes('female') ||
          voice.name.toLowerCase().includes('woman') ||
          voice.name.toLowerCase().includes('samantha') ||
          voice.name.toLowerCase().includes('karen') ||
          voice.name.toLowerCase().includes('victoria') ||
          (voice.name.toLowerCase().includes('alex') && voice.lang.includes('en'))
        );
        
        if (femaleVoice) {
          utterance.voice = femaleVoice;
        }
        
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
