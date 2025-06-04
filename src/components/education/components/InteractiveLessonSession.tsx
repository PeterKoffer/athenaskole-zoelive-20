
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Brain, Clock, Star } from 'lucide-react';
import RobotAvatar from '@/components/ai-tutor/RobotAvatar';
import NelieExplanationDemo from './NelieExplanationDemo';
import EnhancedQuestionDisplay from './EnhancedQuestionDisplay';

interface LessonState {
  phase: 'introduction' | 'interactive' | 'paused' | 'completed';
  timeSpent: number;
  currentSegment: number;
  totalSegments: number;
  canResume: boolean;
}

interface InteractiveLessonSessionProps {
  subject: string;
  skillArea: string;
  lessonState: LessonState;
  onStateUpdate: (state: LessonState) => void;
  onLessonComplete: () => void;
}

const InteractiveLessonSession = ({ 
  subject, 
  skillArea, 
  lessonState, 
  onStateUpdate, 
  onLessonComplete 
}: InteractiveLessonSessionProps) => {
  const [currentActivity, setCurrentActivity] = useState<'demo' | 'practice' | 'game'>('demo');
  const [questionsCompleted, setQuestionsCompleted] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);

  const totalQuestions = 8; // Spread across 25 minutes
  const segmentActivities = [
    { type: 'demo', name: 'Nelie\'s Demonstration', duration: 5 },
    { type: 'practice', name: 'Guided Practice', duration: 8 },
    { type: 'game', name: 'Interactive Game', duration: 5 },
    { type: 'practice', name: 'Independent Practice', duration: 5 },
    { type: 'review', name: 'Lesson Review', duration: 2 }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      onStateUpdate({
        ...lessonState,
        timeSpent: lessonState.timeSpent + 1
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [lessonState, onStateUpdate]);

  const handleQuestionComplete = (isCorrect: boolean) => {
    setQuestionsCompleted(prev => prev + 1);
    if (isCorrect) {
      setCorrectAnswers(prev => prev + 1);
    }

    // Check if we should move to next segment
    if (questionsCompleted >= 2 && lessonState.currentSegment < lessonState.totalSegments) {
      onStateUpdate({
        ...lessonState,
        currentSegment: lessonState.currentSegment + 1
      });
      
      // Change activity based on segment
      const nextActivity = segmentActivities[lessonState.currentSegment]?.type as 'demo' | 'practice' | 'game';
      if (nextActivity) {
        setCurrentActivity(nextActivity);
      }
    }

    // Check if lesson is complete
    if (questionsCompleted >= totalQuestions - 1) {
      onLessonComplete();
    }
  };

  const accuracy = questionsCompleted > 0 ? Math.round((correctAnswers / questionsCompleted) * 100) : 0;
  const progressPercentage = (questionsCompleted / totalQuestions) * 100;

  return (
    <div className="space-y-6">
      {/* Session Header */}
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <RobotAvatar size="lg" isActive={true} isSpeaking={false} />
              <div>
                <h2 className="text-xl font-bold text-white">
                  {segmentActivities[lessonState.currentSegment - 1]?.name || 'Interactive Learning'}
                </h2>
                <p className="text-gray-400">Segment {lessonState.currentSegment} of {lessonState.totalSegments}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 text-white">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-blue-400" />
                <span>{Math.floor(lessonState.timeSpent / 60)}:{(lessonState.timeSpent % 60).toString().padStart(2, '0')}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Brain className="w-4 h-4 text-green-400" />
                <span>{questionsCompleted}/{totalQuestions}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="w-4 h-4 text-yellow-400" />
                <span>{accuracy}%</span>
              </div>
            </div>
          </div>
          
          <Progress value={progressPercentage} className="w-full" />
        </CardContent>
      </Card>

      {/* Activity Content */}
      {currentActivity === 'demo' && (
        <NelieExplanationDemo 
          subject={subject}
          skillArea={skillArea}
          onDemoComplete={() => setCurrentActivity('practice')}
        />
      )}

      {(currentActivity === 'practice' || currentActivity === 'game') && (
        <EnhancedQuestionDisplay
          subject={subject}
          skillArea={skillArea}
          questionNumber={questionsCompleted + 1}
          totalQuestions={totalQuestions}
          isGameMode={currentActivity === 'game'}
          onQuestionComplete={handleQuestionComplete}
          showNelieGuidance={true}
        />
      )}
    </div>
  );
};

export default InteractiveLessonSession;
