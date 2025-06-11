
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX, Play } from 'lucide-react';

interface IntroductionControlsProps {
  autoReadEnabled: boolean;
  isSpeaking: boolean;
  isIntroductionComplete: boolean;
  onMuteToggle: () => void;
  onManualRead: () => void;
  onStartLesson: () => void;
}

const IntroductionControls = ({
  autoReadEnabled,
  isSpeaking,
  isIntroductionComplete,
  onMuteToggle,
  onManualRead,
  onStartLesson
}: IntroductionControlsProps) => {
  return (
    <div className="flex justify-center space-x-4">
      <Button 
        variant="outline" 
        onClick={onMuteToggle} 
        className="border-purple-400 text-slate-950"
      >
        {autoReadEnabled ? (
          <VolumeX className="w-4 h-4 mr-2" />
        ) : (
          <Volume2 className="w-4 h-4 mr-2" />
        )}
        {autoReadEnabled ? 'Mute Nelie' : 'Unmute Nelie'}
      </Button>
      
      <Button 
        variant="outline" 
        onClick={onManualRead} 
        className="border-purple-400 text-slate-950"
        disabled={!autoReadEnabled}
      >
        <Volume2 className="w-4 h-4 mr-2" />
        {isSpeaking ? 'Stop Nelie' : 'Ask Nelie to Repeat'}
      </Button>
      
      {isIntroductionComplete && (
        <Button 
          onClick={onStartLesson} 
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          <Play className="w-4 h-4 mr-2" />
          Start Lesson
        </Button>
      )}
    </div>
  );
};

export default IntroductionControls;
