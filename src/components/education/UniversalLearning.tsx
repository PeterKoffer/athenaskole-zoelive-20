
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUnifiedSpeech } from '@/hooks/useUnifiedSpeech';
import UniversalLearningContent from "./components/universal/UniversalLearningContent";

interface UniversalLearningProps {
  subject: string;
  skillArea: string;
}

const UniversalLearning = ({ subject, skillArea }: UniversalLearningProps) => {
  const navigate = useNavigate();
  const { stop: stopSpeaking } = useUnifiedSpeech();
  
  // Stop speech when component unmounts (navigating away)
  useEffect(() => {
    return () => {
      console.log(`🔇 Stopping Nelie speech due to navigation away from ${subject} lesson`);
      stopSpeaking();
    };
  }, [stopSpeaking, subject]);
  
  const handleBackToProgram = () => {
    console.log(`🔇 Stopping Nelie speech before navigating back to program from ${subject}`);
    stopSpeaking();
    navigate('/daily-program');
  };

  return (
    <UniversalLearningContent 
      subject={subject}
      skillArea={skillArea}
      onBackToProgram={handleBackToProgram} 
    />
  );
};

export default UniversalLearning;
