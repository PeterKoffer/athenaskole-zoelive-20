
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface MathQuestion {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

interface AIGeneratedMathQuestionProps {
  questionNumber: number;
  totalQuestions: number;
  studentGrade: number;
  onQuestionComplete: (wasCorrect: boolean) => void;
}

const AIGeneratedMathQuestion = ({
  questionNumber,
  totalQuestions,
  studentGrade,
  onQuestionComplete
}: AIGeneratedMathQuestionProps) => {
  const [question, setQuestion] = useState<MathQuestion | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Generate question when component mounts
  useEffect(() => {
    generateQuestion();
  }, [questionNumber]);

  const generateQuestion = async () => {
    setIsLoading(true);
    setError(null);
    setSelectedAnswer(null);
    setShowResult(false);

    try {
      console.log('🤖 Generating AI math question for grade', studentGrade);
      
      const { data, error } = await supabase.functions.invoke('generate-question', {
        body: {
          subject: 'mathematics',
          skillArea: 'basic_arithmetic',
          difficultyLevel: studentGrade,
          gradeLevel: studentGrade,
          userId: 'student',
          questionIndex: questionNumber - 1,
          promptVariation: 'basic'
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data) {
        console.log('✅ Generated question:', data.question);
        setQuestion(data);
      } else {
        throw new Error('No question data received');
      }
    } catch (err: any) {
      console.error('❌ Error generating question:', err);
      setError(err.message);
      // Fallback question
      setQuestion({
        question: `What is ${5 + questionNumber} + ${3 + questionNumber}?`,
        options: [
          `${8 + (questionNumber * 2)}`,
          `${9 + (questionNumber * 2)}`,
          `${7 + (questionNumber * 2)}`,
          `${10 + (questionNumber * 2)}`
        ],
        correct: 0,
        explanation: `Adding ${5 + questionNumber} + ${3 + questionNumber} gives us ${8 + (questionNumber * 2)}.`
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (showResult || selectedAnswer !== null) return;
    
    console.log('📝 Student selected answer:', answerIndex);
    setSelectedAnswer(answerIndex);
    
    // Show result immediately
    setShowResult(true);
    
    const wasCorrect = answerIndex === question?.correct;
    console.log('✅ Answer was correct:', wasCorrect);
    
    // Call completion callback after showing result
    setTimeout(() => {
      onQuestionComplete(wasCorrect);
    }, 1500);
  };

  if (isLoading) {
    return (
      <Card className="bg-black/50 border-purple-400/50 backdrop-blur-sm">
        <CardContent className="p-8 text-center">
          <Loader2 className="w-8 h-8 animate-spin text-purple-400 mx-auto mb-4" />
          <p className="text-white text-lg">Nelie is preparing your math question...</p>
        </CardContent>
      </Card>
    );
  }

  if (error || !question) {
    return (
      <Card className="bg-red-900/50 border-red-400/50 backdrop-blur-sm">
        <CardContent className="p-8 text-center">
          <p className="text-red-200 text-lg mb-4">
            Oops! There was a problem generating your question.
          </p>
          <Button 
            onClick={generateQuestion}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-black/50 border-purple-400/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white text-center">
          Question {questionNumber} of {totalQuestions}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-8">
        {/* Question */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-white text-center mb-6">
            {question.question}
          </h3>
        </div>

        {/* Answer Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {question.options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrect = index === question.correct;
            const showCorrect = showResult && isCorrect;
            const showIncorrect = showResult && isSelected && !isCorrect;
            
            let buttonClass = "h-16 text-lg font-semibold transition-all duration-200 ";
            
            if (showCorrect) {
              buttonClass += "bg-green-600 border-green-500 text-white hover:bg-green-600";
            } else if (showIncorrect) {
              buttonClass += "bg-red-600 border-red-500 text-white hover:bg-red-600";
            } else if (isSelected) {
              buttonClass += "bg-blue-600 border-blue-500 text-white";
            } else {
              buttonClass += "bg-gray-700 border-gray-600 text-white hover:bg-gray-600";
            }

            return (
              <Button
                key={index}
                variant="outline"
                className={buttonClass}
                onClick={() => handleAnswerSelect(index)}
                disabled={showResult}
              >
                <span className="mr-3 font-bold">
                  {String.fromCharCode(65 + index)}.
                </span>
                <span className="flex-1 text-center">{option}</span>
                {showCorrect && (
                  <CheckCircle className="w-6 h-6 ml-3 text-green-300" />
                )}
                {showIncorrect && (
                  <XCircle className="w-6 h-6 ml-3 text-red-300" />
                )}
              </Button>
            );
          })}
        </div>

        {/* Explanation */}
        {showResult && (
          <div className="bg-black/30 rounded-lg p-6 border border-gray-600">
            <div className="flex items-center mb-3">
              {selectedAnswer === question.correct ? (
                <CheckCircle className="w-6 h-6 text-green-400 mr-3" />
              ) : (
                <XCircle className="w-6 h-6 text-red-400 mr-3" />
              )}
              <span className="text-lg font-semibold text-white">
                {selectedAnswer === question.correct ? 'Correct!' : 'Not quite right'}
              </span>
            </div>
            <p className="text-gray-300 text-base leading-relaxed">
              {question.explanation}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIGeneratedMathQuestion;
