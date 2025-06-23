import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../ui/card';
import { useUnifiedSpeech } from '@/hooks/useUnifiedSpeech';
import { useDragBehavior } from './hooks/useDragBehavior';
import { useFloatingTutorMessages } from './hooks/useFloatingTutorMessages';
import { useFloatingTutorState } from './hooks/useFloatingTutorState';
import FloatingButton from './components/FloatingButton';
import ChatHeader from './components/ChatHeader';
import ChatMessages from './components/ChatMessages';
import ChatInputArea from './components/ChatInputArea';
import { supabase } from '@/integrations/supabase/client'; // Added Supabase client

const RefactoredFloatingAITutor = () => {
  const [isListening, setIsListening] = useState(false);
  const [isNelieReplying, setIsNelieReplying] = useState(false); // Added loading state
  
  const { isDragging, position, dragRef, handleMouseDown, hasMoved } = useDragBehavior();
  const { messages, addUserMessage, addNelieMessage } = useFloatingTutorMessages();
  const { speakAsNelie, isSpeaking, stop } = useUnifiedSpeech();
  const { isOpen, setIsOpen, shouldHide } = useFloatingTutorState();

  // Hide the floating tutor if it should be hidden (to prevent duplicates)
  if (shouldHide) {
    console.log('🚫 Hiding floating tutor to prevent duplicates');
    return null;
  }

  const handleSendMessage = async (inputText: string) => {
    if (inputText.trim() === '') return;

    addUserMessage(inputText);
    setIsNelieReplying(true);

    const personaInstructions = "Respond as NELIE, an infinitely patient, endlessly creative, and encouraging AI tutor. Your goal is to ignite a passion for learning. Be supportive, curious, and celebrate effort. Frame mistakes as learning opportunities. Encourage 'why' and 'how' questions.";

    // Mock lesson context for now, as per instructions
    const mockLessonContext = {
      subject: "General Knowledge", // Placeholder
      activityTitle: "Chat with NELIE" // Placeholder
    };

    const payload = {
      userInput: inputText,
      chatHistory: messages.slice(-10), // Send last 10 messages for context
      personaInstructions: personaInstructions,
      lessonContext: mockLessonContext
    };

    try {
      const { data, error } = await supabase.functions.invoke('nelie-chat-handler', {
        body: payload // No need to stringify if Supabase client handles it, otherwise JSON.stringify(payload)
      });

      if (error) {
        console.error('Supabase function error:', error);
        addNelieMessage("I'm having a little trouble connecting right now. Please try again in a moment.");
        speakAsNelie("I'm having a little trouble connecting right now. Please try again in a moment.", true, 'floating-tutor-error');
      } else if (data && data.reply) {
        addNelieMessage(data.reply);
        speakAsNelie(data.reply, true, 'floating-tutor-response');
      } else {
        console.warn('Unexpected response structure from Supabase function:', data);
        addNelieMessage("I received a response, but I'm not sure how to read it. Let's try that again.");
        speakAsNelie("I received a response, but I'm not sure how to read it. Let's try that again.", true, 'floating-tutor-communication-error');
      }
    } catch (e: any) {
      console.error('Error invoking Supabase function:', e);
      addNelieMessage("Oops! Something went wrong on my end. Could you try asking that again?");
      speakAsNelie("Oops! Something went wrong on my end. Could you try asking that again?", true, 'floating-tutor-error');
    } finally {
      setIsNelieReplying(false);
    }
  };

  const handleVoiceToggle = () => {
    if (isListening) {
      setIsListening(false);
      // Stop voice recognition
    } else {
      setIsListening(true);
      // Start voice recognition
    }
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
          <ChatInputArea onSendMessage={handleSendMessage} isReplying={isNelieReplying} /> {/* Pass isReplying */}
        </CardContent>
      </Card>
    </div>
  );
};

export default RefactoredFloatingAITutor;
