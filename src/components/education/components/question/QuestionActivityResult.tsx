
import TextWithSpeaker from '../shared/TextWithSpeaker';
import QuestionResult from '../QuestionResult';

interface QuestionActivityResultProps {
  showResult: boolean;
  isCorrect: boolean;
  explanation: string;
  isLastQuestion: boolean;
}

const QuestionActivityResult = ({
  showResult,
  isCorrect,
  explanation,
  isLastQuestion
}: QuestionActivityResultProps) => {
  if (!showResult) return null;

  return (
    <TextWithSpeaker
      text={explanation}
      context="question-explanation"
      position="corner"
      showOnHover={false}
    >
      <QuestionResult
        showResult={showResult}
        isCorrect={isCorrect}
        explanation={explanation}
        isLastQuestion={isLastQuestion}
      />
    </TextWithSpeaker>
  );
};

export default QuestionActivityResult;
