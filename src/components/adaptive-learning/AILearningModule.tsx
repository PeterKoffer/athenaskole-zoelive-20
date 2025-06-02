
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Brain, Clock, CheckCircle, XCircle } from 'lucide-react';
import { openaiContentService } from '@/services/openaiContentService';
import { useToast } from '@/hooks/use-toast';

interface AILearningModuleProps {
  subject: string;
  skillArea: string;
  onComplete: (score: number) => void;
}

interface Question {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  learningObjectives: string[];
  estimatedTime: number;
}

const AILearningModule = ({ subject, skillArea, onComplete }: AILearningModuleProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [question, setQuestion] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [startTime, setStartTime] = useState<Date | null>(null);

  useEffect(() => {
    if (user) {
      generateQuestion();
    }
  }, [user, subject, skillArea]);

  useEffect(() => {
    if (question && !showResult && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showResult) {
      handleSubmit();
    }
  }, [timeLeft, showResult, question]);

  const generateQuestion = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      console.log('🎯 Generating AI question for:', { subject, skillArea });
      
      const content = await openaiContentService.getOrGenerateContent(
        subject,
        skillArea,
        1, // Start with difficulty level 1
        user.id
      );

      console.log('📝 Generated content:', content);

      if (content && content.content) {
        const parsedContent = typeof content.content === 'string' 
          ? JSON.parse(content.content) 
          : content.content;

        const questionData: Question = {
          question: parsedContent.question || content.title || 'Sample question',
          options: parsedContent.options || ['Option A', 'Option B', 'Option C', 'Option D'],
          correct: parsedContent.correct || 0,
          explanation: parsedContent.explanation || 'This is the correct answer.',
          learningObjectives: content.learning_objectives || [],
          estimatedTime: content.estimated_time || 30
        };

        setQuestion(questionData);
        setTimeLeft(questionData.estimatedTime);
        setStartTime(new Date());
      } else {
        // Fallback question if AI generation fails
        const fallbackQuestion: Question = {
          question: `What is a key concept in ${skillArea} for ${subject}?`,
          options: ['Concept A', 'Concept B', 'Concept C', 'Concept D'],
          correct: 0,
          explanation: 'This is a sample explanation.',
          learningObjectives: [`Understanding ${skillArea} in ${subject}`],
          estimatedTime: 30
        };
        setQuestion(fallbackQuestion);
        setTimeLeft(30);
        setStartTime(new Date());
      }
    } catch (error) {
      console.error('❌ Error generating question:', error);
      toast({
        title: "Error",
        description: "Failed to generate question. Using sample content.",
        variant: "destructive"
      });

      // Use fallback question
      const fallbackQuestion: Question = {
        question: `Sample question for ${subject} - ${skillArea}`,
        options: ['Answer 1', 'Answer 2', 'Answer 3', 'Answer 4'],
        correct: 0,
        explanation: 'This is a sample question for demonstration.',
        learningObjectives: [`Learning ${skillArea}`],
        estimatedTime: 30
      };
      setQuestion(fallbackQuestion);
      setTimeLeft(30);
      setStartTime(new Date());
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerSelect = (index: number) => {
    if (!showResult) {
      setSelectedAnswer(index);
    }
  };

  const handleSubmit = () => {
    if (!question || !startTime) return;

    const responseTime = (new Date().getTime() - startTime.getTime()) / 1000;
    const isCorrect = selectedAnswer === question.correct;
    const score = isCorrect ? 100 : 0;

    setShowResult(true);

    // Calculate final score based on accuracy and time
    let finalScore = score;
    if (isCorrect && responseTime < question.estimatedTime * 0.5) {
      finalScore = Math.min(100, score + 10); // Bonus for quick correct answers
    }

    setTimeout(() => {
      onComplete(finalScore);
    }, 3000); // Show result for 3 seconds before completing
  };

  if (isLoading) {
    return (
      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="p-6">
          <div className="flex items-center justify-center space-x-2">
            <Brain className="w-6 h-6 text-lime-400 animate-pulse" />
            <span className="text-white">AI is generating your question...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!question) {
    return (
      <Card className="bg-red-900 border-red-700">
        <CardContent className="p-6 text-center text-white">
          <h3 className="text-lg font-semibold mb-2">Error Loading Question</h3>
          <p className="text-red-300">Failed to generate AI content.</p>
          <Button 
            onClick={generateQuestion}
            className="mt-4 bg-red-600 hover:bg-red-700"
          >
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Question Header */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-white">
            <span className="flex items-center space-x-2">
              <Brain className="w-5 h-5 text-lime-400" />
              <span>AI Generated Question</span>
            </span>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-300">{timeLeft}s</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={((question.estimatedTime - timeLeft) / question.estimatedTime) * 100} className="mb-4" />
          <h3 className="text-lg font-semibold text-white mb-4">{question.question}</h3>
          
          <div className="space-y-3">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                disabled={showResult}
                className={`w-full p-4 text-left rounded-lg border transition-all ${
                  selectedAnswer === index
                    ? showResult
                      ? index === question.correct
                        ? 'bg-green-600 border-green-500 text-white'
                        : 'bg-red-600 border-red-500 text-white'
                      : 'bg-lime-600 border-lime-500 text-white'
                    : showResult && index === question.correct
                    ? 'bg-green-600 border-green-500 text-white'
                    : 'bg-gray-800 border-gray-700 text-white hover:bg-gray-700'
                } ${showResult ? 'cursor-default' : 'cursor-pointer'}`}
              >
                <div className="flex items-center justify-between">
                  <span>{option}</span>
                  {showResult && (
                    <>
                      {index === question.correct && <CheckCircle className="w-5 h-5 text-green-300" />}
                      {selectedAnswer === index && index !== question.correct && (
                        <XCircle className="w-5 h-5 text-red-300" />
                      )}
                    </>
                  )}
                </div>
              </button>
            ))}
          </div>

          {!showResult && selectedAnswer !== null && (
            <Button 
              onClick={handleSubmit}
              className="w-full mt-4 bg-lime-400 hover:bg-lime-500 text-black"
            >
              Submit Answer
            </Button>
          )}

          {showResult && (
            <Card className="mt-4 bg-gray-800 border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 mb-2">
                  {selectedAnswer === question.correct ? (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-400" />
                  )}
                  <span className="font-semibold text-white">
                    {selectedAnswer === question.correct ? 'Correct!' : 'Incorrect'}
                  </span>
                </div>
                <p className="text-gray-300 text-sm">{question.explanation}</p>
                {question.learningObjectives.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs text-gray-400 mb-1">Learning Objectives:</p>
                    <div className="flex flex-wrap gap-1">
                      {question.learningObjectives.map((objective, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {objective}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AILearningModule;
