
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ResultCardProps {
  isCorrect: boolean;
  correctAnswer?: string;
  userAnswer?: string;
  feedback?: string;
  onNext: () => void;
  isLastQuestion?: boolean;
}

const ResultCard = ({ 
  isCorrect, 
  correctAnswer, 
  userAnswer: _userAnswer, 
  feedback, 
  onNext, 
  isLastQuestion = false 
}: ResultCardProps) => {
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardContent className="p-8">
        <div className="space-y-4">
          <div className={`text-center p-4 rounded-lg ${
            isCorrect ? 'bg-green-600/20 border border-green-500' : 'bg-red-600/20 border border-red-500'
          }`}>
            <div className="text-2xl mb-2">
              {isCorrect ? '🎉' : '😔'}
            </div>
            <p className={`font-semibold ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
              {isCorrect ? 'Correct! Well done!' : 'Incorrect. Try again next time!'}
            </p>
            {feedback && (
              <p className="text-white text-sm mt-2">{feedback}</p>
            )}
            {!isCorrect && correctAnswer && (
              <p className="text-yellow-400 text-sm mt-2">Correct answer: {correctAnswer}</p>
            )}
            {isCorrect && <p className="text-white text-sm mt-2">+10 XP</p>}
          </div>
          <Button
            onClick={onNext}
            className="w-full bg-gradient-to-r from-purple-400 to-cyan-400 hover:from-purple-500 hover:to-cyan-500 text-white border-none"
          >
            {isLastQuestion ? 'Complete Lesson' : 'Next'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResultCard;
