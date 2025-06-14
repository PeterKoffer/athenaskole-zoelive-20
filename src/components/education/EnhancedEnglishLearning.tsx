
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUnifiedSpeech } from '@/hooks/useUnifiedSpeech';
import OptimizedEnglishLearningContent from "./components/english/OptimizedEnglishLearningContent";

const EnhancedEnglishLearning = () => {
  const navigate = useNavigate();
  const { stop: stopSpeaking } = useUnifiedSpeech();
  
  // Stop speech when component unmounts (navigating away)
  useEffect(() => {
    return () => {
      console.log('🔇 Stopping Nelie speech due to navigation away from English lesson');
      stopSpeaking();
    };
  }, [stopSpeaking]);
  
  const handleBackToProgram = () => {
    console.log('🔇 Stopping Nelie speech before navigating back to program');
    stopSpeaking();
    navigate('/daily-program');
  };

  return (
    <OptimizedEnglishLearningContent onBackToProgram={handleBackToProgram} />
  );
};

export default EnhancedEnglishLearning;
