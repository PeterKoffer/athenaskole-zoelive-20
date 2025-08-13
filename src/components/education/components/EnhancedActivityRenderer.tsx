
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Play, Brain, Target } from 'lucide-react';
import { LessonActivity } from './types/LessonTypes';
import TrainingGroundActivityRenderer from './TrainingGroundActivityRenderer';
import TextWithSpeaker from '@/components/education/components/shared/TextWithSpeaker';
import DevRegenerateButton from '@/components/dev/DevRegenerateButton';
import { emitInterest, InterestTag } from '@/services/interestSignals';
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
  onActivityComplete
}) => {
  // Handle Training Ground activities first
  if (activity.type === 'training-ground-activity' && activity.content.trainingGroundData) {
    return (
      <TrainingGroundActivityRenderer
        activity={activity as any} // Type assertion for Training Ground specific type
        onComplete={(success) => {
          if (onActivityComplete) {
            onActivityComplete(success);
          }
          if (onComplete) {
            onComplete(success ? 10 : 0);
          }
        }}
      />
    );
  }

  // Handle regular activities
  const [selectedAnswer, setSelectedAnswer] = React.useState<number | null>(null);
  const [showResult, setShowResult] = React.useState(false);
  const [isCompleted, setIsCompleted] = React.useState(false);


  const getCorrectAnswer = React.useCallback(() => {
    const c = (activity as any).content || {};
    if (typeof c.correctAnswer === 'number') return c.correctAnswer;
    if (typeof c.correctIndex === 'number') return c.correctIndex;
    if (typeof c.correct === 'number') return c.correct;
    return -1;
  }, [activity]);

  const getOptions = React.useCallback(() => {
    const c = (activity as any).content || {};
    return c.options || c.choices || [];
  }, [activity]);

  const handleAnswerSelect = (answerIndex: number) => {
    console.log('🎯 Answer selected:', { answerIndex, showResult, isCompleted });
    if (showResult || isCompleted) {
      console.log('🚫 Answer selection blocked:', { showResult, isCompleted });
      return;
    }
    
    setSelectedAnswer(answerIndex);
    setShowResult(true);
    
    const correctIdx = getCorrectAnswer();
    const isCorrect = answerIndex === correctIdx;
    const points = isCorrect ? 10 : 0;
    
    console.log('✅ Answer processed:', { answerIndex, correctIdx, isCorrect, points });
    
    // Emit interest signals based on engagement
    const activityTags = (activity as any).tags || [];
    if (activityTags.length > 0) {
      const weight = isCorrect ? 2 : 1; // Higher weight for correct answers
      activityTags.forEach((tag: string) => {
        if (tag as InterestTag) {
          emitInterest(tag as InterestTag, weight, 'answer');
        }
      });
    }
    
    // Show result immediately, then auto-advance after delay
    setTimeout(() => {
      if (isCompleted) return; // Prevent double completion
      
      setIsCompleted(true);
      if (onComplete) {
        onComplete(points);
      }
      if (onActivityComplete) {
        onActivityComplete(isCorrect);
      }
    }, 3000); // Increased delay to give user time to read feedback
  };

  const handleContinue = () => {
    if (isCompleted) return; // Prevent double completion
    
    setIsCompleted(true);
    if (onComplete) {
      onComplete(0);
    }
    if (onActivityComplete) {
      onActivityComplete(true);
    }
  };

  const renderContent = () => {
    const typeKey = (activity as any).type as string;
    switch (typeKey) {
      case 'introduction':
        return (
          <div className="space-y-4">
            <TextWithSpeaker
              text={activity.content.hook || activity.content.text || activity.content.description || activity.content.instructions || activity.content.message || activity.title || ''}
              context={`activity-${activity.id}-introduction`}
              position="corner"
              className="group"
            >
              <p className="text-gray-300 text-lg leading-relaxed">
                {activity.content.hook || activity.content.text || activity.content.description || activity.content.instructions || activity.content.message || activity.title || 'Content is preparing...'}
              </p>
            </TextWithSpeaker>
            <Button 
              onClick={handleContinue}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Continue Learning
            </Button>
          </div>
        );

      case 'content-delivery':
        // Don't show explanations that start with "Option A is correct" - these should only appear after questions
        const contentText = activity.content.segments?.[0]?.explanation || activity.content.explanation || activity.content.text || activity.content.description || activity.content.instructions || activity.title || '';
        
        // Skip content that looks like an answer explanation without a question
        if (contentText.toLowerCase().includes('option') && contentText.toLowerCase().includes('correct') && !activity.content.question) {
          console.log('🚫 Skipping answer explanation without question:', contentText.substring(0, 50));
          setTimeout(() => handleContinue(), 100); // Auto-skip
          return (
            <div className="space-y-4">
              <p className="text-muted-foreground text-center">Moving to next activity...</p>
            </div>
          );
        }
        
        return (
          <div className="space-y-4">
            <TextWithSpeaker
              text={contentText}
              context={`activity-${activity.id}-content`}
              position="corner"
              className="group"
            >
              <p className="text-gray-300 text-lg leading-relaxed">
                {contentText}
              </p>
            </TextWithSpeaker>
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
      case 'problem-solving':
      case 'critical-thinking':
        return (
          <div className="space-y-6">
            <TextWithSpeaker
              text={activity.content.question || ''}
              context={`activity-${activity.id}-question`}
              position="corner"
              className="group"
            >
              <h3 className="text-xl font-semibold text-white mb-4">
                {activity.content.question || 'Answer the question'}
              </h3>
            </TextWithSpeaker>
            
            {(() => {
              const options = getOptions();
              const correctIdx = getCorrectAnswer();

              if (!options || options.length === 0) {
                console.log('⚠️ No options found for interactive activity:', activity);
                return (
                  <div className="mt-4 p-4 bg-gray-800 rounded-lg space-y-4">
                    <p className="text-gray-300">
                      No question options available. This might be an explanation that should appear after a question.
                    </p>
                    <Button 
                      onClick={handleContinue}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                      disabled={isCompleted}
                    >
                      Continue
                    </Button>
                  </div>
                );
              }

              return (
                <div className="grid gap-3">
                  {options.map((option: string, index: number) => {
                    const clean = String(option ?? '')
                      .replace(/^[A-D][)\.]+\s*/i, '')
                      .replace(/^\d+[)\.]+\s*/, '')
                      .trim();
                    return (
                      <Button
                        key={index}
                        onClick={() => handleAnswerSelect(index)}
                        disabled={showResult || isCompleted}
                        variant={selectedAnswer === index ? "default" : "outline"}
                        className={`p-4 text-left justify-start h-auto transition-all hover:scale-[1.02] ${
                          showResult && index === correctIdx
                            ? 'bg-green-600 border-green-500 text-white'
                            : showResult && selectedAnswer === index && index !== correctIdx
                            ? 'bg-red-600 border-red-500 text-white'
                            : selectedAnswer === index
                            ? 'bg-blue-600 border-blue-500 text-white'
                            : 'bg-gray-700 hover:bg-gray-600 text-gray-300 border-gray-600 hover:border-gray-500'
                        }`}
                      >
                        <span className="mr-3 font-bold">{String.fromCharCode(65 + index)}.</span>
                        {clean}
                      </Button>
                    );
                  })}

                </div>
              );
            })()}

            {showResult && (
              <div className="mt-4 p-4 bg-gray-800 rounded-lg space-y-4 border border-gray-700">
                <div className="flex items-start gap-3">
                  {selectedAnswer === getCorrectAnswer() ? (
                    <div className="text-green-400 text-lg">✅</div>
                  ) : (
                    <div className="text-red-400 text-lg">❌</div>
                  )}
                  <div>
                    <p className="font-medium text-white mb-2">
                      {selectedAnswer === getCorrectAnswer() ? 'Correct!' : 'Not quite right.'}
                    </p>
                    <p className="text-gray-300">
                      {activity.content.explanation || 'Good attempt! Let\'s move on to the next activity.'}
                    </p>
                  </div>
                </div>
                <Button 
                  onClick={handleContinue}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={isCompleted}
                >
                  Continue to Next Activity
                </Button>
              </div>
            )}
          </div>
        );

      case 'creative-exploration':
      case 'creative-exercise':
        return (
          <div className="space-y-4">
            <TextWithSpeaker
              text={activity.content.creativePrompt || activity.content.text || activity.content.description || activity.content.instructions || activity.title || ''}
              context={`activity-${activity.id}-creative`}
              position="corner"
              className="group"
            >
              <p className="text-gray-300 text-lg">
                {activity.content.creativePrompt || activity.content.text || activity.content.description || activity.content.instructions || activity.title || 'Content is preparing...'}
              </p>
            </TextWithSpeaker>
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
      case 'real-world-application':
        return (
          <div className="space-y-4">
            <TextWithSpeaker
              text={activity.content.scenario || activity.content.text || activity.content.description || activity.content.instructions || activity.title || ''}
              context={`activity-${activity.id}-application`}
              position="corner"
              className="group"
            >
              <p className="text-gray-300 text-lg">
                {activity.content.scenario || activity.content.text || activity.content.description || activity.content.instructions || activity.title || 'Content is preparing...'}
              </p>
            </TextWithSpeaker>
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
                  <TextWithSpeaker text={takeaway} context={`activity-${activity.id}-takeaway-${index}`} position="corner" className="group">
                    <p className="text-gray-300">{takeaway}</p>
                  </TextWithSpeaker>
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
            <TextWithSpeaker
              text={activity.content.simulationDescription || activity.content.text || activity.content.description || activity.content.instructions || activity.title || ''}
              context={`activity-${activity.id}-simulation`}
              position="corner"
              className="group"
            >
              <p className="text-gray-300 text-lg">
                {activity.content.simulationDescription || activity.content.text || activity.content.description || activity.content.instructions || activity.title || 'Content is preparing...'}
              </p>
            </TextWithSpeaker>
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
            <TextWithSpeaker
              text={activity.content.text || activity.content.description || activity.content.instructions || activity.title || 'Content is preparing...'}
              context={`activity-${activity.id}-default`}
              position="corner"
              className="group"
            >
              <p className="text-gray-300 text-lg">
                {activity.content.text || activity.content.description || activity.content.instructions || 'Content not available'}
              </p>
            </TextWithSpeaker>
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
    <Card className="bg-gray-900 border-gray-700 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-gray-800 to-gray-700">
        <div className="flex items-center gap-3">
          <CardTitle className="text-white text-xl">{activity.title}</CardTitle>
          {import.meta.env.DEV && (activity as any)?.metadata?.slotId && (
            <DevRegenerateButton slotId={(activity as any).metadata.slotId} />
          )}
        </div>
      </CardHeader>
      <CardContent className="p-6 bg-gray-900">
        {renderContent()}
      </CardContent>
    </Card>
  );
};

export default EnhancedActivityRenderer;
