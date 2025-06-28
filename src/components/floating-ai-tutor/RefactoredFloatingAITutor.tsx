
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
  const { messages, handleUserMessage } = useFloatingTutorMessages();
  const { isSpeaking, stop } = useUnifiedSpeech();
  const { isOpen, setIsOpen, shouldHide } = useFloatingTutorState();

  // Don't show if user is not logged in
  if (!user) {
    console.log('🚫 Hiding floating tutor - no user logged in');
    return null;
  }

  // Hide the floating tutor if it should be hidden
  if (shouldHide) {
    console.log('🚫 Hiding floating tutor to prevent duplicates');
    return null;
  }

  const handleSendMessage = async (inputText: string) => {
    console.log('📨 Nelie received message:', inputText);
    handleUserMessage(inputText);
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
          onClick={() => setIsOpen(true)}
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
          onClose={() => setIsOpen(false)}
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
