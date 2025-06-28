
import { useState, useCallback } from 'react';
import { Message } from '../types';
import { useUnifiedSpeech } from '@/hooks/useUnifiedSpeech';
import { useAuth } from '@/hooks/useAuth';

export const useFloatingTutorMessages = () => {
  const { user } = useAuth();
  const { speakAsNelie } = useUnifiedSpeech();
  const userName = user?.user_metadata?.name?.split(' ')[0] || 'Student';
  
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Hi ${userName}! I'm Nelie, your AI learning companion! 🤖 I'm here to help you with your studies. What would you like to learn about today?`,
      timestamp: new Date()
    }
  ]);

  const addUserMessage = useCallback((content: string) => {
    const newMessage: Message = {
      role: 'user',
      content,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  }, []);

  const addNelieMessage = useCallback((content: string) => {
    const newMessage: Message = {
      role: 'assistant',
      content,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
    
    // Nelie speaks her response
    setTimeout(() => {
      speakAsNelie(content, true, 'floating-tutor-response');
    }, 500);
  }, [speakAsNelie]);

  const generateNelieResponse = useCallback((userMessage: string) => {
    // Enhanced AI tutor responses based on user input
    const responses = {
      math: [
        "Great math question! Let me break this down step by step for you.",
        "Mathematics is one of my favorite subjects! Here's how we can approach this...",
        "I love helping with math problems! Let's solve this together.",
        "Math can be tricky, but I'm here to make it easier for you!"
      ],
      science: [
        "Science is so fascinating! Let me explain this concept clearly.",
        "I love exploring scientific concepts with you! Here's what you need to know...",
        "Science questions are exciting! Let's dive into this topic together.",
        "Great scientific thinking! Here's how we can understand this better..."
      ],
      reading: [
        "Reading comprehension is so important! Let me help you understand this better.",
        "I love discussing literature and reading! Here's my take on this...",
        "Reading skills are crucial for learning! Let's work on this together.",
        "Books and stories are amazing! Let me help you with this reading question."
      ],
      general: [
        "That's a wonderful question! I'm excited to help you learn about this.",
        "Learning is such an adventure! Let me guide you through this topic.",
        "I love helping students discover new things! Here's what I can share...",
        "Great curiosity! That's the key to learning. Let me explain this for you.",
        "You're asking all the right questions! Here's how I can help...",
        "I'm so proud of you for seeking to understand! Let's explore this together."
      ]
    };

    // Determine response category based on user message
    const message = userMessage.toLowerCase();
    let responseCategory = 'general';
    
    if (message.includes('math') || message.includes('number') || message.includes('calculate') || message.includes('solve')) {
      responseCategory = 'math';
    } else if (message.includes('science') || message.includes('experiment') || message.includes('biology') || message.includes('chemistry') || message.includes('physics')) {
      responseCategory = 'science';
    } else if (message.includes('read') || message.includes('book') || message.includes('story') || message.includes('write')) {
      responseCategory = 'reading';
    }

    const categoryResponses = responses[responseCategory as keyof typeof responses];
    const randomResponse = categoryResponses[Math.floor(Math.random() * categoryResponses.length)];
    
    return randomResponse;
  }, []);

  const handleUserMessage = useCallback((content: string) => {
    addUserMessage(content);
    
    // Generate and add Nelie's response
    setTimeout(() => {
      const response = generateNelieResponse(content);
      addNelieMessage(response);
    }, 1000);
  }, [addUserMessage, addNelieMessage, generateNelieResponse]);

  return {
    messages,
    addUserMessage,
    addNelieMessage,
    handleUserMessage
  };
};
