
import RobotAvatar from "@/components/ai-tutor/RobotAvatar";

interface NelieAvatarDisplayProps {
  isSpeaking: boolean;
  onStopSpeech: () => void;
}

const NelieAvatarDisplay = ({ isSpeaking }: NelieAvatarDisplayProps) => {
  return (
    <div className="flex items-center justify-center">
      <div className="relative transform hover:scale-105 transition-transform duration-300">
        <RobotAvatar 
          size="4xl" 
          isActive={true} 
          isSpeaking={isSpeaking}
          className="drop-shadow-2xl"
        />
      </div>
    </div>
  );
};

export default NelieAvatarDisplay;
