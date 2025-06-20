
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Play, Brain, Target } from 'lucide-react';
import { LessonActivity } from './types/LessonTypes';

interface EnhancedActivityRendererProps {
  activity: LessonActivity;
  onComplete?: (score: number) => void;
  onActivityComplete?: (wasCorrect?: boolean) => void;
  score?: number;
  isNelieReady?: boolean;
}

const EnhancedActivityRenderer: React.FC<EnhancedActivityRendererProps> = ({
  activity,
  onComplete,
  onActivityComplete,
  score = 0,
  isNelieReady = true
}) => {
  const [selectedAnswer, setSelectedAnswer] = React.useState<number | null>(null);
  const [showResult, setShowResult] = React.useState(false);

  const handleAnswerSelect = (answerIndex: number) => {
    if (showResult) return;
    
    setSelectedAnswer(answerIndex);
    setShowResult(true);
    
    const isCorrect = answerIndex === activity.content.correctAnswer;
    const points = isCorrect ? 10 : 0;
    
    setTimeout(() => {
      if (onComplete) {
        onComplete(points);
      }
      if (onActivityComplete) {
        onActivityComplete(isCorrect);
      }
    }, 2000);
  };

  const handleContinue = () => {
    if (onComplete) {
      onComplete(0);
    }
    if (onActivityComplete) {
      onActivityComplete(true);
    }
  };

  const renderContent = () => {
    switch (activity.type) {
      case 'introduction':
        return (
          <div className="space-y-4">
            <p className="text-gray-300 text-lg leading-relaxed">
              {activity.content.hook || activity.content.text}
            </p>
            <Button 
              onClick={handleContinue}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Continue Learning
            </Button>
          </div>
        );

      case 'content-delivery':
        return (
          <div className="space-y-4">
            <p className="text-gray-300 text-lg leading-relaxed">
              {activity.content.segments?.[0]?.explanation || activity.content.text}
            </p>
            <Button 
              onClick={handleContinue}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Continue Learning
            </Button>
          </div>
        );

      case 'interactive-game':
      case 'quiz':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white mb-4">
              {activity.content.question}
            </h3>
            
            <div className="grid gap-3">
              {activity.content.options?.map((option, index) => (
                <Button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={showResult}
                  variant={selectedAnswer === index ? "default" : "outline"}
                  className={`p-4 text-left justify-start h-auto ${
                    showResult && index === activity.content.correctAnswer
                      ? 'bg-green-600 border-green-500'
                      : showResult && selectedAnswer === index && index !== activity.content.correctAnswer
                      ? 'bg-red-600 border-red-500'
                      : ''
                  }`}
                >
                  <span className="mr-3 font-bold">{String.fromCharCode(65 + index)}.</span>
                  {option}
                </Button>
              ))}
            </div>

            {showResult && (
              <div className="mt-4 p-4 bg-gray-800 rounded-lg">
                <p className="text-gray-300">
                  {activity.content.explanation}
                </p>
              </div>
            )}
          </div>
        );

      case 'creative-exploration':
        return (
          <div className="space-y-4">
            <p className="text-gray-300 text-lg">
              {activity.content.creativePrompt || activity.content.text}
            </p>
            <div className="bg-gray-800 p-4 rounded-lg">
              <p className="text-gray-400 italic">
                Think about this scenario and be creative with your response!
              </p>
            </div>
            <Button 
              onClick={handleContinue}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              <Brain className="w-4 h-4 mr-2" />
              Continue Exploring
            </Button>
          </div>
        );

      case 'application':
        return (
          <div className="space-y-4">
            <p className="text-gray-300 text-lg">
              {activity.content.scenario || activity.content.text}
            </p>
            <div className="bg-gray-800 p-4 rounded-lg">
              <p className="text-gray-400">
                Apply what you've learned to solve this real-world scenario.
              </p>
            </div>
            <Button 
              onClick={handleContinue}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Target className="w-4 h-4 mr-2" />
              Complete Application
            </Button>
          </div>
        );

      case 'summary':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              {activity.content.keyTakeaways?.map((takeaway, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-300">{takeaway}</p>
                </div>
              ))}
            </div>
            <Button 
              onClick={handleContinue}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Complete Lesson
            </Button>
          </div>
        );

      case 'simulation':
        return (
          <div className="space-y-4">
            <p className="text-gray-300 text-lg">
              {activity.content.simulationDescription || activity.content.text}
            </p>
            <div className="bg-gray-800 p-4 rounded-lg">
              <p className="text-gray-400 italic">
                Interactive simulation experience
              </p>
            </div>
            <Button 
              onClick={handleContinue}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              <Play className="w-4 h-4 mr-2" />
              Complete Simulation
            </Button>
          </div>
        );

      default:
        return (
          <div className="space-y-4">
            <p className="text-gray-300 text-lg">
              {activity.content.text || 'Content not available'}
            </p>
            <Button 
              onClick={handleContinue}
              className="bg-gray-600 hover:bg-gray-700 text-white"
            >
              Continue
            </Button>
          </div>
        );
    }
  };

  return (
    <Card className="bg-gray-900 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center space-x-2">
          <span>{activity.title}</span>
          <span className="text-sm text-gray-400">({activity.duration} min)</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {renderContent()}
      </CardContent>
    </Card>
  );
};

export default EnhancedActivityRenderer;
