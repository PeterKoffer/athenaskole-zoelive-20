
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
            <CSAdaptiveView />
          ) : selectedMode === 'lesson' ? (
            <div className="p-6">
              <div className="bg-purple-900 border-purple-400 rounded-lg p-6 mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">🤖 Welcome to Computer Science Class!</h2>
                <p className="text-purple-200">
                  Welcome to the exciting world of technology! Today we'll learn about coding, problem-solving, 
                  and how computers work. Get ready to think like a programmer and create amazing digital projects!
                </p>
              </div>
            </div>
          ) : (
            <CSMainView
              performanceMetrics={performanceMetrics}
              onDifficultyChange={handleDifficultyChange}
            />
          )}
        </div>
      )}
    </CSModeManager>
  );
};

export default ComputerScienceLearning;
