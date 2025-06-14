
import { useNavigate } from "react-router-dom";
import OptimizedMathLearningContent from "./components/math/OptimizedMathLearningContent";

const EnhancedMathematicsLearning = () => {
  const navigate = useNavigate();
  
  const handleBackToProgram = () => {
    navigate('/daily-program');
  };

  return (
    <OptimizedMathLearningContent onBackToProgram={handleBackToProgram} />
  );
};

export default EnhancedMathematicsLearning;
