
import { useAuth } from '@/hooks/useAuth';
import LearningHeader from "@/components/education/LearningHeader";
import CSAdaptiveView from './computer-science/CSAdaptiveView';
import CSMainView from './computer-science/CSMainView';
import CSModeManager from './computer-science/CSModeManager';

const ComputerScienceLearning = () => {
  const { user } = useAuth();

  return (
    <CSModeManager>
      {({ 
        selectedMode, 
        performanceMetrics, 
        handleModeChange, 
        handleGameSelect, 
        handleDifficultyChange 
      }) => (
        <div className="max-w-6xl mx-auto">
          <LearningHeader 
            title="Computer Science & AI Learning"
            backTo="/daily-program"
            backLabel="Back to Program"
            onModeChange={handleModeChange}
            currentMode={selectedMode}
          />
          
          {selectedMode === 'adaptive' ? (
            <CSAdaptiveView 
              onModeChange={handleModeChange}
              selectedMode={selectedMode}
            />
          ) : (
            <CSMainView
              performanceMetrics={performanceMetrics}
              onGameSelect={handleGameSelect}
              onDifficultyChange={handleDifficultyChange}
            />
          )}
        </div>
      )}
    </CSModeManager>
  );
};

export default ComputerScienceLearning;
