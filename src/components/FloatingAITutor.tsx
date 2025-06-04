
import { useState, useEffect } from "react";
import { MessageCircle, X, Minimize2, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLocation, useNavigate } from "react-router-dom";
import ChatInterface from "./floating-ai-tutor/ChatInterface";
import CollapsedButton from "./floating-ai-tutor/CollapsedButton";
import { useDragHandler } from "./floating-ai-tutor/useDragHandler";
import { Message } from "./floating-ai-tutor/types";

const FloatingAITutor = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  const homePosition = {
    x: 0,
    y: 0
  };
  
  const { position, isDragging, handleMouseDown, handleTouchStart, resetToHome } = useDragHandler(homePosition);

  // Only hide on auth pages - show on ALL other pages
  const shouldHide = location.pathname === '/auth' || location.pathname.startsWith('/auth/');

  // Reset state when navigating to auth pages
  useEffect(() => {
    if (shouldHide) {
      setIsOpen(false);
      setIsMinimized(false);
    }
  }, [location.pathname, shouldHide]);

  console.log('FloatingAITutor rendering, shouldHide:', shouldHide, 'current path:', location.pathname);

  if (shouldHide) {
    console.log('FloatingAITutor hidden due to auth page');
    return null;
  }

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const handleSendMessage = (text: string) => {
    const newMessage: Message = { 
      role: "user", 
      content: text, 
      timestamp: new Date() 
    };
    setMessages([...messages, newMessage]);
  };

  const handleResetToHome = () => {
    resetToHome();
    navigate('/');
  };

  const handleStopSpeaking = () => {
    setIsSpeaking(false);
    speechSynthesis.cancel();
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 10000,
        transform: `translate(${position.x}px, ${position.y}px)`,
        cursor: isDragging ? 'grabbing' : 'grab',
        pointerEvents: 'auto'
      }}
    >
      {!isOpen && !isMinimized && (
        <CollapsedButton 
          onExpand={toggleOpen}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onResetToHome={handleResetToHome}
          isDragging={isDragging}
        />
      )}

      {isOpen && !isMinimized && (
        <ChatInterface
          messages={messages}
          onSendMessage={handleSendMessage}
          onClose={toggleOpen}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onResetToHome={handleResetToHome}
          isSpeaking={isSpeaking}
          onStopSpeaking={handleStopSpeaking}
          isDragging={isDragging}
        />
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
