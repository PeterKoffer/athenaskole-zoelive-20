
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Send, X, Volume2, VolumeX } from "lucide-react";
import RobotAvatar from "@/components/ai-tutor/RobotAvatar";
import VoiceControls from "./VoiceControls";
import { Message } from "./types";

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  onClose: () => void;
  onMouseDown: (e: React.MouseEvent) => void;
  onTouchStart: (e: React.TouchEvent) => void;
  onResetToHome: () => void;
  isSpeaking: boolean;
  onStopSpeaking: () => void;
  isDragging?: boolean;
  autoReadEnabled?: boolean;
  onMuteToggle?: () => void;
}

const ChatInterface = ({
  messages,
  onSendMessage,
  onClose,
  onMouseDown,
  onTouchStart,
  onResetToHome,
  isSpeaking,
  onStopSpeaking,
  isDragging,
  autoReadEnabled = true,
  onMuteToggle
}: ChatInterfaceProps) => {
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim()) {
      onSendMessage(inputMessage);
      setInputMessage("");
    }
  };

  const handleVoiceInput = (message: string) => {
    if (message.trim()) {
      onSendMessage(message);
    }
  };

  const handleHeaderMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onMouseDown(e);
  };

  const handleHeaderTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onTouchStart(e);
  };

  return (
    <Card className="w-96 h-[500px] bg-gray-900 border-gray-700 shadow-2xl flex flex-col overflow-hidden">
      {/* Header with dragging functionality */}
      <div 
        className="bg-gradient-to-r from-purple-600 to-blue-600 p-4 cursor-grab active:cursor-grabbing select-none"
        style={{
          cursor: isDragging ? 'grabbing' : 'grab',
          userSelect: 'none',
          touchAction: 'none',
        }}
        onMouseDown={handleHeaderMouseDown}
        onTouchStart={handleHeaderTouchStart}
      >
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-white font-semibold">Nelie AI Tutor</h3>
          <Button
            onClick={onClose}
            variant="outline"
            size="sm"
            className="border-white/20 text-white bg-white/10 hover:bg-white/20 p-1"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
        
        {/* Large Nelie Avatar */}
        <div className="flex justify-center">
          <RobotAvatar 
            size="2xl" 
            isActive={true} 
            isSpeaking={isSpeaking}
          />
        </div>
      </div>

      {/* Chat Messages Area */}
      <div className="flex-1 flex flex-col min-h-0">
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-100'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div ref={messagesEndRef} />
        </ScrollArea>

        {/* Input Area - Now properly contained within the chat box */}
        <div className="border-t border-gray-700 p-4 bg-gray-900">
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="flex space-x-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask Nelie anything..."
                className="flex-1 bg-gray-800 border-gray-600 text-white placeholder-gray-400"
              />
              <Button 
                type="submit" 
                size="sm" 
                disabled={!inputMessage.trim()}
                className="bg-blue-600 hover:bg-blue-700 px-3"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            
            {/* Voice Controls */}
            <div className="flex justify-center">
              <VoiceControls
                isSpeaking={isSpeaking}
                onStopSpeaking={onStopSpeaking}
                onVoiceInput={handleVoiceInput}
              />
            </div>
          </form>
        </div>
      </div>
    </Card>
  );
};

export default ChatInterface;
