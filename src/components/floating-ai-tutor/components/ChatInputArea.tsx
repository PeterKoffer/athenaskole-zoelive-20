
import React, { useState } from 'react';
import { MessageSquare } from 'lucide-react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';

interface ChatInputAreaProps {
  onSendMessage: (message: string) => void;
}

const ChatInputArea: React.FC<ChatInputAreaProps> = ({ onSendMessage }) => {
  const [inputText, setInputText] = useState('');

  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    onSendMessage(inputText);
    setInputText('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="p-4 border-t border-gray-700">
      <div className="flex gap-2">
        <Input
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ask Nelie anything..."
          className="flex-1 bg-gray-800 border-gray-600 text-white"
          onKeyPress={handleKeyPress}
        />
        <Button
          onClick={handleSendMessage}
          className="bg-blue-600 hover:bg-blue-700"
          size="icon"
        >
          <MessageSquare className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ChatInputArea;
