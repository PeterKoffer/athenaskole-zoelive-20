
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
      console.log('🤖 Generating AI math question for grade', studentGrade, 'question', questionNumber);
      
      // Enhanced request with more variety parameters
      const { data, error } = await supabase.functions.invoke('generate-question', {
        body: {
          subject: 'mathematics',
          skillArea: getSkillAreaForQuestion(questionNumber),
          difficultyLevel: studentGrade,
          gradeLevel: studentGrade,
          userId: 'student',
          questionIndex: questionNumber - 1,
          promptVariation: getPromptVariation(questionNumber),
          topicFocus: getTopicFocus(questionNumber),
          questionType: getQuestionType(questionNumber)
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data) {
        console.log('✅ Generated diverse question:', data.question.substring(0, 50) + '...');
        setQuestion(data);
      } else {
        throw new Error('No question data received');
      }
    } catch (err: any) {
      console.error('❌ Error generating question:', err);
      setError(err.message);
      // Enhanced fallback questions with more variety
      setQuestion(createDiverseFallbackQuestion(questionNumber, studentGrade));
    } finally {
      setIsLoading(false);
    }
  };

  const getSkillAreaForQuestion = (questionNum: number) => {
    const skillAreas = [
      'basic_arithmetic',
      'word_problems',
      'geometry_basics',
      'measurement',
      'fractions',
      'time_and_money'
    ];
    return skillAreas[(questionNum - 1) % skillAreas.length];
  };

  const getPromptVariation = (questionNum: number) => {
    const variations = ['basic', 'story', 'visual', 'practical', 'creative', 'challenge'];
    return variations[(questionNum - 1) % variations.length];
  };

  const getTopicFocus = (questionNum: number) => {
    const topics = ['addition', 'subtraction', 'multiplication', 'division', 'shapes', 'patterns'];
    return topics[(questionNum - 1) % topics.length];
  };

  const getQuestionType = (questionNum: number) => {
    const types = ['multiple_choice', 'word_problem', 'visual_math', 'real_world', 'logic_puzzle', 'number_sense'];
    return types[(questionNum - 1) % types.length];
  };

  const createDiverseFallbackQuestion = (questionNum: number, grade: number): MathQuestion => {
    const questionTypes = [
      {
        question: `A bakery has ${10 + questionNum} cupcakes. They sell ${3 + questionNum} cupcakes. How many cupcakes are left?`,
        options: [`${7 + questionNum}`, `${6 + questionNum}`, `${8 + questionNum}`, `${9 + questionNum}`],
        correct: 0,
        explanation: `${10 + questionNum} - ${3 + questionNum} = ${7 + questionNum} cupcakes left.`
      },
      {
        question: `If you have ${2 + questionNum} boxes with ${4} toys each, how many toys do you have in total?`,
        options: [`${(2 + questionNum) * 4}`, `${(2 + questionNum) * 3}`, `${(2 + questionNum) * 5}`, `${(2 + questionNum) * 2}`],
        correct: 0,
        explanation: `${2 + questionNum} × 4 = ${(2 + questionNum) * 4} toys.`
      },
      {
        question: `What is the next number in this pattern: ${questionNum}, ${questionNum + 2}, ${questionNum + 4}, ?`,
        options: [`${questionNum + 6}`, `${questionNum + 5}`, `${questionNum + 7}`, `${questionNum + 8}`],
        correct: 0,
        explanation: `The pattern increases by 2 each time: ${questionNum + 6}.`
      },
      {
        question: `A pizza is cut into ${4 + questionNum} equal pieces. If you eat ${2} pieces, what fraction did you eat?`,
        options: [`2/${4 + questionNum}`, `${2}/${3 + questionNum}`, `${3}/${4 + questionNum}`, `1/${2 + questionNum}`],
        correct: 0,
        explanation: `You ate 2 out of ${4 + questionNum} pieces, which is 2/${4 + questionNum}.`
      },
      {
        question: `How many minutes are in ${1 + Math.floor(questionNum/2)} hour(s)?`,
        options: [`${(1 + Math.floor(questionNum/2)) * 60}`, `${(1 + Math.floor(questionNum/2)) * 50}`, `${(1 + Math.floor(questionNum/2)) * 70}`, `${(1 + Math.floor(questionNum/2)) * 30}`],
        correct: 0,
        explanation: `There are 60 minutes in 1 hour, so ${1 + Math.floor(questionNum/2)} hour(s) = ${(1 + Math.floor(questionNum/2)) * 60} minutes.`
      },
      {
        question: `A rectangle has a length of ${6 + questionNum} cm and width of ${3 + questionNum} cm. What is its area?`,
        options: [`${(6 + questionNum) * (3 + questionNum)}`, `${(6 + questionNum) + (3 + questionNum)}`, `${(6 + questionNum) * 2}`, `${(3 + questionNum) * 2}`],
        correct: 0,
        explanation: `Area = length × width = ${6 + questionNum} × ${3 + questionNum} = ${(6 + questionNum) * (3 + questionNum)} cm².`
      }
    ];

    const selectedQuestion = questionTypes[(questionNum - 1) % questionTypes.length];
    return {
      ...selectedQuestion,
      question: selectedQuestion.question,
      options: selectedQuestion.options,
      correct: selectedQuestion.correct,
      explanation: selectedQuestion.explanation
    };
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
          <p className="text-white text-lg">Nelie is preparing your unique math question...</p>
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
                {selectedAnswer === question.correct ? 'Excellent work!' : 'Good try! Let me explain:'}
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
