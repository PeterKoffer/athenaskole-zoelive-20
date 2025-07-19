
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useUnifiedSpeech } from '@/hooks/useUnifiedSpeech';
import { UserMetadata } from '@/types/auth';
import ClassroomEnvironment from '../shared/ClassroomEnvironment';
import { getClassroomConfig } from '../shared/classroomConfigs';
import FunctionalMathScoreboard from './FunctionalMathScoreboard';
import AIGeneratedMathQuestion from './AIGeneratedMathQuestion';
import MathWelcomeMessage from './MathWelcomeMessage';

interface FullyFunctionalMathLearningProps {
  onBackToProgram: () => void;
}

const FullyFunctionalMathLearning = ({ onBackToProgram }: FullyFunctionalMathLearningProps) => {
  const { user } = useAuth();
  const { forceStopAll } = useUnifiedSpeech();
  const [showWelcome, setShowWelcome] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [correctStreak, setCorrectStreak] = useState(0);
  const [questionsCompleted, setQuestionsCompleted] = useState(0);
  
  const classroomConfig = getClassroomConfig("mathematics");
  const studentName = (user?.user_metadata as UserMetadata)?.first_name || 'Student';
  const totalQuestions = 6;

  // Timer for tracking session time
  useEffect(() => {
    if (!showWelcome) {
      const timer = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [showWelcome]);

  // Cleanup speech on unmount
  useEffect(() => {
    return () => {
      console.log('🔇 Stopping Nelie speech due to navigation away from math lesson');
      forceStopAll();
    };
  }, [forceStopAll]);

  const handleStartLesson = () => {
    console.log('🚀 Starting functional math lesson');
    setShowWelcome(false);
  };

  const handleBackToProgram = () => {
    console.log('🔇 Stopping speech before returning to program');
    forceStopAll();
    onBackToProgram();
  };

  const handleQuestionComplete = (wasCorrect: boolean) => {
    console.log('📝 Question completed:', { wasCorrect, currentIndex: currentQuestionIndex });
    
    setQuestionsCompleted(prev => prev + 1);
    
    if (wasCorrect) {
      setScore(prev => prev + 100);
      setCorrectStreak(prev => prev + 1);
    } else {
      setCorrectStreak(0);
    }

    // Move to next question after a brief delay
    setTimeout(() => {
      if (currentQuestionIndex < totalQuestions - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        // Session complete
        console.log('🎉 Math session completed!');
        setTimeout(() => {
          handleBackToProgram();
        }, 3000);
      }
    }, 2000);
  };

  if (showWelcome) {
    return (
      <ClassroomEnvironment config={classroomConfig}>
        <div className="min-h-screen flex items-center justify-center px-4">
          <MathWelcomeMessage
            studentName={studentName}
            onStartLesson={handleStartLesson}
          />
        </div>
      </ClassroomEnvironment>
    );
  }

  return (
    <ClassroomEnvironment config={classroomConfig}>
      <div className="min-h-screen py-4 px-2">
        {/* Functional Scoreboard */}
        <FunctionalMathScoreboard
          studentName={studentName}
          timeElapsed={timeElapsed}
          score={score}
          currentQuestionIndex={currentQuestionIndex}
          totalQuestions={totalQuestions}
          correctStreak={correctStreak}
          questionsCompleted={questionsCompleted}
          onBackToProgram={handleBackToProgram}
        />

        {/* AI Generated Math Content */}
        <div className="flex items-center justify-center mt-6">
          <div className="w-full max-w-4xl">
            <AIGeneratedMathQuestion
              questionNumber={currentQuestionIndex + 1}
              totalQuestions={totalQuestions}
              studentGrade={4}
              onQuestionComplete={handleQuestionComplete}
              key={currentQuestionIndex} // Force re-render for new questions
            />
          </div>
        </div>
      </div>
    </ClassroomEnvironment>
  );
};

export default FullyFunctionalMathLearning;
