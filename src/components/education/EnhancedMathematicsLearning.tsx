
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUnifiedSpeech } from '@/hooks/useUnifiedSpeech';
import OptimizedMathLearningContent from "./components/math/OptimizedMathLearningContent";

const EnhancedMathematicsLearning = () => {
  const navigate = useNavigate();
  const { forceStopAll } = useUnifiedSpeech();
  
  // Stop speech when component unmounts (navigating away)
  useEffect(() => {
    return () => {
      console.log('🔇 Stopping Nelie speech due to navigation away from math lesson');
      forceStopAll();
    };
  }, [forceStopAll]);
  
  const handleBackToProgram = () => {
    console.log('🔇 Stopping Nelie speech before navigating back to program');
    forceStopAll();
    navigate('/daily-program');
  };

  return (
    <OptimizedMathLearningContent onBackToProgram={handleBackToProgram} />
  );
};

export default EnhancedMathematicsLearning;
