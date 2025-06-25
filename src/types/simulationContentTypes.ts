// src/types/simulationContentTypes.ts

// --- Generic Simulation Structures ---
export interface SimulationDecisionOption {
  id: string;
  text: string; // Text displayed to the student for this option
  // Effects can be complex: could be direct state changes, trigger events, or lead to narrative branches
  // For now, we'll keep it simple, actual effect processing will be in the simulation logic component
  // outcomeHint?: string; // Optional: A hint about the likely outcome for NELIE to use if student struggles
}

export interface SimulationDecisionPoint {
  id: string;
  prompt: string; // Question or situation requiring a decision
  options: SimulationDecisionOption[];
  // feedbackTemplate?: string; // e.g., "You chose {optionText}. As a result..."
}

export interface SimulationVariable {
  name: string;
  value: number | string | boolean;
  min?: number;
  max?: number;
  unit?: string; // e.g., "$", "%", "points"
  description?: string; // For display or AI understanding
}

export interface SimulationRuleInfo { // For AI understanding and potential display
  description: string; // e.g., "Team morale affects match performance."
  // Could later include actual rule functions or pointers to them
}

export interface SimulationSuccessMetric {
  metricName: string; // e.g., "Final Budget", "Championships Won", "Customer Satisfaction"
  targetValue?: number | string; // Optional target for success
  isHigherBetter: boolean;
}

// --- Specific Simulation Content Types ---

// Example 1: Basketball Team Management
export interface BasketballTeamMember {
  id: string;
  name: string;
  offenseSkill: number; // 1-10
  defenseSkill: number; // 1-10
  morale: number; // 1-10
  salary: number;
  // injuryStatus?: 'healthy' | 'minor' | 'major';
}

export interface BasketballSimState {
  teamName: string;
  budget: SimulationVariable; // e.g., { name: "Team Budget", value: 50000, unit: "$" }
  teamMorale: SimulationVariable; // e.g., { name: "Overall Team Morale", value: 7, min: 0, max: 10 }
  wins: SimulationVariable;
  losses: SimulationVariable;
  playerRoster: BasketballTeamMember[];
  // schedule?: any[]; // Upcoming games
  // currentWeek?: number;
}

export interface BasketballSimContent {
  simulationType: "basketball_team_management";
  initialState: BasketballSimState;
  rulesSummary?: SimulationRuleInfo[]; // e.g., "Higher budget allows better players", "Low morale reduces win chance"
  decisionPointsTemplates?: SimulationDecisionPoint[]; // Templates for common decisions like "Train Team", "Adjust Budget", "Trade Player"
  successMetrics?: SimulationSuccessMetric[]; // e.g., "Win X games", "End season with positive budget"
  seasonLength?: number; // Number of game weeks/cycles
}

// Example 2: Business Operation (e.g., Store Management)
export interface BusinessSimState {
  businessName: string;
  cash: SimulationVariable;
  inventory: Record<string, SimulationVariable>; // e.g., { "tshirts": { name: "T-Shirts", value: 100, unit: "units" } }
  reputation: SimulationVariable; // e.g., { name: "Customer Satisfaction", value: 5, min: 0, max: 10 }
  // dailyCustomers?: SimulationVariable;
  // currentDay?: number;
}

export interface BusinessSimContent {
  simulationType: "business_operation";
  initialState: BusinessSimState;
  rulesSummary?: SimulationRuleInfo[]; // e.g., "Marketing increases customers", "Low inventory hurts sales"
  decisionPointsTemplates?: SimulationDecisionPoint[]; // e.g., "Set Prices", "Order Stock", "Run Marketing Campaign"
  successMetrics?: SimulationSuccessMetric[]; // e.g., "Achieve X profit", "Reach Y reputation"
  simulatedDuration?: number; // e.g., number of days/weeks/months
}

// Example 3: Event Planning
export interface EventSimState {
   eventName: string;
   budget: SimulationVariable;
   guestAttendance: SimulationVariable;
   guestSatisfaction: SimulationVariable; // 1-10
   tasksCompleted: string[]; // list of task IDs
   // currentPhase: 'planning' | 'execution' | 'post-event';
}

export interface EventSimContent {
   simulationType: "event_planning";
   initialState: EventSimState;
   eventGoal: string; // e.g., "Successfully host a charity gala for 100 people."
   availableTasks?: Array<{id: string, name: string, cost: number, effort: number, impactOnSatisfaction: number}>;
   rulesSummary?: SimulationRuleInfo[];
   decisionPointsTemplates?: SimulationDecisionPoint[]; // e.g., "Choose Venue", "Select Catering", "Hire Entertainment"
   successMetrics?: SimulationSuccessMetric[]; // e.g., "Positive Guest Satisfaction", "Stay Within Budget"
}


// Union type for all specific simulation content structures
export type AnySimulationContent =
  | BasketballSimContent
  | BusinessSimContent
  | EventSimContent;
  // Add other simulation content types here as they are defined

// Generic structure for LessonActivity.content when type is 'simulation'
// This is what ActivityContentGenerator will place inside LessonActivity.content
// when the activityType is 'simulation'.
export interface SimulationActivityContent {
  simulationType: string; // Matches one of the specific simulationType strings above (e.g., "basketball_team_management")
  title?: string; // Title for this specific simulation instance/scenario (e.g., "My First Season as Coach")
  introductionText?: string; // Narrative intro to this simulation activity (e.g., "Welcome to the team, Coach!...")
  // The actual simulation state and config will be one of the AnySimulationContent types
  details: AnySimulationContent;
}
