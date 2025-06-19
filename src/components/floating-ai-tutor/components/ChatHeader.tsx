
import React from 'react';
import { Button } from '../../ui/button';
import { X, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import RobotAvatar from '../../ai-tutor/RobotAvatar';

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
    <div 
      className="bg-gradient-to-r from-purple-600 to-blue-600 p-4 cursor-grab active:cursor-grabbing select-none"
      onMouseDown={onMouseDown}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-white font-semibold">Nelie AI Tutor</h3>
        <div className="flex space-x-2">
          <Button
            onClick={onVoiceToggle}
            variant="outline"
            size="sm"
            className="border-white/20 text-white bg-white/10 hover:bg-white/20 p-1"
          >
            {isListening ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
          </Button>
          <Button
            onClick={onSpeechToggle}
            variant="outline"
            size="sm"
            className="border-white/20 text-white bg-white/10 hover:bg-white/20 p-1"
          >
            {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
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
      
      <div className="flex justify-center">
        <RobotAvatar 
          size="2xl" 
          isActive={true} 
          isSpeaking={isSpeaking}
        />
      </div>
    </div>
  );
};

export default ChatHeader;
