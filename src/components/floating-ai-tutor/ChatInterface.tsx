import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, X, Home } from "lucide-react";
import { Message } from "./types";
import VoiceControls from "./VoiceControls";

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
  isDragging 
}: ChatInterfaceProps) => {
  const [inputMessage, setInputMessage] = useState("");
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    onSendMessage(inputMessage);
    setInputMessage("");
  };

  const handleVoiceInput = (message: string) => {
    setInputMessage(message);
  };

  const handleLogoClick = () => {
    onResetToHome();
  };

  // Scroll to top when component mounts
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = 0;
    }
  }, []);

  return (
    <Card className={`w-80 bg-gray-900 border-gray-800 shadow-2xl transition-all duration-200 ${
      isDragging ? 'shadow-3xl scale-105' : ''
    }`}>
      <CardHeader 
        className={`pb-3 select-none ${
          isDragging ? 'cursor-grabbing bg-gray-800' : 'cursor-grab hover:bg-gray-800'
        } transition-colors duration-200`} 
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
        style={{ userSelect: 'none', touchAction: 'none' }}
      >
        <CardTitle className="flex items-center justify-between text-sm">
          <button 
            onClick={handleLogoClick}
            className="flex items-center space-x-2 text-white hover:opacity-80 transition-opacity"
          >
            <img 
              src="/lovable-uploads/50b77ea0-3474-47cb-8e98-16b77f963d10.png" 
              alt="Nelie AI Tutor Robot"
              className="w-48 h-48 object-contain"
              draggable={false}
              style={{ 
                userSelect: 'none'
              }}
            />
            <span>NELIE - Your AI Tutor</span>
          </button>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onResetToHome}
              className="text-gray-400 hover:text-white p-1"
              title="Go home"
            >
              <Home className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div 
          ref={messagesContainerRef}
          className="h-48 overflow-y-auto space-y-2"
        >
          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-xs px-3 py-2 rounded-lg text-xs ${
                  message.role === 'user'
                    ? 'bg-gradient-to-r from-cyan-400 to-purple-500 text-white'
                    : 'bg-gray-800 text-gray-100 border border-gray-700'
                }`}
              >
                <p className="leading-relaxed text-center whitespace-pre-wrap">{message.content}</p>
                <p className="text-xs opacity-70 mt-1 text-center">
                  {message.timestamp.toLocaleTimeString('en-US')}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <div className="flex space-x-1">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type 'hi Nelie' or your question..."
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1 bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-cyan-400 text-xs h-8 text-center"
            />
            <VoiceControls 
              isSpeaking={isSpeaking}
              onStopSpeaking={onStopSpeaking}
              onVoiceInput={handleVoiceInput}
            />
            <Button 
              onClick={handleSendMessage} 
              size="sm" 
              className="bg-gradient-to-r from-cyan-400 to-purple-500 hover:from-cyan-500 hover:to-purple-600 text-white border-none p-1"
            >
              <Send className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatInterface;
