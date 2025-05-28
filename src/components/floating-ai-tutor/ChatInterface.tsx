
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, X, Move } from "lucide-react";
import { Message } from "./types";
import VoiceControls from "./VoiceControls";

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  onClose: () => void;
  onMouseDown: (e: React.MouseEvent) => void;
  isSpeaking: boolean;
  onStopSpeaking: () => void;
}

const ChatInterface = ({ 
  messages, 
  onSendMessage, 
  onClose, 
  onMouseDown, 
  isSpeaking, 
  onStopSpeaking 
}: ChatInterfaceProps) => {
  const [inputMessage, setInputMessage] = useState("");

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    onSendMessage(inputMessage);
    setInputMessage("");
  };

  const handleVoiceInput = (message: string) => {
    setInputMessage(message);
  };

  return (
    <Card className="w-80 bg-gray-900 border-gray-800 shadow-2xl">
      <CardHeader className="pb-3 cursor-move" onMouseDown={onMouseDown}>
        <CardTitle className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2 text-white">
            <Move className="w-4 h-4 text-gray-400" />
            <span className="text-lg">🎓</span>
            <span>Nelie - Din AI Lærer</span>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="bg-gradient-to-r from-purple-400 to-cyan-400 text-white border-purple-400 text-xs">
              Live
            </Badge>
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
        <div className="h-48 overflow-y-auto space-y-2">
          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-xs px-3 py-2 rounded-lg text-xs ${
                  message.role === 'user'
                    ? 'bg-gradient-to-r from-purple-400 to-cyan-400 text-white'
                    : 'bg-gray-800 text-gray-100 border border-gray-700'
                }`}
              >
                <p>{message.content}</p>
                <p className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString('da-DK')}
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
              placeholder="Skriv 'hi Nelie' eller dit spørgsmål..."
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1 bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-purple-400 text-xs h-8"
            />
            <VoiceControls 
              isSpeaking={isSpeaking}
              onStopSpeaking={onStopSpeaking}
              onVoiceInput={handleVoiceInput}
            />
            <Button 
              onClick={handleSendMessage} 
              size="sm" 
              className="bg-gradient-to-r from-purple-400 to-cyan-400 hover:from-purple-500 hover:to-cyan-500 text-white border-none p-1"
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
