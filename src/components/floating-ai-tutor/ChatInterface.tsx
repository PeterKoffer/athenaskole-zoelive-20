
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Send, X, Home, Volume2, VolumeX } from "lucide-react";
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
      {/* Header with Nelie */}
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
          <div className="flex items-center space-x-2">
            <Button
              onClick={onMuteToggle}
              variant="outline"
              size="sm"
              className="border-white/20 text-white bg-white/10 hover:bg-white/20"
            >
              {autoReadEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </Button>
            <h3 className="text-white font-semibold">Nelie AI Tutor</h3>
            {isSpeaking && (
              <div className="flex items-center text-green-300">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-1"></div>
                <span className="text-xs">Speaking...</span>
              </div>
            )}
          </div>
          <div className="flex space-x-1">
            <Button
              onClick={onResetToHome}
              variant="outline"
              size="sm"
              className="border-white/20 text-white bg-white/10 hover:bg-white/20 p-1"
            >
              <Home className="w-4 h-4" />
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              size="sm"
              className="border-white/20 text-white bg-white/10 hover:bg-white/20 p-1"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
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

      {/* Chat Messages */}
      <CardContent className="flex-1 p-0 flex flex-col">
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

        {/* Input Area */}
        <div className="border-t border-gray-700 p-4">
          <form onSubmit={handleSubmit} className="flex space-x-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask Nelie anything..."
              className="flex-1 bg-gray-800 border-gray-600 text-white"
            />
            <Button type="submit" size="sm" disabled={!inputMessage.trim()}>
              <Send className="w-4 h-4" />
            </Button>
          </form>
          
          {/* Voice Controls */}
          <div className="flex justify-center space-x-2 mt-2">
            <VoiceControls
              isSpeaking={isSpeaking}
              onStopSpeaking={onStopSpeaking}
              onVoiceInput={handleVoiceInput}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatInterface;
