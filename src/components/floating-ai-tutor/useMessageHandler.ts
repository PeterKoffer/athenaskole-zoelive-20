
import { useState } from "react";
import { Message } from "./types";

export const useMessageHandler = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant" as const,
      content: "Hi! I'm Nelie, your AI tutor. Say 'hi Nelie' to start, or write your question!",
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
    
    const isNelieGreeting = inputMessage.toLowerCase().includes('hi nelie') || 
                           inputMessage.toLowerCase().includes('hello nelie');
    
    setInputMessage("");

    setTimeout(() => {
      let responseContent = "";
      
      if (isNelieGreeting) {
        responseContent = "Hi! I'm Nelie, and I'm so excited to meet you! 🌟 I'm here to help you learn. What would you like to work on today? Math, English, Science, or maybe something else?";
        
        if ('speechSynthesis' in window) {
          setIsSpeaking(true);
          const utterance = new SpeechSynthesisUtterance(responseContent);
          utterance.lang = 'en-US';
          utterance.rate = 0.8;
          utterance.onend = () => setIsSpeaking(false);
          speechSynthesis.speak(utterance);
        }
      } else {
        responseContent = "That's a good question! As Nelie, I can help you with many things. Try saying 'hi Nelie' for a more personal greeting!";
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
