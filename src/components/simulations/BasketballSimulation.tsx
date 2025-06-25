import React, { useState, useEffect, useCallback } from 'react';
import { GameState, GameActions, GameConfig } from '@/components/games/GameEngine'; // Assuming GameEngine types are exported
import { SimulationActivityContent, BasketballSimState, BasketballSimContent, SimulationDecisionPoint } from '@/types/simulationContentTypes'; // Adjust path as needed
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from "@/components/ui/progress";


interface BasketballSimulationProps {
  gameState: GameState; // Provided by GameEngine
  gameActions: GameActions; // Provided by GameEngine
  // The specific content for this simulation instance, matching BasketballSimContent
  // This comes from LessonActivity.content.details as casted by the component that launches the GameEngine
  simulationContent: BasketballSimContent;
  // gameConfig might be useful for objectives or general game parameters from GameEngine
  gameConfig: GameConfig;
}

/**
 * BasketballSimulation Component
 *
 * This component implements the logic and UI for a basketball team management simulation.
 * It's designed to be run within the <GameEngine /> component.
 *
 * Key Responsibilities:
 * - Manages its specific simulation state (BasketballSimState), which is stored within
 *   the GameEngine's central `gameState.gameData`.
 * - Processes player decisions and simulates game weeks/events.
 * - Updates the simulation state and uses `gameActions` (provided by GameEngine)
 *   to report progress, scores, achievements, and completion back to the GameEngine.
 * - Renders the UI for displaying team stats, decisions, and game progress.
 *
 * Note: The simulation logic here is a simplified example. A full-fledged simulation
 * would involve more complex rules, calculations, and event handling.
 */
const BasketballSimulation: React.FC<BasketballSimulationProps> = ({
  gameState,
  gameActions,
  simulationContent,
  gameConfig,
}) => {
  // Initialize simState:
  // 1. Try to get it from gameState.gameData (if GameEngine is re-rendering an ongoing game).
  // 2. If not found (e.g., first load), use simulationContent.initialState.
  const [simState, setSimState] = useState<BasketballSimState>(() => {
    if (gameState.gameData && (gameState.gameData as BasketballSimState).simulationType === "basketball_team_management") {
      return gameState.gameData as BasketballSimState;
    }
    return simulationContent.initialState;
  });

  // Persist changes in our local simState back to the GameEngine's central gameState.gameData
  useEffect(() => {
    // Ensure we only update if there's an actual change to avoid potential loops if gameActions.updateGameData isn't memoized.
    // A deep equality check might be better for complex states if performance issues arise.
    if (JSON.stringify(gameState.gameData) !== JSON.stringify(simState)) {
        gameActions.updateGameData(simState);
    }
  }, [simState, gameActions, gameState.gameData]);

  // Example: Track current week/cycle of the simulation
  // This could also be part of simState if it needs to be persisted across sessions more robustly.
  const [currentWeek, setCurrentWeek] = useState(gameState.currentAttempt || 1); // Start from GameEngine's attempt or 1
  const totalWeeks = simulationContent.seasonLength || 10; // Default to 10 weeks from content

  // --- Core Simulation Logic (Simplified Examples) ---

  const handleDecision = useCallback((decisionPointId: string, optionId: string) => {
    if (currentWeek > totalWeeks) return; // Don't allow decisions past season end

    let newSimState = JSON.parse(JSON.stringify(simState)) as BasketballSimState; // Deep copy
    let logMessage = "";

    // Example: Find the decision point from templates to understand its context
    const decisionTemplate = simulationContent.decisionPointsTemplates?.find(dp => dp.id === decisionPointId);

    if (decisionTemplate) {
        logMessage = `Decision: '\${decisionTemplate.prompt}' -> Option '\${decisionTemplate.options.find(o=>o.id === optionId)?.text || optionId}'. `;
    }


    if (decisionPointId === 'training_focus') { // Corresponds to ID in decisionPointsTemplates
      if (optionId === 'offense') {
        newSimState.teamMorale = { ...newSimState.teamMorale, value: Math.min(10, newSimState.teamMorale.value + 1) };
        // Example: Slightly boost offense for some players
        newSimState.playerRoster = newSimState.playerRoster.map(p => ({...p, offenseSkill: Math.min(10, p.offenseSkill + 0.5)}));
        logMessage += "Focused on offense! Team morale and player offense slightly boosted.";
      } else if (optionId === 'defense') {
        newSimState.teamMorale = { ...newSimState.teamMorale, value: Math.min(10, newSimState.teamMorale.value + 0.5) };
        newSimState.playerRoster = newSimState.playerRoster.map(p => ({...p, defenseSkill: Math.min(10, p.defenseSkill + 0.5)}));
        logMessage += "Focused on defense! Team morale and player defense get a small lift.";
      }
    } else if (decisionPointId === 'budget_allocation') { // Another example from potential templates
        if (optionId === 'increase_scouting') {
            newSimState.budget = {...newSimState.budget, value: newSimState.budget.value - 2000};
            logMessage += "Increased scouting budget by $2000.";
        } else if (optionId === 'marketing_campaign') {
            newSimState.budget = {...newSimState.budget, value: newSimState.budget.value - 3000};
            newSimState.teamMorale = { ...newSimState.teamMorale, value: Math.min(10, newSimState.teamMorale.value + 0.2)}; // Small morale boost
            logMessage += "Launched a marketing campaign for $3000. Small morale boost.";
        }
    }
    // Add more decision handlers here based on simulationContent.decisionPointsTemplates

    setSimState(newSimState);
    gameActions.recordAction({ type: 'decision', decisionId: decisionPointId, optionId: optionId, details: logMessage });
    console.log("Decision made:", decisionPointId, optionId, logMessage);

    // Example: Check if an objective was met by this decision
    if (newSimState.teamMorale.value >= 9 && !gameState.achievements.includes("Peak Team Spirit!")) {
        gameActions.addAchievement("Peak Team Spirit!");
    }

  }, [simState, gameActions, gameState.achievements, currentWeek, totalWeeks, simulationContent.decisionPointsTemplates]);

  const simulateWeek = useCallback(() => {
     if (currentWeek > totalWeeks) {
        gameActions.completeGame("Season ended.");
        return;
     }

     let newSimState = JSON.parse(JSON.stringify(simState)) as BasketballSimState; // Deep copy
     let gameLog = "";

     // Simulate a game result (very basic)
     // A more complex model would use player skills vs opponent difficulty etc.
     const avgOffense = newSimState.playerRoster.reduce((sum, p) => sum + p.offenseSkill, 0) / (newSimState.playerRoster.length || 1);
     const avgDefense = newSimState.playerRoster.reduce((sum, p) => sum + p.defenseSkill, 0) / (newSimState.playerRoster.length || 1);
     const skillFactor = (avgOffense + avgDefense) / 2; // Average skill
     const winChance = (skillFactor / 10) * 0.4 + (newSimState.teamMorale.value / 10) * 0.4 + Math.random() * 0.2; // Skill, Morale + Luck

     if (winChance > 0.55) { // Slightly harder to win to make decisions more impactful
         newSimState.wins = { ...newSimState.wins, value: newSimState.wins.value + 1 };
         newSimState.teamMorale = { ...newSimState.teamMorale, value: Math.min(10, newSimState.teamMorale.value + 1)};
         newSimState.budget = { ...newSimState.budget, value: newSimState.budget.value + (simulationContent.initialState.budget.value * 0.05)}; // Win bonus: 5% of initial budget
         gameActions.updateScore(100); // Points for a win
         gameLog = "Game Result: WIN! Morale and budget increased.";
         console.log(gameLog);
     } else {
         newSimState.losses = { ...newSimState.losses, value: newSimState.losses.value + 1 };
         newSimState.teamMorale = { ...newSimState.teamMorale, value: Math.max(0, newSimState.teamMorale.value - 1.5)}; // Harsher morale penalty for loss
         gameLog = "Game Result: LOSS. Team morale took a hit.";
         console.log(gameLog);
     }

     const weeklyPlayerSalaries = newSimState.playerRoster.reduce((sum, p) => sum + p.salary, 0) / (simulationContent.seasonLength || 10); // Assume salary is per season, divide by weeks
     const weeklyExpenses = (simulationContent.initialState.budget.value * 0.02) + weeklyPlayerSalaries; // 2% operating cost + salaries
     newSimState.budget = { ...newSimState.budget, value: newSimState.budget.value - weeklyExpenses };
     gameLog += ` Weekly expenses: \$${weeklyExpenses.toFixed(0)}.`;

     setSimState(newSimState);
     setCurrentWeek(prev => prev + 1);
     // gameActions.recordAttempt() is called by GameEngine if it tracks turns/cycles.
     // Here, we can log the action.
     gameActions.recordAction({ type: 'simulate_week', week: currentWeek, details: gameLog});


     // Check for game over conditions (e.g., budget bankruptcy)
     if (newSimState.budget.value < 0) {
        console.log("Game Over: Ran out of budget!");
        gameActions.completeGame("Bankrupt!"); // GameEngine handles actual completion
        return;
     }

     if (currentWeek + 1 > totalWeeks) {
         console.log("Season Ended. Final State:", newSimState);
         // Check success metrics
         let allMetricsMet = true;
         simulationContent.successMetrics?.forEach(metric => {
             const currentValue = metric.metricName === "Wins" ? newSimState.wins.value :
                                  metric.metricName === "Budget" ? newSimState.budget.value :
                                  metric.metricName === "Team Morale" ? newSimState.teamMorale.value : -1;
             let metricAchieved = false;
             if (metric.isHigherBetter) {
                 metricAchieved = currentValue >= (metric.targetValue || Number.MIN_SAFE_INTEGER);
             } else {
                 metricAchieved = currentValue <= (metric.targetValue || Number.MAX_SAFE_INTEGER);
             }
             if (metricAchieved && !gameState.achievements.includes(metric.metricName)) gameActions.addAchievement(metric.metricName);
             if (!metricAchieved) allMetricsMet = false;
         });
         // GameEngine's onComplete will be called based on its objectives or time limit.
         // We can also explicitly complete it here if it's the definitive end.
         gameActions.completeGame(allMetricsMet ? "Season Success!" : "Season Over.");
     }
  }, [simState, gameActions, currentWeek, totalWeeks, simulationContent, gameState.achievements]);


  // --- UI Rendering ---
  if (!simState) return <div className="p-4 text-center">Loading simulation state...</div>;

  // Example: Find a relevant decision point template to display (e.g., first one not yet "used" or cycle through them)
  // This logic would need to be more sophisticated in a real game (e.g., based on current game state or week)
  const availableDecisionPoints = simulationContent.decisionPointsTemplates || [];
  const currentDecisionPoint: SimulationDecisionPoint | undefined = availableDecisionPoints[ (currentWeek -1) % availableDecisionPoints.length ];


  return (
    <div className="space-y-4 p-2 sm:p-4 bg-slate-800 text-white rounded-lg">
      <Card className="bg-slate-700 border-slate-600">
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl text-purple-300">{simState.teamName || 'Your Basketball Team'}</CardTitle>
          <CardDescription className="text-slate-400">Week: {currentWeek} / {totalWeeks} - Season Management</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm sm:text-base">
          <div className="col-span-2 sm:col-span-1">Budget: <span className="font-semibold text-green-400">{simState.budget.unit}{simState.budget.value.toLocaleString()}</span></div>
          <div>Wins: <span className="font-semibold text-green-400">{simState.wins.value}</span></div>
          <div>Losses: <span className="font-semibold text-red-400">{simState.losses.value}</span></div>
          <div className="col-span-2">Team Morale: {simState.teamMorale.value}/10
            <Progress value={simState.teamMorale.value * 10} className="h-2 mt-1 bg-slate-600 [&>div]:bg-yellow-400" />
          </div>
        </CardContent>
      </Card>

      {currentDecisionPoint && currentWeek <= totalWeeks && (
        <Card className="bg-slate-700 border-slate-600">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl text-sky-300">Manager's Decision: {currentDecisionPoint.id.replace(/_/g, ' ')}</CardTitle>
            <CardDescription className="text-slate-400">{currentDecisionPoint.prompt}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col space-y-2">
            {currentDecisionPoint.options.map(opt => (
              <Button key={opt.id} onClick={() => handleDecision(currentDecisionPoint.id, opt.id)} variant="outline" className="text-white border-sky-500 hover:bg-sky-700">
                {opt.text}
              </Button>
            ))}
          </CardContent>
        </Card>
      )}

      {currentWeek <= totalWeeks && (
         <Button onClick={simulateWeek} className="w-full mt-4 bg-green-600 hover:bg-green-700 text-lg py-3">
           Simulate Next Week & Game
         </Button>
      )}

      {currentWeek > totalWeeks && (
         <Card className="bg-slate-700 border-slate-600">
             <CardHeader><CardTitle className="text-xl text-yellow-400">Season Over!</CardTitle></CardHeader>
             <CardContent className="space-y-1">
                 <p>Congratulations on completing the season, Manager!</p>
                 <p>Final Budget: <span className="font-semibold">{simState.budget.unit}{simState.budget.value.toLocaleString()}</span></p>
                 <p>Total Wins: <span className="font-semibold">{simState.wins.value}</span></p>
                 <p>Total Losses: <span className="font-semibold">{simState.losses.value}</span></p>
                 <div className="mt-2">
                    <h4 className="font-semibold">Achievements:</h4>
                    {gameState.achievements.length > 0 ? (
                        <ul className="list-disc pl-5 text-sm">
                            {gameState.achievements.map(ach => <li key={ach} className="text-green-300">{ach}</li>)}
                        </ul>
                    ) : <p className="text-sm text-slate-400">No specific achievements unlocked this season.</p>}
                 </div>
                 <Button onClick={() => gameActions.completeGame("Season manually ended.")} className="w-full mt-4 bg-blue-600 hover:bg-blue-700">
                    View Final Results & Exit
                 </Button>
             </CardContent>
         </Card>
      )}

      {/* Display rules summary (optional) */}
      {simulationContent.rulesSummary && simulationContent.rulesSummary.length > 0 && (
        <Card className="mt-4 bg-slate-700/70 border-slate-600">
          <CardHeader><CardTitle className="text-md text-amber-300">Game Rules Overview</CardTitle></CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-slate-300">
              {simulationContent.rulesSummary.map((rule, i) => <li key={i}>{rule.description}</li>)}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BasketballSimulation;
