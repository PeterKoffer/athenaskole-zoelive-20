
import RefactoredFloatingAITutor from "@/components/floating-ai-tutor/RefactoredFloatingAITutor";

interface NelieAvatarDisplayProps {
  isSpeaking: boolean;
  onStopSpeech: () => void;
}

const NelieAvatarDisplay = ({ isSpeaking }: NelieAvatarDisplayProps) => {
  return (
    <>
      <RefactoredFloatingAITutor />
    </>
  );
};

export default NelieAvatarDisplay;
