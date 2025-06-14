
import RobotAvatar from "@/components/ai-tutor/RobotAvatar";

interface NelieAvatarDisplayProps {
  isSpeaking: boolean;
  onStopSpeech: () => void;
}

const NelieAvatarDisplay = ({ isSpeaking }: NelieAvatarDisplayProps) => {
  return (
    <div className="flex items-center space-x-4">
      <RobotAvatar 
        size="3xl" 
        isActive={true} 
        isSpeaking={isSpeaking}
      />
    </div>
  );
};

export default NelieAvatarDisplay;
