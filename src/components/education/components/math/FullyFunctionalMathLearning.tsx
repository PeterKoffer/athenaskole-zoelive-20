
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
  const { forceStopAll, speakAsNelie, isEnabled, enableUserInteraction } = useUnifiedSpeech();
  const [showWelcome, setShowWelcome] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [correctStreak, setCorrectStreak] = useState(0);
  const [questionsCompleted, setQuestionsCompleted] = useState(0);
  const [hasWelcomed, setHasWelcomed] = useState(false);
  
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

  // Welcome message when lesson starts
  useEffect(() => {
    if (!showWelcome && !hasWelcomed && isEnabled) {
      setTimeout(() => {
        speakAsNelie(
          `Hello ${studentName}! I'm Nelie, your AI math tutor! I'm so excited to work on these math problems with you today. Let's make learning fun and engaging! Remember, I'm here to help you every step of the way.`,
          true,
          'math-welcome'
        );
        setHasWelcomed(true);
      }, 1500);
    }
  }, [showWelcome, hasWelcomed, isEnabled, speakAsNelie, studentName]);

  const handleStartLesson = () => {
    console.log('🚀 Starting functional math lesson');
    if (!isEnabled) {
      enableUserInteraction();
    }
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
      
      // Nelie celebration for correct answers
      if (isEnabled) {
        const celebrations = [
          "Excellent work! That's exactly right!",
          "Perfect! You nailed that one!",
          "Outstanding! You're really getting the hang of this!",
          "Brilliant! That was a great solution!",
          "Fantastic! You're becoming a math expert!"
        ];
        const celebration = celebrations[Math.floor(Math.random() * celebrations.length)];
        
        setTimeout(() => {
          speakAsNelie(celebration, true, 'correct-answer-celebration');
        }, 1000);
      }
    } else {
      setCorrectStreak(0);
      
      // Nelie encouragement for incorrect answers
      if (isEnabled) {
        const encouragements = [
          "That's okay! Mistakes help us learn. Let's keep trying!",
          "Good effort! Every attempt makes you stronger at math!",
          "Don't worry! Learning takes practice. You're doing great!",
          "Nice try! Let's learn from this and move forward!",
          "That's part of learning! You're building your math skills!"
        ];
        const encouragement = encouragements[Math.floor(Math.random() * encouragements.length)];
        
        setTimeout(() => {
          speakAsNelie(encouragement, true, 'incorrect-answer-encouragement');
        }, 1000);
      }
    }

    // Move to next question after a brief delay
    setTimeout(() => {
      if (currentQuestionIndex < totalQuestions - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        // Session complete
        console.log('🎉 Math session completed!');
        if (isEnabled) {
          setTimeout(() => {
            speakAsNelie(
              `Congratulations ${studentName}! You've completed all ${totalQuestions} questions! Your final score is ${score + (wasCorrect ? 100 : 0)} points. You should be proud of your hard work today!`,
              true,
              'session-complete'
            );
          }, 1500);
        }
        
        setTimeout(() => {
          handleBackToProgram();
        }, 5000);
      }
    }, 2500);
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
        <div className="flex items-center justify-center">
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
