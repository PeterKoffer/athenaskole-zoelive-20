
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calculator, ArrowLeft } from "lucide-react";
import LessonProgressTracker from "./components/LessonProgressTracker";
import LessonControlsCard from "./components/LessonControlsCard";
import LessonPhaseRenderer from "./components/LessonPhaseRenderer";
import { useLessonStateManager } from "./components/LessonStateManager";

const EnhancedMathematicsLearning = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const totalLessonTime = 20 * 60; // 20 minutes in seconds
  
  const {
    lessonState,
    handleLessonStart,
    handleLessonPause,
    handleLessonResume,
    handleLessonComplete
  } = useLessonStateManager();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  const handleBackToProgram = () => {
    navigate('/daily-program');
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
            onClick={handleBackToProgram}
            className="border-gray-600 text-white bg-gray-800 hover:bg-gray-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Program
          </Button>
          
          {lessonState.phase !== 'introduction' && (
            <LessonProgressTracker 
              currentTime={lessonState.timeSpent}
              totalTime={totalLessonTime}
              currentSegment={lessonState.currentSegment}
              totalSegments={lessonState.totalSegments}
              phase={lessonState.phase}
            />
          )}
        </div>

        {/* Lesson Controls */}
        {(lessonState.phase === 'lesson' || lessonState.phase === 'paused') && (
          <LessonControlsCard
            phase={lessonState.phase}
            onPause={handleLessonPause}
            onResume={handleLessonResume}
          />
        )}

        {/* Lesson Content */}
        <LessonPhaseRenderer
          lessonState={lessonState}
          onLessonStart={handleLessonStart}
          onLessonComplete={handleLessonComplete}
          onLessonResume={handleLessonResume}
          onBackToProgram={handleBackToProgram}
        />
      </div>
    </div>
  );
};

export default EnhancedMathematicsLearning;
