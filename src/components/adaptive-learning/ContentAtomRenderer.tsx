
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, CheckCircle, XCircle, BookOpen } from 'lucide-react';
import { ContentAtom } from '@/types/content';

interface ContentAtomRendererProps {
  atom: ContentAtom;
  onComplete: (result: { isCorrect: boolean; selectedAnswer: number; timeSpent: number }) => void;
}

const ContentAtomRenderer = ({ atom, onComplete }: ContentAtomRendererProps) => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [startTime] = useState(Date.now());

  console.log('🔍 ContentAtomRenderer atom:', {
    atomId: atom.atom_id,
    atomType: atom.atom_type,
    content: atom.content,
    contentKeys: Object.keys(atom.content || {})
  });

  // Auto-complete explanation atoms after 5 seconds - moved to useEffect with dependency
  useEffect(() => {
    if (atom.atom_type === 'TEXT_EXPLANATION') {
      const timer = setTimeout(() => {
        onComplete({
          isCorrect: true,
          selectedAnswer: 0,
          timeSpent: Date.now() - startTime
        });
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [atom.atom_type, onComplete, startTime]);

  // Handle TEXT_EXPLANATION atoms
  if (atom.atom_type === 'TEXT_EXPLANATION') {
    const content = atom.content as { 
      title?: string; 
      explanation?: string; 
      examples?: string[];
    };

    return (
      <div className="space-y-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              <span className="flex items-center">
                <BookOpen className="w-5 h-5 mr-2 text-green-400" />
                {content.title || 'Learn'}
              </span>
              <Clock className="w-5 h-5 text-blue-400" />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {content.explanation && (
              <div className="text-lg text-gray-200 leading-relaxed">
                {content.explanation}
              </div>
            )}
            
            {content.examples && Array.isArray(content.examples) && content.examples.length > 0 && (
              <div className="bg-blue-900/30 rounded-lg p-4">
                <h4 className="font-semibold text-blue-200 mb-3">Examples:</h4>
                <ul className="space-y-2">
                  {content.examples.map((example, index) => (
                    <li key={`example-${index}-${atom.atom_id}`} className="text-blue-100 flex items-center">
                      <span className="text-blue-400 mr-2">•</span>
                      {String(example)}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="text-center">
              <div className="text-gray-400 text-sm mb-4">
                Automatically continuing in a few seconds...
              </div>
              <Button
                onClick={() => onComplete({
                  isCorrect: true,
                  selectedAnswer: 0,
                  timeSpent: Date.now() - startTime
                })}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Continue
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Handle QUESTION_MULTIPLE_CHOICE atoms
  if (atom.atom_type === 'QUESTION_MULTIPLE_CHOICE') {
    const content = atom.content as {
      question?: string;
      options?: string[];
      correctAnswer?: number;
      correct?: number;
      correctFeedback?: string;
      generalIncorrectFeedback?: string;
      explanation?: string;
    };
    
    // Safely extract question data with fallbacks
    const questionData = {
      question: content.question || 'Question not available',
      options: Array.isArray(content.options) ? content.options : ['Continue'],
      correctAnswer: content.correctAnswer ?? content.correct ?? 0,
      explanation: content.correctFeedback || content.generalIncorrectFeedback || content.explanation || 'Great work!'
    };

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

    return (
      <div className="space-y-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              <span>Question</span>
              <Clock className="w-5 h-5 text-blue-400" />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-lg text-gray-200 leading-relaxed">
              {questionData.question}
            </div>

            <div className="grid gap-3">
              {questionData.options.map((option, index) => (
                <button
                  key={`option-${index}-${atom.atom_id}`}
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
                    <span>{String(option)}</span>
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

            {!showResult && (
              <Button
                onClick={handleSubmit}
                disabled={selectedAnswer === null}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                Submit Answer
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Fallback for unknown atom types
  return (
    <div className="space-y-6">
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <span>Content</span>
            <Clock className="w-5 h-5 text-orange-400" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-lg text-gray-200 leading-relaxed">
            Content type "{atom.atom_type}" is not yet supported.
          </div>
          
          <div className="text-center">
            <Button
              onClick={() => onComplete({
                isCorrect: true,
                selectedAnswer: 0,
                timeSpent: Date.now() - startTime
              })}
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              Continue
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContentAtomRenderer;
