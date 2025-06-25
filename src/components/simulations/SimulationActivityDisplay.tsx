import React from 'react';
import { GameState, GameActions, GameConfig } from '@/components/games/GameEngine'; // Assuming GameEngine types are exported
import { LessonActivity } from '@/components/education/components/types/LessonTypes';
import {
  SimulationActivityContent,
  BasketballSimContent,
  BusinessSimContent, // For future use
  EventSimContent     // For future use
  // Import other specific SimContent types as they are created
} from '@/types/simulationContentTypes'; // Adjust path as needed

// Import specific simulation components
import BasketballSimulation from './BasketballSimulation';
// import BusinessSimulation from './BusinessSimulation'; // To be created later
// import EventPlanningSimulation from './EventPlanningSimulation'; // To be created later

interface SimulationActivityDisplayProps {
  // Props provided by GameEngine's children render prop or similar mechanism
  gameState: GameState;
  gameActions: GameActions;
  gameConfig: GameConfig; // The GameConfig for this 'simulation' interactionType

  // The full LessonActivity object whose type is 'simulation'.
  // GameEngine would extract simulationActivityContent from this and potentially initialize
  // gameState.gameData with simulationActivityContent.details.initialState.
  lessonActivity: LessonActivity;
}

/**
 * SimulationActivityDisplay Component
 *
 * Acts as a router to render the correct specific simulation UI component
 * (e.g., BasketballSimulation, BusinessSimulation) based on the
 * `simulationType` provided in the `lessonActivity.content`.
 *
 * This component is intended to be used by `GameEngine.tsx` when the
 * `gameConfig.interactionType` (or `lessonActivity.type`) is 'simulation'.
 *
 * Responsibilities of GameEngine (Conceptual):
 * - When a 'simulation' activity starts, GameEngine should:
 *   1. Extract the `SimulationActivityContent` from `lessonActivity.content`.
 *   2. Use `simulationActivityContent.details.initialState` to initialize its own
 *      internal `gameState.gameData`. This ensures the simulation starts correctly.
 *   3. Pass down its `gameState`, `gameActions`, `gameConfig`, and the
 *      `lessonActivity` (or specifically its `simulationActivityContent.details`)
 *      to this display component.
 */
const SimulationActivityDisplay: React.FC<SimulationActivityDisplayProps> = ({
  gameState,
  gameActions,
  gameConfig,
  lessonActivity,
}) => {
  // Type cast and validate the content from LessonActivity
  const simulationActivityContent = lessonActivity.content as SimulationActivityContent;

  if (!simulationActivityContent || typeof simulationActivityContent !== 'object' || !simulationActivityContent.details) {
    console.error("SimulationActivityDisplay: Invalid or missing simulation content in lessonActivity:", lessonActivity);
    return <div className="text-red-500 p-4 bg-red-100 border border-red-500 rounded-md">Error: Simulation content is missing or malformed. Cannot display simulation.</div>;
  }

  // Extract the specific simulation type and the detailed content for that type
  const { simulationType, details } = simulationActivityContent;

  // Note: GameEngine should have ideally initialized gameState.gameData with details.initialState.
  // The specific simulation components (like BasketballSimulation) will then use gameState.gameData
  // as their primary state source, falling back to details.initialState if gameState.gameData is empty or mismatched.

  switch (simulationType) {
    case 'basketball_team_management':
      // Ensure the 'details' conform to BasketballSimContent before casting
      if (details && (details as BasketballSimContent).simulationType === 'basketball_team_management') {
        return (
          <BasketballSimulation
            gameState={gameState}
            gameActions={gameActions}
            // Pass the specific 'details' part which is the BasketballSimContent
            simulationContent={details as BasketballSimContent}
            gameConfig={gameConfig}
          />
        );
      } else {
        console.error(\`Mismatched details for simulationType: \${simulationType}\`, details);
        return <div className="text-red-500 p-4">Error: Basketball simulation data is malformed.</div>;
      }

    // case 'business_operation':
    //   if (details && (details as BusinessSimContent).simulationType === 'business_operation') {
    //     return (
    //       <BusinessSimulation // This component would need to be created
    //         gameState={gameState}
    //         gameActions={gameActions}
    //         simulationContent={details as BusinessSimContent}
    //         gameConfig={gameConfig}
    //       />
    //     );
    //   } else {
    //     console.error(\`Mismatched details for simulationType: \${simulationType}\`, details);
    //     return <div className="text-red-500 p-4">Error: Business simulation data is malformed.</div>;
    //   }

    // case 'event_planning':
    //   if (details && (details as EventSimContent).simulationType === 'event_planning') {
    //     return (
    //       <EventPlanningSimulation // This component would need to be created
    //         gameState={gameState}
    //         gameActions={gameActions}
    //         simulationContent={details as EventSimContent}
    //         gameConfig={gameConfig}
    //       />
    //     );
    //   } else {
    //     console.error(\`Mismatched details for simulationType: \${simulationType}\`, details);
    //     return <div className="text-red-500 p-4">Error: Event planning simulation data is malformed.</div>;
    //   }

    // Add cases for other simulation types as they are developed

    default:
      console.warn(\`SimulationActivityDisplay: Unknown or unhandled simulation type: "\${simulationType}"\`);
      return (
        <div className="text-orange-600 p-4 bg-orange-100 border border-orange-500 rounded-md">
          <h3 className="font-semibold text-lg">Simulation Not Available</h3>
          <p>Warning: The simulation type "<span className="font-mono">{simulationType}</span>" is not recognized or a component for it hasn't been implemented yet.</p>
          <p className="text-sm mt-2">Activity Title: {lessonActivity.title}</p>
          <details className="mt-2 text-xs">
            <summary>View Raw Simulation Data (for debugging)</summary>
            <pre className="mt-1 p-2 bg-gray-700 text-gray-200 rounded overflow-auto max-h-60">
              {JSON.stringify(details, null, 2)}
            </pre>
          </details>
        </div>
      );
  }
};

export default SimulationActivityDisplay;
