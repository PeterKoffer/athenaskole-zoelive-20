
export const useMessageHandler = () => {
  const handleSendMessage = async (
    message: string,
    setInputMessage: (msg: string) => void,
    setIsSpeaking: (speaking: boolean) => void
  ) => {
    console.log('📨 Handling message:', message);
    
    // Basic response logic
    const responses = [
      "That's a great question! Let me help you understand that better.",
      "I can see you're working hard on your learning journey. Keep it up!",
      "Let's break this down into smaller, easier steps.",
      "Would you like me to explain this in a different way?",
      "That's exactly the kind of thinking that leads to mastery!"
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  return { handleSendMessage };
};
