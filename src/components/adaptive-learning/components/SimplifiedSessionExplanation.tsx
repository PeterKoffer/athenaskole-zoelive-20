
interface SimplifiedSessionExplanationProps {
  currentQuestion: any;
  showResult: boolean;
  questionNumber: number;
  totalQuestions: number;
}

const SimplifiedSessionExplanation = ({
  currentQuestion,
  showResult,
  questionNumber,
  totalQuestions
}: SimplifiedSessionExplanationProps) => {
  if (!showResult) return null;

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
      <h4 className="text-white font-medium mb-2">Explanation:</h4>
      <p className="text-gray-300">{currentQuestion.explanation}</p>
      <p className="text-gray-400 text-sm mt-2">
        {questionNumber < totalQuestions ? 'Next question coming up...' : 'Session completing...'}
      </p>
    </div>
  );
};

export default SimplifiedSessionExplanation;
