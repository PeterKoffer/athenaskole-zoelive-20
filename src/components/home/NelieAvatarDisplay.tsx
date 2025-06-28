
import RobotAvatar from "@/components/ai-tutor/RobotAvatar";

interface NelieAvatarDisplayProps {
  isSpeaking: boolean;
  onStopSpeech: () => void;
}

const NelieAvatarDisplay = ({ isSpeaking }: NelieAvatarDisplayProps) => {
  console.log('🤖 NelieAvatarDisplay rendering, isSpeaking:', isSpeaking);
  
  return (
    <div className="flex items-center justify-center">
      <div className="relative">
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
