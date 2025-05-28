
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mic, MicOff, Send, Volume2, VolumeX, MessageCircle, X, Move } from "lucide-react";
import { Input } from "@/components/ui/input";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const FloatingAITutor = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant" as const,
      content: "Hej! Jeg er din flydende AI-lærer. Hvad kan jeg hjælpe dig med?",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    const rect = e.currentTarget.getBoundingClientRect();
    dragOffset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragOffset.current.x,
        y: e.clientY - dragOffset.current.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Add global mouse event listeners
  useState(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  });

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      role: "user" as const,
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        role: "assistant" as const,
        content: "Det er et godt spørgsmål! Lad mig hjælpe dig med det...",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const toggleListening = () => {
    setIsListening(!isListening);
    if (!isListening) {
      setTimeout(() => {
        setIsListening(false);
        setInputMessage("Kan du hjælpe mig med matematik?");
      }, 2000);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  if (!isExpanded) {
    return (
      <div
        className="fixed z-50 cursor-move"
        style={{ left: position.x, top: position.y }}
        onMouseDown={handleMouseDown}
      >
        <Button
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(true);
          }}
          className="bg-gradient-to-r from-purple-400 to-cyan-400 hover:from-purple-500 hover:to-cyan-500 text-white border-none rounded-full w-14 h-14 shadow-lg"
        >
          <div className="flex flex-col items-center">
            <span className="text-lg">🎓</span>
            <MessageCircle className="w-4 h-4 absolute -bottom-1 -right-1 bg-green-500 rounded-full p-0.5" />
          </div>
        </Button>
      </div>
    );
  }

  return (
    <div
      className="fixed z-50"
      style={{ left: position.x, top: position.y }}
    >
      <Card className="w-80 bg-gray-900 border-gray-800 shadow-2xl">
        <CardHeader className="pb-3 cursor-move" onMouseDown={handleMouseDown}>
          <CardTitle className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2 text-white">
              <Move className="w-4 h-4 text-gray-400" />
              <span className="text-lg">🎓</span>
              <span>Flydende AI Lærer</span>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="bg-gradient-to-r from-purple-400 to-cyan-400 text-white border-purple-400 text-xs">
                Live
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(false)}
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
                placeholder="Skriv dit spørgsmål..."
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1 bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-purple-400 text-xs h-8"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={toggleListening}
                className={`border-gray-600 p-1 ${isListening ? "bg-gradient-to-r from-purple-400 to-cyan-400 text-white border-none" : "bg-gray-800 text-gray-300 hover:bg-gray-700"}`}
              >
                {isListening ? <MicOff className="w-3 h-3" /> : <Mic className="w-3 h-3" />}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={isSpeaking ? stopSpeaking : () => {}}
                className={`border-gray-600 p-1 ${isSpeaking ? "bg-blue-400 text-gray-900 border-blue-400" : "bg-gray-800 text-gray-300"}`}
                disabled={!isSpeaking}
              >
                {isSpeaking ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
              </Button>
              <Button 
                onClick={handleSendMessage} 
                size="sm" 
                className="bg-gradient-to-r from-purple-400 to-cyan-400 hover:from-purple-500 hover:to-cyan-500 text-white border-none p-1"
              >
                <Send className="w-3 h-3" />
              </Button>
            </div>

            {isListening && (
              <div className="text-center">
                <Badge variant="outline" className="bg-gradient-to-r from-purple-400 to-cyan-400 text-white border-purple-400 animate-pulse text-xs">
                  🎤 Lytter...
                </Badge>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FloatingAITutor;
