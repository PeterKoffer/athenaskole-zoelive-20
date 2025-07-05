
import React from 'react';
import { Target, TrendingDown, TrendingUp, Brain } from 'lucide-react';
import ScenarioCard from './components/ScenarioCard';
import ScenarioResultsCard from './components/ScenarioResultsCard';
import { useScenarioRunner } from './hooks/useScenarioRunner';

const AdaptiveTestScenarios: React.FC = () => {
  const testUserId = '62612ab6-0c5f-4713-b716-feee788c89d9';
  
  const {
    scenario1Results,
    scenario2Results,
    isRunningScenario1,
    isRunningScenario2,
    runStrugglingStudentScenario,
    runMasteryStudentScenario
  } = useScenarioRunner(testUserId);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ScenarioCard
          title="Scenario 1: Struggling Student"
          icon={<TrendingDown className="w-5 h-5 text-red-500" />}
          objective="k-cc-2"
          expectedDifficulty="easy"
          simulation="Incorrect responses, high time, hints used"
          onRun={runStrugglingStudentScenario}
          isRunning={isRunningScenario1}
          buttonText="Run Struggling Student Test"
          buttonIcon={<Target className="w-4 h-4 mr-2" />}
        />

        <ScenarioCard
          title="Scenario 2: Mastery Student"
          icon={<TrendingUp className="w-5 h-5 text-green-500" />}
          objective="k-cc-3"
          expectedDifficulty="medium"
          simulation="Correct, quick responses, no hints"
          onRun={runMasteryStudentScenario}
          isRunning={isRunningScenario2}
          buttonText="Run Mastery Student Test"
          buttonIcon={<Brain className="w-4 h-4 mr-2" />}
        />
      </div>

      <ScenarioResultsCard
        title="Struggling Student (k-cc-2)"
        results={scenario1Results}
        icon={<TrendingDown className="w-5 h-5 text-red-500" />}
      />

      <ScenarioResultsCard
        title="Mastery Student (k-cc-3)"
        results={scenario2Results}
        icon={<TrendingUp className="w-5 h-5 text-green-500" />}
      />
    </div>
  );
};

export default AdaptiveTestScenarios;
