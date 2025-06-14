
import SpeechTab from "../SpeechTab";

interface EnhancedTutorSpeechTabProps {
  currentPracticeText: string;
  onPracticeTextChange: (text: string) => void;
  onScoreUpdate: (score: number) => void;
}

const EnhancedTutorSpeechTab = ({
  currentPracticeText,
  onPracticeTextChange,
  onScoreUpdate,
}: EnhancedTutorSpeechTabProps) => (
  <SpeechTab
    currentPracticeText={currentPracticeText}
    onPracticeTextChange={onPracticeTextChange}
    onScoreUpdate={onScoreUpdate}
  />
);

export default EnhancedTutorSpeechTab;
