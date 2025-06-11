
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

interface SelfAssessmentProps {
  question?: string;
  options?: string[];
  correctAnswer?: number;
  explanation?: string;
  onSubmit: (wasCorrect: boolean) => void;
}

const SelfAssessment = ({ 
  question, 
  options, 
  correctAnswer = 3, 
  explanation,
  onSubmit 
}: SelfAssessmentProps) => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const defaultQuestion = "What was the most important thing you learned in this lesson?";
  const defaultOptions = [
    "How animals and plants depend on their environment",
    "The importance of water in nature",
    "How scientists observe and learn",
    "All of the above"
  ];
  const defaultExplanation = "All of these concepts work together in nature!";

  const handleAnswerSelect = (answerIndex: number) => {
    if (showResult) return;
    setSelectedAnswer(answerIndex);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;
    
    setShowResult(true);
    const isCorrect = selectedAnswer === correctAnswer;
    
    setTimeout(() => {
      onSubmit(isCorrect);
    }, 2500);
  };

  return (
    <div className="space-y-6">
      <div className="bg-emerald-800/30 rounded-lg p-4 sm:p-6">
        <h4 className="text-emerald-300 font-bold text-lg sm:text-xl mb-4">Quick Check</h4>
        <p className="text-emerald-100 text-base sm:text-lg mb-6">
          {question || defaultQuestion}
        </p>
        
        <div className="space-y-3">
          {(options || defaultOptions).map((option: string, index: number) => (
            <Button
              key={index}
              variant={selectedAnswer === index ? "default" : "outline"}
              onClick={() => handleAnswerSelect(index)}
              disabled={showResult}
              className={`w-full text-left justify-start p-3 sm:p-4 h-auto ${
                selectedAnswer === index
                  ? "bg-emerald-600 text-white border-emerald-600"
                  : "bg-emerald-700 border-emerald-600 text-white hover:bg-emerald-600"
              } ${
                showResult && index === correctAnswer
                  ? "bg-green-600 border-green-600"
                  : ""
              }`}
            >
              <span className="mr-3 font-semibold">{String.fromCharCode(65 + index)}.</span>
              <span className="text-sm sm:text-base">{option}</span>
              {showResult && index === correctAnswer && (
                <CheckCircle className="w-5 h-5 ml-auto text-white" />
              )}
            </Button>
          ))}
        </div>
      </div>

      {showResult && (
        <div className="bg-emerald-700/50 rounded-lg p-4">
          <p className="text-emerald-300 font-semibold mb-2">
            {selectedAnswer === correctAnswer ? 'Excellent! 🎉' : 'Good thinking! 💭'}
          </p>
          <p className="text-emerald-100 text-sm sm:text-base">
            {explanation || defaultExplanation}
          </p>
        </div>
      )}

      <div className="flex justify-center">
        {!showResult ? (
          <Button
            onClick={handleSubmitAnswer}
            disabled={selectedAnswer === null}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 text-base font-semibold w-full sm:w-auto"
          >
            Submit Answer
          </Button>
        ) : (
          <div className="text-center text-emerald-400">
            <p className="text-sm sm:text-base">Completing lesson...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SelfAssessment;
