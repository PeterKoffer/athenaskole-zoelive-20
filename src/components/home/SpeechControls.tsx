
import { Button } from '@/components/ui/button';
import { VolumeX } from 'lucide-react';

interface SpeechControlsProps {
  isSpeaking: boolean;
  onStopSpeech: () => void;
}

const SpeechControls = ({ isSpeaking, onStopSpeech }: SpeechControlsProps) => {
  if (!isSpeaking) return null;

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Stop button when speaking */}
      <Button
        onClick={onStopSpeech}
        variant="outline"
        className="border-white/20 bg-red-500 hover:bg-red-600 text-white font-medium animate-pulse"
      >
        <VolumeX className="w-4 h-4 mr-2" />
        Stop Nelie
      </Button>
      
      {/* Status indicator */}
      <div className="flex items-center space-x-2">
        <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
        <span className="text-green-200 text-sm font-medium">Nelie is speaking...</span>
      </div>
    </div>
  );
};

export default SpeechControls;
