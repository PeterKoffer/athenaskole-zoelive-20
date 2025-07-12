
// Core types for the Educational Simulator Platform

export interface SimulatorScenario {
  id: string;
  title: string;
  description: string;
  estimatedDuration: number; // in minutes
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  
  // Cross-curricular learning objectives
  learningObjectives: {
    primary: string[];
    secondary: string[];
    crossCurricular: string[];
  };
  
  // Subjects and skills integrated in this scenario
  integratedSubjects: {
    subject: string;
    skillAreas: string[];
    weight: number; // importance in this scenario (0-1)
  }[];
  
  // Scenario structure
  scenario: {
    context: string;
    initialSituation: string;
    stakeholders: ScenarioStakeholder[];
    resources: ScenarioResource[];
    constraints: ScenarioConstraint[];
  };
  
  // Decision tree structure
  decisionTree: DecisionNode[];
  
  // Assessment criteria
  assessment: {
    keyPerformanceIndicators: KPI[];
    rubric: AssessmentRubric;
    debriefQuestions: string[];
  };
  
  // Metadata
  metadata: {
    creator: string;
    tags: string[];
    realWorldConnection: string;
    emotionalEngagement: 'low' | 'medium' | 'high';
    competitiveElement: boolean;
  };
}

export interface ScenarioStakeholder {
  id: string;
  name: string;
  role: string;
  goals: string[];
  constraints: string[];
  influence: number; // 0-1 scale
}

export interface ScenarioResource {
  id: string;
  type: 'budget' | 'time' | 'personnel' | 'equipment' | 'information';
  name: string;
  initialAmount: number;
  constraints: string[];
  isRenewable: boolean;
}

export interface ScenarioConstraint {
  id: string;
  type: 'time' | 'budget' | 'regulation' | 'ethical' | 'technical';
  description: string;
  impact: 'low' | 'medium' | 'high';
}

export interface DecisionNode {
  id: string;
  parentId?: string;
  title: string;
  situation: string;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  
  // Available information
  information: {
    complete: InformationItem[];
    partial: InformationItem[];
    conflicting?: InformationItem[];
  };
  
  // Decision options
  options: DecisionOption[];
  
  // Dynamic events that might trigger
  possibleEvents: DynamicEvent[];
  
  // Skills being assessed at this point
  skillsAssessed: string[];
}

export interface DecisionOption {
  id: string;
  description: string;
  immediateConsequences: Consequence[];
  longTermConsequences: Consequence[];
  resourceCost: ResourceCost[];
  stakeholderImpact: StakeholderImpact[];
  skillsRequired: string[];
  nextNodeId?: string;
}

export interface Consequence {
  type: 'positive' | 'negative' | 'neutral';
  description: string;
  impact: 'low' | 'medium' | 'high';
  subjects: string[]; // Which subjects this relates to
}

export interface ResourceCost {
  resourceId: string;
  amount: number;
  isPercentage: boolean;
}

export interface StakeholderImpact {
  stakeholderId: string;
  satisfaction: number; // -1 to 1
  trust: number; // -1 to 1
  relationship: 'improved' | 'maintained' | 'damaged';
}

export interface DynamicEvent {
  id: string;
  name: string;
  description: string;
  probability: number; // 0-1
  triggerConditions: string[];
  impact: Consequence[];
  timeToResolve?: number; // minutes
}

export interface InformationItem {
  id: string;
  content: string;
  source: string;
  reliability: number; // 0-1
  subjects: string[]; // Which curriculum subjects this relates to
}

export interface KPI {
  id: string;
  name: string;
  description: string;
  measurement: 'score' | 'time' | 'efficiency' | 'satisfaction' | 'custom';
  target: number;
  weight: number; // importance in overall assessment
}

export interface AssessmentRubric {
  criteria: RubricCriterion[];
  overallScoring: 'average' | 'weighted' | 'holistic';
}

export interface RubricCriterion {
  id: string;
  name: string;
  description: string;
  levels: RubricLevel[];
  weight: number;
  subjects: string[]; // Curriculum areas this assesses
}

export interface RubricLevel {
  score: number;
  label: string;
  description: string;
  indicators: string[];
}

// Session tracking for active simulations
export interface SimulatorSession {
  id: string;
  scenarioId: string;
  userId: string;
  teamId?: string;
  startTime: Date;
  currentNodeId: string;
  
  // Current state
  resources: Record<string, number>;
  stakeholderRelations: Record<string, { satisfaction: number; trust: number }>;
  decisions: SessionDecision[];
  events: SessionEvent[];
  
  // Performance tracking
  performance: {
    kpis: Record<string, number>;
    skillDemonstration: Record<string, number>;
    timeManagement: number;
    resourceEfficiency: number;
  };
  
  // Collaboration data (for team simulations)
  collaboration?: {
    role: string;
    contributions: string[];
    communicationRating: number;
  };
  
  status: 'active' | 'paused' | 'completed' | 'abandoned';
  completionTime?: Date;
}

export interface SessionDecision {
  nodeId: string;
  optionId: string;
  timestamp: Date;
  reasoning?: string;
  timeToDecide: number; // seconds
}

export interface SessionEvent {
  eventId: string;
  timestamp: Date;
  resolved: boolean;
  resolution?: string;
  impact: Consequence[];
}

// Team and multiplayer functionality
export interface SimulatorTeam {
  id: string;
  name: string;
  members: TeamMember[];
  currentScenario?: string;
  sessionsHistory: string[];
  teamDynamics: {
    cohesion: number;
    communication: number;
    leadership: number;
    conflictResolution: number;
  };
}

export interface TeamMember {
  userId: string;
  role: string;
  responsibilities: string[];
  permissions: string[];
  performanceHistory: Record<string, number>;
}

// Analytics and reporting
export interface SimulatorAnalytics {
  sessionId: string;
  overallPerformance: number;
  subjectPerformance: Record<string, number>;
  skillDemonstration: Record<string, number>;
  decisionAnalysis: DecisionAnalysis[];
  timeAllocation: Record<string, number>;
  collaborationMetrics?: CollaborationMetrics;
  improvementAreas: string[];
  strengths: string[];
}

export interface DecisionAnalysis {
  nodeId: string;
  optionChosen: string;
  effectiveness: number;
  alternativeOutcomes: string[];
  skillsAssessed: Record<string, number>;
}

export interface CollaborationMetrics {
  communication: number;
  leadership: number;
  teamwork: number;
  conflictResolution: number;
  contribution: number;
}
