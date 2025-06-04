
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calculator, Play, Pause, ArrowLeft } from "lucide-react";
import NelieIntroduction from "./components/NelieIntroduction";
import InteractiveLessonSession from "./components/InteractiveLessonSession";
import LessonProgressTracker from "./components/LessonProgressTracker";

interface LessonState {
  phase: 'introduction' | 'interactive' | 'paused' | 'completed';
  timeSpent: number;
  currentSegment: number;
  totalSegments: number;
  canResume: boolean;
}

const EnhancedMathematicsLearning = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  
  const [lessonState, setLessonState] = useState<LessonState>({
    phase: 'introduction',
    timeSpent: 0,
    currentSegment: 1,
    totalSegments: 5,
    canResume: false
  });

  const totalLessonTime = 25 * 60; // 25 minutes in seconds

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  const handleLessonStart = () => {
    setLessonState(prev => ({ ...prev, phase: 'interactive' }));
  };

  const handleLessonPause = () => {
    setLessonState(prev => ({ 
      ...prev, 
      phase: 'paused',
      canResume: true 
    }));
  };

  const handleLessonResume = () => {
    setLessonState(prev => ({ ...prev, phase: 'interactive' }));
  };

  const handleLessonComplete = () => {
    setLessonState(prev => ({ ...prev, phase: 'completed' }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <Calculator className="w-16 h-16 text-lime-400 mx-auto mb-4 animate-pulse" />
          <p className="text-lg">Loading your Mathematics lesson with Nelie...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header with navigation and progress */}
        <div className="flex items-center justify-between mb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate('/daily-program')}
            className="border-gray-600 text-white bg-gray-800 hover:bg-gray-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Program
          </Button>
          
          <LessonProgressTracker 
            currentTime={lessonState.timeSpent}
            totalTime={totalLessonTime}
            currentSegment={lessonState.currentSegment}
            totalSegments={lessonState.totalSegments}
            phase={lessonState.phase}
          />
        </div>

        {/* Lesson Controls */}
        {(lessonState.phase === 'interactive' || lessonState.phase === 'paused') && (
          <Card className="bg-gray-800 border-gray-700 mb-6">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="text-white">
                <p className="font-semibold">Mathematics Lesson with Nelie</p>
                <p className="text-sm text-gray-400">
                  Time remaining: {Math.floor((totalLessonTime - lessonState.timeSpent) / 60)} minutes
                </p>
              </div>
              <div className="flex space-x-2">
                {lessonState.phase === 'interactive' ? (
                  <Button onClick={handleLessonPause} variant="outline" size="sm">
                    <Pause className="w-4 h-4 mr-2" />
                    Pause Lesson
                  </Button>
                ) : (
                  <Button onClick={handleLessonResume} className="bg-green-600 hover:bg-green-700" size="sm">
                    <Play className="w-4 h-4 mr-2" />
                    Resume Lesson
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Lesson Content */}
        {lessonState.phase === 'introduction' && (
          <NelieIntroduction 
            subject="mathematics"
            skillArea="arithmetic"
            onIntroductionComplete={handleLessonStart}
          />
        )}

        {lessonState.phase === 'interactive' && (
          <InteractiveLessonSession 
            subject="mathematics"
            skillArea="arithmetic"
            lessonState={lessonState}
            onStateUpdate={setLessonState}
            onLessonComplete={handleLessonComplete}
          />
        )}

        {lessonState.phase === 'paused' && (
          <Card className="bg-yellow-900 border-yellow-600">
            <CardContent className="p-8 text-center">
              <Pause className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-4">Lesson Paused</h2>
              <p className="text-yellow-200 mb-6">
                Your progress has been saved. You can resume this lesson anytime.
              </p>
              <div className="flex justify-center space-x-4">
                <Button onClick={handleLessonResume} className="bg-green-600 hover:bg-green-700">
                  <Play className="w-4 h-4 mr-2" />
                  Resume Lesson
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/daily-program')}
                  className="border-gray-600 text-white"
                >
                  Back to Program
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {lessonState.phase === 'completed' && (
          <Card className="bg-green-900 border-green-600">
            <CardContent className="p-8 text-center">
              <Calculator className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-4">Lesson Complete!</h2>
              <p className="text-green-200 mb-6">
                Great job! You've completed your Mathematics lesson with Nelie.
              </p>
              <Button 
                onClick={() => navigate('/daily-program')}
                className="bg-green-600 hover:bg-green-700"
              >
                Back to Program
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default EnhancedMathematicsLearning;
