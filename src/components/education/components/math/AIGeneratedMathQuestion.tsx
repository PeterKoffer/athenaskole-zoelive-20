
import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { safeInvokeFn } from '@/supabase/functionsClient';
import { useAuth } from '@/hooks/useAuth';

interface MathQuestion {
  id: string;
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
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const [currentQuestion, setCurrentQuestion] = useState<MathQuestion | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isGenerating, setIsGenerating] = useState(true);

  const generateQuestion = useCallback(async () => {
    if (authLoading || !user) return;
    
    setIsGenerating(true);
    console.log(`🤖 Generating AI math question for grade ${studentGrade} question ${questionNumber}`);
    
    try {
      const data = await safeInvokeFn('generate-question', {
        subject: 'mathematics',
        skillArea: questionNumber <= 2 ? 'basic_arithmetic' : 'word_problems',
        difficultyLevel: studentGrade,
        gradeLevel: studentGrade,
        userId: 'student',
        questionIndex: questionNumber - 1,
        promptVariation: questionNumber <= 2 ? 'basic' : 'story',
        topicFocus: questionNumber % 2 === 0 ? 'addition' : 'subtraction',
        questionType: questionNumber <= 2 ? 'multiple_choice' : 'word_problem'
      });

      if ((data as any)?.question) {
        const newQuestion: MathQuestion = {
          id: `ai-question-${questionNumber}-${Date.now()}`,
          question: (data as any).question,
          options: (data as any).options || ['A', 'B', 'C', 'D'],
          correct: (data as any).correct || 0,
          explanation: (data as any).explanation || 'Great job!'
        };

        console.log('✅ Generated diverse question:', newQuestion.question.substring(0, 50) + '...');
        setCurrentQuestion(newQuestion);
      } else {
        throw new Error('No question data received');
      }
    } catch (error) {
      console.error('❌ Failed to generate AI question:', error);
      
      // Enhanced fallback question with more variety
      const fallbackQuestions = [
        {
          question: `Sarah has ${12 + questionNumber} stickers. She gives ${3 + questionNumber} stickers to her friend. How many stickers does Sarah have left?`,
          options: [`${9}`, `${8 + questionNumber}`, `${10 + questionNumber}`, `${12 + questionNumber}`],
          correct: 1,
          explanation: `Sarah had ${12 + questionNumber} stickers and gave away ${3 + questionNumber}, so she has ${12 + questionNumber} - ${3 + questionNumber} = ${9 + questionNumber} stickers left.`
        },
        {
          question: `Tom bought ${8 + questionNumber * 2} apples. He ate ${2 + questionNumber} apples. How many apples does Tom have now?`,
          options: [`${6 + questionNumber}`, `${5 + questionNumber}`, `${7 + questionNumber}`, `${8 + questionNumber}`],
          correct: 0,
          explanation: `Tom had ${8 + questionNumber * 2} apples and ate ${2 + questionNumber}, so he has ${8 + questionNumber * 2} - ${2 + questionNumber} = ${6 + questionNumber} apples left.`
        },
        {
          question: `A box contains ${15 + questionNumber * 3} pencils. If ${4 + questionNumber} pencils are taken out, how many pencils remain?`,
          options: [`${11 + questionNumber * 2}`, `${10 + questionNumber * 2}`, `${12 + questionNumber * 2}`, `${13 + questionNumber * 2}`],
          correct: 0,
          explanation: `The box had ${15 + questionNumber * 3} pencils and ${4 + questionNumber} were removed, leaving ${15 + questionNumber * 3} - ${4 + questionNumber} = ${11 + questionNumber * 2} pencils.`
        }
      ];

      const fallback = fallbackQuestions[questionNumber % fallbackQuestions.length];
      setCurrentQuestion({
        id: `fallback-${questionNumber}-${Date.now()}`,
        question: fallback.question,
        options: fallback.options,
        correct: fallback.correct,
        explanation: fallback.explanation
      });

      toast({
        title: "Using Practice Question",
        description: "AI generation failed, using a practice question",
        duration: 3000
      });
    } finally {
      setIsGenerating(false);
    }
  }, [questionNumber, studentGrade, toast, authLoading, user]);

  useEffect(() => {
    generateQuestion();
  }, [generateQuestion]);

  const handleAnswerSelect = (answerIndex: number) => {
    if (showResult) return;
    setSelectedAnswer(answerIndex);
  };

  const handleSubmit = () => {
    if (selectedAnswer === null || !currentQuestion) return;
    
    setShowResult(true);
    const isCorrect = selectedAnswer === currentQuestion.correct;
    
    console.log('📝 Student selected answer:', selectedAnswer);
    console.log('✅ Answer was correct:', isCorrect);
    
    setTimeout(() => {
      onQuestionComplete(isCorrect);
    }, 2500);
  };

  if (isGenerating || !currentQuestion) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-8">
          <div className="flex flex-col items-center justify-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
            <p className="text-white text-lg">Generating your math question...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-xl font-bold text-white mb-4">
              Question {questionNumber} of {totalQuestions}
            </h3>
            <p className="text-lg text-gray-200 leading-relaxed">
              {currentQuestion.question}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {currentQuestion.options.map((option, index) => (
              <Button
                key={index}
                variant={selectedAnswer === index ? "default" : "outline"}
                className={`p-4 h-auto text-left justify-start text-base ${
                  selectedAnswer === index
                    ? "bg-blue-600 text-white border-blue-500"
                    : "bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                } ${showResult && index === currentQuestion.correct 
                    ? "bg-green-600 border-green-500" 
                    : ""} ${showResult && selectedAnswer === index && index !== currentQuestion.correct 
                    ? "bg-red-600 border-red-500" 
                    : ""}`}
                onClick={() => handleAnswerSelect(index)}
                disabled={showResult}
              >
                <span className="mr-3 font-bold">
                  {String.fromCharCode(65 + index)}.
                </span>
                {option}
                {showResult && index === currentQuestion.correct && (
                  <CheckCircle className="ml-auto h-5 w-5 text-green-200" />
                )}
                {showResult && selectedAnswer === index && index !== currentQuestion.correct && (
                  <XCircle className="ml-auto h-5 w-5 text-red-200" />
                )}
              </Button>
            ))}
          </div>

          {showResult && (
            <div className="bg-gray-700 border border-gray-600 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                {selectedAnswer === currentQuestion.correct ? (
                  <CheckCircle className="h-6 w-6 text-green-400 flex-shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="h-6 w-6 text-red-400 flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <p className={`font-semibold mb-2 ${
                    selectedAnswer === currentQuestion.correct 
                      ? 'text-green-400' 
                      : 'text-red-400'
                  }`}>
                    {selectedAnswer === currentQuestion.correct ? 'Correct!' : 'Not quite right'}
                  </p>
                  <p className="text-gray-300 leading-relaxed">
                    {currentQuestion.explanation}
                  </p>
                </div>
              </div>
            </div>
          )}

          {!showResult && (
            <div className="flex justify-center">
              <Button
                onClick={handleSubmit}
                disabled={selectedAnswer === null}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 text-base"
              >
                Submit Answer
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AIGeneratedMathQuestion;
