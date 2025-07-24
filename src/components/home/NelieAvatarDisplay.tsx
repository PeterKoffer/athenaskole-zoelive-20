
import NELIEFloating from "@/components/NELIEFloating";

interface NelieAvatarDisplayProps {
  isSpeaking: boolean;
  onStopSpeech: () => void;
}

const NelieAvatarDisplay = ({ isSpeaking }: NelieAvatarDisplayProps) => {
  return (
    <div className="flex items-center justify-center">
      <div className="relative transform hover:scale-105 transition-transform duration-300">
        <NELIEFloating />
      </div>
    </div>
  );
};

export default NelieAvatarDisplay;
