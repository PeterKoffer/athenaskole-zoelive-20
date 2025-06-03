
import { useState, useRef } from "react";
import { Message } from "./types";
import { RealtimeChat } from "@/utils/RealtimeAudio";

export const useMessageHandler = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant" as const,
      content: "Hi! I'm Nelie, your AI tutor. Click the microphone to start voice chat, or type your question!",
      timestamp: new Date()
    }
  ]);

  const realtimeChatRef = useRef<RealtimeChat | null>(null);

  const handleSendMessage = async (inputMessage: string, setInputMessage: (message: string) => void, setIsSpeaking: (speaking: boolean) => void) => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      role: "user" as const,
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");

    // If realtime chat is available, use it
    if (realtimeChatRef.current) {
      try {
        await realtimeChatRef.current.sendMessage(inputMessage);
        return;
      } catch (error) {
        console.error('Failed to send via realtime chat:', error);
      }
    }

    // Fallback to simulated response
    const isNelieGreeting = inputMessage.toLowerCase().includes('hi nelie') || 
                           inputMessage.toLowerCase().includes('hello nelie');
    
    setTimeout(() => {
      let responseContent = "";
      
      if (isNelieGreeting) {
        responseContent = "Hi! I'm Nelie, and I'm so excited to meet you! 🌟 I'm here to help you learn. What would you like to work on today? Math, English, Science, or maybe something else?";
        
        if ('speechSynthesis' in window) {
          setIsSpeaking(true);
          const utterance = new SpeechSynthesisUtterance(responseContent);
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
            voice.name.toLowerCase().includes('alex') && voice.lang.includes('en')
          );
          
          if (femaleVoice) {
            utterance.voice = femaleVoice;
          }
          
          speechSynthesis.speak(utterance);
        }
      } else {
        responseContent = "That's a good question! I'd love to help you with that. For the best experience, try clicking the microphone button to start voice chat with me!";
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
    handleSendMessage,
    realtimeChatRef
  };
};
