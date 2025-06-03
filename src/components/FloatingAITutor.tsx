import { useState, useEffect } from "react";
import { MessageCircle, X, Minimize2, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "react-router-dom";
import ChatInterface from "./floating-ai-tutor/ChatInterface";
import CollapsedButton from "./floating-ai-tutor/CollapsedButton";
import { useDragHandler } from "./floating-ai-tutor/useDragHandler";

const FloatingAITutor = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Array<{ text: string; isUser: boolean; timestamp: Date }>>([]);
  const location = useLocation();
  
  const { position, isDragging, handleMouseDown } = useDragHandler({
    initialX: window.innerWidth - 100,
    initialY: window.innerHeight - 100
  });

  // Hide on certain pages to prevent blocking navigation
  const shouldHide = location.pathname === '/' || 
                    location.pathname.includes('/auth') || 
                    location.pathname.includes('/adaptive-learning');

  // Reset state when navigating to different pages
  useEffect(() => {
    if (shouldHide) {
      setIsOpen(false);
      setIsMinimized(false);
    }
  }, [location.pathname, shouldHide]);

  if (shouldHide) {
    return null;
  }

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const handleSendMessage = (text: string) => {
    const newMessage = { text: text, isUser: true, timestamp: new Date() };
    setMessages([...messages, newMessage]);
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 1000,
        transform: `translate(${position.x}px, ${position.y}px)`,
        cursor: isDragging ? 'grabbing' : 'grab',
      }}
      onMouseDown={handleMouseDown}
    >
      {!isOpen && !isMinimized && (
        <CollapsedButton onClick={toggleOpen} />
      )}

      {isOpen && !isMinimized && (
        <Card className="w-80 bg-gray-900 border-gray-700 text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium flex items-center">
              <Badge variant="secondary" className="mr-2">
                <MessageCircle className="h-3 w-3 mr-1" />
                AI Tutor
              </Badge>
              Nelie
            </CardTitle>
            <div className="flex space-x-2">
              <Button variant="ghost" size="icon" onClick={toggleMinimize}>
                <Minimize2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={toggleOpen}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pl-2 pr-2 pb-2">
            <ChatInterface messages={messages} onSendMessage={handleSendMessage} />
          </CardContent>
        </Card>
      )}

      {isMinimized && (
        <Button variant="outline" size="sm" onClick={toggleMinimize} className="bg-gray-800 text-white hover:bg-gray-700">
          <Maximize2 className="w-4 h-4 mr-2" />
          Expand Nelie
        </Button>
      )}
    </div>
  );
};

export default FloatingAITutor;
