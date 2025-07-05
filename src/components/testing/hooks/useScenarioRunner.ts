
import { useState } from 'react';
import InSessionAdaptiveManager from '@/services/InSessionAdaptiveManager';
import AdaptiveDifficultyEngine from '@/services/AdaptiveDifficultyEngine';
import { mockUserProgressService } from '@/services/mockUserProgressService';

interface ScenarioResult {
  initialDifficulty: string;
  finalDifficulty: string;
  sessionMetrics: any;
  historicalUpdate: any;
  consoleLogs: string[];
}

export const useScenarioRunner = (testUserId: string) => {
  const [scenario1Results, setScenario1Results] = useState<ScenarioResult | null>(null);
  const [scenario2Results, setScenario2Results] = useState<ScenarioResult | null>(null);
  const [isRunningScenario1, setIsRunningScenario1] = useState(false);
  const [isRunningScenario2, setIsRunningScenario2] = useState(false);

  const runStrugglingStudentScenario = async () => {
    setIsRunningScenario1(true);
    const consoleLogs: string[] = [];
    
    try {
      console.log('🎯 [TEST SCENARIO 1] Starting Struggling Student Test for k-cc-2');
      consoleLogs.push('[TEST SCENARIO 1] Starting Struggling Student Test for k-cc-2');

      const initialDifficulty = await AdaptiveDifficultyEngine.suggestInitialDifficulty(
        testUserId, 'k-cc-2', 'math'
      );
      console.log(`📊 [SCENARIO 1] Initial difficulty for k-cc-2: ${initialDifficulty}`);
      consoleLogs.push(`Initial difficulty for k-cc-2: ${initialDifficulty}`);

      const atomId = 'k-cc-2-test-atom';
      InSessionAdaptiveManager.startAtomSession(atomId);
      console.log(`🎬 [SCENARIO 1] Started in-session management for ${atomId}`);

      const strugglingInteractions = [
        { isCorrect: false, timeSeconds: 75, hints: 2 },
        { isCorrect: false, timeSeconds: 90, hints: 3 },
        { isCorrect: false, timeSeconds: 60, hints: 1 },
        { isCorrect: true, timeSeconds: 120, hints: 4 }
      ];

      for (let i = 0; i < strugglingInteractions.length; i++) {
        const interaction = strugglingInteractions[i];
        InSessionAdaptiveManager.recordAtomInteraction(
          atomId, 
          interaction.isCorrect, 
          interaction.timeSeconds, 
          interaction.hints
        );
        
        console.log(`📝 [SCENARIO 1] Interaction ${i + 1}: ${interaction.isCorrect ? 'Correct' : 'Incorrect'}, ${interaction.timeSeconds}s, ${interaction.hints} hints`);
        consoleLogs.push(`Interaction ${i + 1}: ${interaction.isCorrect ? 'Correct' : 'Incorrect'}, ${interaction.timeSeconds}s, ${interaction.hints} hints`);

        const adaptationCheck = InSessionAdaptiveManager.shouldAdaptAtomDifficulty(atomId);
        if (adaptationCheck.shouldAdapt) {
          console.log(`🔄 [SCENARIO 1] Adaptation triggered: ${adaptationCheck.reason}`);
          consoleLogs.push(`Adaptation triggered: ${adaptationCheck.reason}`);
        }
      }

      const sessionMetrics = InSessionAdaptiveManager.getSessionSummary(atomId);
      const finalPerformance = InSessionAdaptiveManager.endAtomSession(atomId);
      
      console.log(`📊 [SCENARIO 1] Session metrics:`, sessionMetrics);
      console.log(`🏁 [SCENARIO 1] Final performance:`, finalPerformance);

      if (finalPerformance) {
        console.log(`💾 [SCENARIO 1] Recording performance with UniverseSessionManager`);
        await mockUserProgressService.recordObjectiveAttempt(
          testUserId, '1', 'k-cc-2', finalPerformance
        );
      }

      const newDifficulty = await AdaptiveDifficultyEngine.suggestInitialDifficulty(
        testUserId, 'k-cc-2', 'math'
      );
      console.log(`📊 [SCENARIO 1] New difficulty suggestion for k-cc-2: ${newDifficulty}`);

      const historicalUpdate = await mockUserProgressService.getObjectiveProgress(testUserId, 'k-cc-2');

      setScenario1Results({
        initialDifficulty,
        finalDifficulty: newDifficulty,
        sessionMetrics,
        historicalUpdate,
        consoleLogs
      });

    } catch (error) {
      console.error('Error in Scenario 1:', error);
      consoleLogs.push(`Error: ${error}`);
    } finally {
      setIsRunningScenario1(false);
    }
  };

  const runMasteryStudentScenario = async () => {
    setIsRunningScenario2(true);
    const consoleLogs: string[] = [];
    
    try {
      console.log('🎯 [TEST SCENARIO 2] Starting Mastery Student Test for k-cc-3');
      consoleLogs.push('[TEST SCENARIO 2] Starting Mastery Student Test for k-cc-3');

      const initialDifficulty = await AdaptiveDifficultyEngine.suggestInitialDifficulty(
        testUserId, 'k-cc-3', 'math'
      );
      console.log(`📊 [SCENARIO 2] Initial difficulty for k-cc-3: ${initialDifficulty}`);
      consoleLogs.push(`Initial difficulty for k-cc-3: ${initialDifficulty}`);

      const atomId = 'k-cc-3-test-atom';
      InSessionAdaptiveManager.startAtomSession(atomId);
      console.log(`🎬 [SCENARIO 2] Started in-session management for ${atomId}`);

      const masteryInteractions = [
        { isCorrect: true, timeSeconds: 15, hints: 0 },
        { isCorrect: true, timeSeconds: 12, hints: 0 },
        { isCorrect: true, timeSeconds: 18, hints: 0 },
        { isCorrect: true, timeSeconds: 10, hints: 0 }
      ];

      for (let i = 0; i < masteryInteractions.length; i++) {
        const interaction = masteryInteractions[i];
        InSessionAdaptiveManager.recordAtomInteraction(
          atomId, 
          interaction.isCorrect, 
          interaction.timeSeconds, 
          interaction.hints
        );
        
        console.log(`📝 [SCENARIO 2] Interaction ${i + 1}: ${interaction.isCorrect ? 'Correct' : 'Incorrect'}, ${interaction.timeSeconds}s, ${interaction.hints} hints`);
        consoleLogs.push(`Interaction ${i + 1}: ${interaction.isCorrect ? 'Correct' : 'Incorrect'}, ${interaction.timeSeconds}s, ${interaction.hints} hints`);

        const adaptationCheck = InSessionAdaptiveManager.shouldAdaptAtomDifficulty(atomId);
        if (adaptationCheck.shouldAdapt) {
          console.log(`🔄 [SCENARIO 2] Adaptation triggered: ${adaptationCheck.reason}`);
          consoleLogs.push(`Adaptation triggered: ${adaptationCheck.reason}`);
        }
      }

      const sessionMetrics = InSessionAdaptiveManager.getSessionSummary(atomId);
      const finalPerformance = InSessionAdaptiveManager.endAtomSession(atomId);
      
      console.log(`📊 [SCENARIO 2] Session metrics:`, sessionMetrics);
      console.log(`🏁 [SCENARIO 2] Final performance:`, finalPerformance);

      if (finalPerformance) {
        console.log(`💾 [SCENARIO 2] Recording performance with UniverseSessionManager`);
        await mockUserProgressService.recordObjectiveAttempt(
          testUserId, '1', 'k-cc-3', finalPerformance
        );
      }

      const newDifficulty = await AdaptiveDifficultyEngine.suggestInitialDifficulty(
        testUserId, 'k-cc-3', 'math'
      );
      console.log(`📊 [SCENARIO 2] New difficulty suggestion for k-cc-3: ${newDifficulty}`);

      const historicalUpdate = await mockUserProgressService.getObjectiveProgress(testUserId, 'k-cc-3');

      setScenario2Results({
        initialDifficulty,
        finalDifficulty: newDifficulty,
        sessionMetrics,
        historicalUpdate,
        consoleLogs
      });

    } catch (error) {
      console.error('Error in Scenario 2:', error);
      consoleLogs.push(`Error: ${error}`);
    } finally {
      setIsRunningScenario2(false);
    }
  };

  return {
    scenario1Results,
    scenario2Results,
    isRunningScenario1,
    isRunningScenario2,
    runStrugglingStudentScenario,
    runMasteryStudentScenario
  };
};
