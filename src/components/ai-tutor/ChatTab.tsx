
import { useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ChatMessage from "./ChatMessage";
import LearningOptions from "./LearningOptions";
import ChatInput from "./ChatInput";
import RobotAvatar from "./RobotAvatar";
import { Message, LearningOption } from "./types";

interface ChatTabProps {
  messages: Message[];
  isSpeaking: boolean;
  onSendMessage: (message: string) => void;
  onStopSpeaking: () => void;
  onLearningOptionSelect: (option: LearningOption) => void;
}

const ChatTab = ({ 
  messages, 
  isSpeaking, 
  onSendMessage, 
  onStopSpeaking, 
  onLearningOptionSelect 
}: ChatTabProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToTop = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = 0;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Scroll to top when component mounts or when there are no messages
  useEffect(() => {
    if (messages.length <= 1) {
      scrollToTop();
    }
  }, [messages.length]);

  return (
    <Card className="h-96 bg-gray-900 border-gray-800">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg text-white text-center flex items-center justify-center space-x-3">
          <RobotAvatar size="md" isActive={isSpeaking} isSpeaking={isSpeaking} />
          <span>Chat with Nelie</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="h-full flex flex-col">
        <div 
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto space-y-4 mb-4"
        >
          {messages.map((message, index) => (
            <ChatMessage key={index} message={message}>
              {message.showOptions && (
                <LearningOptions onOptionSelect={onLearningOptionSelect} />
              )}
            </ChatMessage>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <ChatInput
          onSendMessage={onSendMessage}
          isSpeaking={isSpeaking}
          onStopSpeaking={onStopSpeaking}
        />
      </CardContent>
    </Card>
  );
};

export default ChatTab;
