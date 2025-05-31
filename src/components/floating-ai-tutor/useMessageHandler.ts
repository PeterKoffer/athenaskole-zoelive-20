
import { useState } from "react";
import { Message } from "./types";

export const useMessageHandler = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant" as const,
      content: "Hi! I'm Athena, your AI tutor. Say 'hi Athena' to start, or write your question!",
      timestamp: new Date()
    }
  ]);

  const handleSendMessage = (inputMessage: string, setInputMessage: (message: string) => void, setIsSpeaking: (speaking: boolean) => void) => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      role: "user" as const,
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    
    const isAthenaGreeting = inputMessage.toLowerCase().includes('hi athena') || 
                           inputMessage.toLowerCase().includes('hello athena');
    
    setInputMessage("");

    setTimeout(() => {
      let responseContent = "";
      
      if (isAthenaGreeting) {
        responseContent = "Hi! I'm Athena, and I'm so excited to meet you! 🌟 I'm here to help you learn. What would you like to work on today? Math, English, Science, or maybe something else?";
        
        if ('speechSynthesis' in window) {
          setIsSpeaking(true);
          const utterance = new SpeechSynthesisUtterance(responseContent);
          utterance.lang = 'en-US';
          utterance.rate = 0.8;
          utterance.onend = () => setIsSpeaking(false);
          speechSynthesis.speak(utterance);
        }
      } else {
        responseContent = "That's a good question! As Athena, I can help you with many things. Try saying 'hi Athena' for a more personal greeting!";
      }

      const aiResponse: Message = {
        role: "assistant" as const,
        content: responseContent,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  return {
    messages,
    handleSendMessage
  };
};
