
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUnifiedSpeech } from '@/hooks/useUnifiedSpeech';
import OptimizedMathLearningContent from "./components/math/OptimizedMathLearningContent";

const EnhancedMathematicsLearning = () => {
  const navigate = useNavigate();
  const { stop: stopSpeaking } = useUnifiedSpeech();
  
  // Stop speech when component unmounts (navigating away)
  useEffect(() => {
    return () => {
      console.log('🔇 Stopping Nelie speech due to navigation away from math lesson');
      stopSpeaking();
    };
  }, [stopSpeaking]);
  
  const handleBackToProgram = () => {
    console.log('🔇 Stopping Nelie speech before navigating back to program');
    stopSpeaking();
    navigate('/daily-program');
  };

  return (
    <OptimizedMathLearningContent onBackToProgram={handleBackToProgram} />
  );
};

export default EnhancedMathematicsLearning;
