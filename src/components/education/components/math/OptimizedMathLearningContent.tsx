
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Clock, Target, Brain } from 'lucide-react';
import { useOptimizedLessonManager } from '../hooks/useOptimizedLessonManager';
import OptimizedQuestionActivity from '../OptimizedQuestionActivity';
import NelieIntroduction from '../NelieIntroduction';

interface OptimizedMathLearningContentProps {
  onBackToProgram: () => void;
}

const OptimizedMathLearningContent = ({ onBackToProgram }: OptimizedMathLearningContentProps) => {
  const [showIntroduction, setShowIntroduction] = useState(true);

  const {
    currentActivityIndex,
    currentActivity,
    totalRealActivities,
    timeElapsed,
    score,
    correctStreak,
    targetLessonLength,
    isInitializing,
    handleActivityComplete,
    handleReadRequest,
    isSpeaking,
    stopSpeaking,
    toggleMute
  } = useOptimizedLessonManager({
    subject: 'mathematics',
    skillArea: 'general_math',
    onLessonComplete: onBackToProgram
  });

  const handleIntroductionComplete = () => {
    console.log('🎭 Introduction completed, starting optimized lesson');
    setShowIntroduction(false);
  };

  // Show introduction first
  if (showIntroduction) {
    return (
      <div className="container mx-auto px-4 py-6 space-y-6">
        <NelieIntroduction
          subject="mathematics"
          skillArea="general_math"
          onIntroductionComplete={handleIntroductionComplete}
        />
      </div>
    );
  }

  // Show loading state during initialization
  if (isInitializing) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-8 text-center">
            <Brain className="w-12 h-12 text-blue-400 animate-pulse mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Preparing Your Math Lesson</h3>
            <p className="text-gray-400">Setting up your personalized learning experience...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Header with corrected activity count */}
      <Card className="bg-gradient-to-r from-purple-900 to-blue-900 border-purple-400">
        <CardHeader>
          <div className="flex justify-between items-center">
            <Button
              variant="ghost"
              onClick={onBackToProgram}
              className="text-white hover:bg-white/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Program
            </Button>
            
            <div className="flex items-center space-x-6 text-white">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>{Math.floor(timeElapsed / 60)}:{(timeElapsed % 60).toString().padStart(2, '0')} / {targetLessonLength}:00</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Target className="w-4 h-4" />
                <span>Score: {score}</span>
              </div>
              
              {/* Corrected activity count - only real activities */}
              <div className="text-sm">
                Activity {currentActivityIndex + 1} of {totalRealActivities}
              </div>
            </div>
          </div>
          
          <CardTitle className="text-center text-white">
            Enhanced Mathematics Learning
            {correctStreak > 0 && (
              <span className="ml-2 text-green-400">🔥 {correctStreak} streak!</span>
            )}
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Control Panel */}
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-4">
          <div className="flex justify-center space-x-4">
            <Button
              variant="outline"
              onClick={toggleMute}
              className="border-purple-400 text-purple-200"
            >
              {isSpeaking ? 'Mute Nelie' : 'Unmute Nelie'}
            </Button>
            
            <Button
              variant="outline"
              onClick={handleReadRequest}
              className="border-blue-400 text-blue-200"
            >
              Read Content
            </Button>
            
            {isSpeaking && (
              <Button
                variant="outline"
                onClick={stopSpeaking}
                className="border-red-400 text-red-200"
              >
                Stop Speaking
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Current Activity Content */}
      {currentActivity ? (
        <div className="space-y-6">
          {currentActivity.type === 'interactive-game' ? (
            <OptimizedQuestionActivity
              subject="mathematics"
              skillArea="general_math"
              difficultyLevel={2}
              onComplete={handleActivityComplete}
              questionNumber={currentActivityIndex + 1}
              totalQuestions={totalRealActivities}
            />
          ) : (
            // Content delivery activities
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">{currentActivity.title}</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="text-gray-300 space-y-4">
                  {currentActivity.content?.text && (
                    <p className="text-lg leading-relaxed">{currentActivity.content.text}</p>
                  )}
                  
                  {currentActivity.content?.examples && (
                    <div className="bg-blue-900/30 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-200 mb-2">Examples:</h4>
                      <ul className="space-y-2">
                        {currentActivity.content.examples.map((example: string, index: number) => (
                          <li key={index} className="text-blue-100">• {example}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                
                <div className="mt-6 text-center">
                  <Button
                    onClick={() => handleActivityComplete()}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8"
                  >
                    Continue
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      ) : (
        <Card className="bg-red-900 border-red-700">
          <CardContent className="p-8 text-center">
            <h3 className="text-xl font-semibold text-white mb-2">No Content Available</h3>
            <p className="text-red-300">Please try refreshing the lesson.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default OptimizedMathLearningContent;
