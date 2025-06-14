
import RobotAvatar from '@/components/ai-tutor/RobotAvatar';
import SpeechControls from './SpeechControls';

interface NelieAvatarDisplayProps {
  isSpeaking: boolean;
  onStopSpeech: () => void;
}

const NelieAvatarDisplay = ({ isSpeaking, onStopSpeech }: NelieAvatarDisplayProps) => {
  return (
    <div className="flex flex-col items-center space-y-4">
      <RobotAvatar 
        size="xl" 
        isActive={true} 
        isSpeaking={isSpeaking}
        className="drop-shadow-lg"
      />
      
      <SpeechControls 
        isSpeaking={isSpeaking} 
        onStopSpeech={onStopSpeech}
      />
    </div>
  );
};

export default NelieAvatarDisplay;
