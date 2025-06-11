
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, CheckCircle, XCircle } from 'lucide-react';

interface QuestionContent {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

interface ActivityQuestionProps {
  title: string;
  content: QuestionContent;
  selectedAnswer: number | null;
  showResult: boolean;
  activityCompleted: boolean;
  onAnswerSelect: (answerIndex: number) => void;
}

const ActivityQuestion = ({
  title,
  content,
  selectedAnswer,
  showResult,
  activityCompleted,
  onAnswerSelect
}: ActivityQuestionProps) => {
  
  const handleAnswerClick = (index: number) => {
    // Prevent selection if already answered or activity completed
    if (showResult || activityCompleted || selectedAnswer !== null) {
      return;
    }
    
    console.log('🎯 User selected answer:', index);
    onAnswerSelect(index);
  };

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardContent className="p-6">
        <div className="flex items-center mb-6">
          <Brain className="w-6 h-6 text-blue-400 mr-2" />
          <h3 className="text-xl font-semibold text-white">{title}</h3>
        </div>

        <div className="space-y-6">
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
            <p className="text-lg text-white leading-relaxed">
              {content.question}
            </p>
          </div>
          
          <div className="space-y-3">
            {content.options && content.options.map((option: string, index: number) => {
              const isSelected = selectedAnswer === index;
              const isCorrect = index === content.correct;
              const isIncorrect = showResult && isSelected && !isCorrect;
              
              let buttonStyle = 'bg-gray-700 border-gray-600 text-white hover:bg-gray-600';
              
              if (showResult) {
                if (isCorrect) {
                  buttonStyle = 'bg-green-600 border-green-500 text-white';
                } else if (isIncorrect) {
                  buttonStyle = 'bg-red-600 border-red-500 text-white';
                }
              } else if (isSelected) {
                buttonStyle = 'bg-blue-600 border-blue-500 text-white';
              }

              return (
                <Button
                  key={index}
                  variant="outline"
                  className={`w-full text-left justify-start p-4 h-auto transition-all duration-200 ${buttonStyle}`}
                  onClick={() => handleAnswerClick(index)}
                  disabled={showResult || activityCompleted}
                >
                  <span className="mr-3 font-semibold text-white">
                    {String.fromCharCode(65 + index)}.
                  </span>
                  <span className="flex-1 text-white">{option}</span>
                  {showResult && isCorrect && (
                    <CheckCircle className="w-5 h-5 ml-2 text-green-400" />
                  )}
                  {showResult && isIncorrected && (
                    <XCircle className="w-5 h-5 ml-2 text-red-400" />
                  )}
                </Button>
              );
            })}
          </div>

          {showResult && (
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 mt-6">
              <div className="flex items-center mb-2">
                <span className={
                  selectedAnswer === content.correct 
                    ? 'text-green-400 font-semibold' 
                    : 'text-red-400 font-semibold'
                }>
                  {selectedAnswer === content.correct ? 'Excellent! 🎉' : 'Good try! Let me explain:'}
                </span>
              </div>
              <p className="text-gray-300">{content.explanation}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityQuestion;
