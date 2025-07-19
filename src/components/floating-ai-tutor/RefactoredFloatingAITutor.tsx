
import React, { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { useUnifiedSpeech } from '@/hooks/useUnifiedSpeech';
import { useDragBehavior } from './hooks/useDragBehavior';
import { useFloatingTutorMessages } from './hooks/useFloatingTutorMessages';
import { useFloatingTutorState } from './hooks/useFloatingTutorState';
import { useAuth } from '@/hooks/useAuth';
import FloatingButton from './components/FloatingButton';
import ChatHeader from './components/ChatHeader';
import ChatMessages from './components/ChatMessages';
import ChatInputArea from './components/ChatInputArea';

const RefactoredFloatingAITutor = () => {
  const { user } = useAuth();
  const [isListening, setIsListening] = useState(false);
  
  const { isDragging, position, dragRef, handleMouseDown, hasMoved } = useDragBehavior();
  const { messages, addUserMessage, addNelieMessage } = useFloatingTutorMessages();
  const { speakAsNelie, isSpeaking, stop } = useUnifiedSpeech();
  const { isOpen, setIsOpen, shouldHide } = useFloatingTutorState();

  // Don't show if user is not logged in
  if (!user) {
    console.log('🚫 Hiding floating tutor - no user logged in');
    return null;
  }

  // Don't hide the floating tutor - always show it for logged in users
  console.log('✅ Showing floating tutor for logged in user');

  const handleSendMessage = async (inputText: string) => {
    addUserMessage(inputText);

    // Simulate Nelie's response
    setTimeout(() => {
      const responses = [
        "That's a great question! Let me help you understand that concept better.",
        "I can see you're working hard on your learning journey. Keep it up!",
        "Let's break this down into smaller, easier steps.",
        "Would you like me to explain this in a different way?",
        "That's exactly the kind of thinking that leads to mastery!"
      ];
      
      const response = responses[Math.floor(Math.random() * responses.length)];
      addNelieMessage(response);
      
      // Speak Nelie's response
      speakAsNelie(response, true, 'floating-tutor-response');
    }, 1000);
  };

  const handleVoiceToggle = () => {
    setIsListening(!isListening);
  };

  const handleSpeechToggle = () => {
    if (isSpeaking) {
      stop();
    }
  };

  if (!isOpen) {
    return (
      <div ref={dragRef}>
        <FloatingButton
          onClick={() => {
            console.log('🎯 Opening floating tutor');
            setIsOpen(true);
          }}
          onMouseDown={handleMouseDown}
          position={position}
          isDragging={isDragging}
          hasMoved={hasMoved}
        />
      </div>
    );
  }

  return (
    <div
      ref={dragRef}
      className="floating-tutor-container"
      style={{
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex: 9999999,
        width: '350px',
        height: '500px'
      }}
    >
      <Card className="w-full h-full bg-gray-900 border-blue-600 shadow-2xl">
        <ChatHeader
          onMouseDown={handleMouseDown}
          onClose={() => {
            console.log('🎯 Closing floating tutor');
            setIsOpen(false);
          }}
          isListening={isListening}
          onVoiceToggle={handleVoiceToggle}
          isSpeaking={isSpeaking}
          onSpeechToggle={handleSpeechToggle}
        />
        
        <CardContent className="p-0 h-full flex flex-col">
          <ChatMessages messages={messages} />
          <ChatInputArea onSendMessage={handleSendMessage} />
        </CardContent>
      </Card>
    </div>
  );
};

export default RefactoredFloatingAITutor;
