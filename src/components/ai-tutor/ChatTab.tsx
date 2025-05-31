
import { useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ChatMessage from "./ChatMessage";
import LearningOptions from "./LearningOptions";
import ChatInput from "./ChatInput";
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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <Card className="h-96 bg-gray-900 border-gray-800">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg text-white">Chat with your AI tutor</CardTitle>
      </CardHeader>
      <CardContent className="h-full flex flex-col">
        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
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
