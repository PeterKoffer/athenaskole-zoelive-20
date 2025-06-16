
import React from 'react';
import { X, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { Button } from '../../ui/button';
import { CardHeader, CardTitle } from '../../ui/card';

interface ChatHeaderProps {
  onMouseDown: (e: React.MouseEvent) => void;
  onClose: () => void;
  isListening: boolean;
  onVoiceToggle: () => void;
  isSpeaking: boolean;
  onSpeechToggle: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  onMouseDown,
  onClose,
  isListening,
  onVoiceToggle,
  isSpeaking,
  onSpeechToggle
}) => {
  return (
    <CardHeader 
      className="pb-3 cursor-grab active:cursor-grabbing bg-blue-600 text-white rounded-t-lg"
      onMouseDown={onMouseDown}
    >
      <div className="flex items-center justify-between">
        <CardTitle className="text-lg">💙 Nelie - AI Tutor</CardTitle>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onVoiceToggle}
            className="h-8 w-8 text-white hover:bg-blue-700"
          >
            {isListening ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onSpeechToggle}
            className="h-8 w-8 text-white hover:bg-blue-700"
          >
            {isSpeaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 text-white hover:bg-blue-700"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </CardHeader>
  );
};

export default ChatHeader;
