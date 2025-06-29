
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, CheckCircle, XCircle } from 'lucide-react';
import { ContentAtom } from '@/types/content';

interface QuestionRendererProps {
  atom: ContentAtom;
  onComplete: (result: { isCorrect: boolean; selectedAnswer: number; timeSpent: number }) => void;
}

const QuestionRenderer = ({ atom, onComplete }: QuestionRendererProps) => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [startTime] = useState(Date.now());

  console.log('🔍 QuestionRenderer atom:', {
    atomId: atom.atom_id,
    atomType: atom.atom_type,
    content: atom.content,
    contentKeys: Object.keys(atom.content || {})
  });

  // Handle different content structures from database vs AI generation
  const getQuestionData = () => {
    const content = atom.content as any;
    
    // Handle database format (multiple choice questions)
    if (content.question && content.options && Array.isArray(content.options)) {
      return {
        question: content.question,
        options: content.options,
        correctAnswer: content.correctAnswerIndex ?? content.correct ?? 0,
        explanation: content.explanation || 'Great work!'
      };
    }
    
    // Handle AI-generated format 
    if (content.question && content.options && Array.isArray(content.options)) {
      return {
        question: content.question,
        options: content.options,
        correctAnswer: content.correct ?? 0,
        explanation: content.explanation || 'Great work!'
      };
    }
    
    // Handle text explanation atoms
    if (content.text) {
      return {
        question: "Click continue to proceed with the lesson.",
        options: ["Continue"],
        correctAnswer: 0,
        explanation: content.text,
        isExplanation: true
      };
    }
    
    // Fallback for unknown formats
    console.error('❌ Unknown content format:', content);
    return {
      question: "Content format not supported",
      options: ["Continue"],
      correctAnswer: 0,
      explanation: "This content type is not yet supported."
    };
  };

  const questionData = getQuestionData();

  const handleAnswerSelect = (answerIndex: number) => {
    if (showResult) return;
    setSelectedAnswer(answerIndex);
  };

  const handleSubmit = () => {
    if (selectedAnswer === null) return;
    
    const timeSpent = Date.now() - startTime;
    const isCorrect = selectedAnswer === questionData.correctAnswer;
    
    setShowResult(true);
    
    // Auto-complete after showing result
    setTimeout(() => {
      onComplete({
        isCorrect,
        selectedAnswer,
        timeSpent
      });
    }, 3000);
  };

  useEffect(() => {
    // Auto-submit for explanation-type atoms
    if (questionData.isExplanation) {
      const timer = setTimeout(() => {
        onComplete({
          isCorrect: true,
          selectedAnswer: 0,
          timeSpent: Date.now() - startTime
        });
      }, 5000); // Give time to read the explanation

      return () => clearTimeout(timer);
    }
  }, [questionData.isExplanation, onComplete, startTime]);

  return (
    <div className="space-y-6">
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <span>{questionData.isExplanation ? "Learn" : "Question"}</span>
            <Clock className="w-5 h-5 text-blue-400" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-lg text-gray-200 leading-relaxed">
            {questionData.question}
          </div>

          {!questionData.isExplanation && (
            <div className="grid gap-3">
              {questionData.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={showResult}
                  className={`
                    p-4 text-left rounded-lg border transition-all duration-200
                    ${showResult
                      ? index === questionData.correctAnswer
                        ? 'bg-green-900 border-green-600 text-green-100'
                        : index === selectedAnswer && index !== questionData.correctAnswer
                        ? 'bg-red-900 border-red-600 text-red-100'
                        : 'bg-gray-700 border-gray-600 text-gray-300'
                      : selectedAnswer === index
                      ? 'bg-blue-900 border-blue-500 text-blue-100'
                      : 'bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600'
                    }
                  `}
                >
                  <div className="flex items-center justify-between">
                    <span>{option}</span>
                    {showResult && index === questionData.correctAnswer && (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    )}
                    {showResult && index === selectedAnswer && index !== questionData.correctAnswer && (
                      <XCircle className="w-5 h-5 text-red-400" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}

          {showResult && (
            <Card className={`${selectedAnswer === questionData.correctAnswer ? 'bg-green-900 border-green-600' : 'bg-blue-900 border-blue-600'}`}>
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  {selectedAnswer === questionData.correctAnswer ? (
                    <CheckCircle className="w-6 h-6 text-green-400 mt-0.5" />
                  ) : (
                    <CheckCircle className="w-6 h-6 text-blue-400 mt-0.5" />
                  )}
                  <div>
                    <h4 className={`font-semibold mb-2 ${selectedAnswer === questionData.correctAnswer ? 'text-green-100' : 'text-blue-100'}`}>
                      {selectedAnswer === questionData.correctAnswer ? 'Correct!' : 'Good try!'}
                    </h4>
                    <p className={`${selectedAnswer === questionData.correctAnswer ? 'text-green-200' : 'text-blue-200'}`}>
                      {questionData.explanation}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {!showResult && !questionData.isExplanation && (
            <Button
              onClick={handleSubmit}
              disabled={selectedAnswer === null}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              Submit Answer
            </Button>
          )}

          {questionData.isExplanation && (
            <div className="text-center text-gray-400 text-sm">
              Automatically continuing in a few seconds...
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default QuestionRenderer;
