
import { useState } from "react";
import { Message } from "./types";

export const useMessageHandler = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant" as const,
      content: "Hej! Jeg er Nelie, din flydende AI-lærer. Sig 'hi Nelie' for at starte, eller skriv dit spørgsmål!",
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
                           inputMessage.toLowerCase().includes('hej nelie');
    
    setInputMessage("");

    setTimeout(() => {
      let responseContent = "";
      
      if (isNelieGreeting) {
        responseContent = "Hej! Jeg er Nelie, og jeg er så glad for at møde dig! 🌟 Jeg er her for at hjælpe dig med at lære. Hvad vil du gerne arbejde med i dag? Matematik, dansk, engelsk eller måske noget helt andet?";
        
        if ('speechSynthesis' in window) {
          setIsSpeaking(true);
          const utterance = new SpeechSynthesisUtterance(responseContent);
          utterance.lang = 'da-DK';
          utterance.rate = 0.8;
          utterance.onend = () => setIsSpeaking(false);
          speechSynthesis.speak(utterance);
        }
      } else {
        responseContent = "Det er et godt spørgsmål! Som Nelie kan jeg hjælpe dig med mange ting. Prøv at sige 'hi Nelie' for en mere personlig hilsen!";
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
