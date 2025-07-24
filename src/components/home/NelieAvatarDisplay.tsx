
import RefactoredFloatingAITutor from "@/components/RefactoredFloatingAITutor";

interface NelieAvatarDisplayProps {
  isSpeaking: boolean;
  onStopSpeech: () => void;
}

const NelieAvatarDisplay = () => {
  return (
    <>
      <RefactoredFloatingAITutor />
    </>
  );
};

export default NelieAvatarDisplay;
