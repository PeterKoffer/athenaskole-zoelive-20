
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, X, Volume2, VolumeX } from 'lucide-react';

const FloatingAITutor = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const toggleSpeech = () => {
    setIsSpeaking(!isSpeaking);
  };

  return (
    <>
      {/* Floating Chat Button */}
      <Button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 shadow-lg z-50"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </Button>

      {/* Chat Panel */}
      {isOpen && (
        <Card className="fixed bottom-24 right-6 w-80 max-h-96 bg-gray-900 border-gray-700 shadow-xl z-40">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-sm">
                  🤖
                </div>
                <span className="text-white font-semibold">Nelie AI</span>
              </div>
              <Button
                onClick={toggleSpeech}
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white"
              >
                {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </Button>
            </div>
            
            <div className="h-48 overflow-y-auto mb-4 space-y-2">
              <div className="bg-gray-800 rounded-lg p-3">
                <p className="text-white text-sm">
                  Hi! I'm Nelie, your AI learning assistant. How can I help you today?
                </p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Ask me anything..."
                className="flex-1 bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-400 focus:outline-none focus:border-purple-500"
              />
              <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                Send
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default FloatingAITutor;
