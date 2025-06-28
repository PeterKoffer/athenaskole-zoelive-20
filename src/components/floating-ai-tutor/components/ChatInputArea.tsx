
import React, { useState } from 'react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Send, Mic, MicOff } from 'lucide-react';
import VoiceControls from '../VoiceControls';

interface ChatInputAreaProps {
  onSendMessage: (message: string) => void;
}

const ChatInputArea = ({ onSendMessage }: ChatInputAreaProps) => {
  const [inputMessage, setInputMessage] = useState('');
  const [isListening, setIsListening] = useState(false);

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      onSendMessage(inputMessage.trim());
      setInputMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleVoiceInput = (transcript: string) => {
    if (transcript.trim()) {
      onSendMessage(transcript.trim());
    }
  };

  return (
    <div className="p-4 border-t border-gray-700">
      <div className="flex gap-2 mb-2">
        <VoiceControls 
          onVoiceInput={handleVoiceInput}
          isSpeaking={false}
        />
      </div>
      
      <div className="flex gap-2">
        <Input
          placeholder="Ask Nelie anything about your studies..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1 bg-gray-800 border-gray-600 text-white placeholder-gray-400"
        />
        <Button
          onClick={handleSendMessage}
          disabled={!inputMessage.trim()}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default ChatInputArea;
