
export interface CurriculumStep {
  id: string;
  stepNumber: number;
  title: string;
  description: string;
  isCompleted: boolean;
  isLocked: boolean;
  estimatedTime: number;
  difficulty: 'easy' | 'medium' | 'hard';
  curriculums: Curriculum[];
}

export interface Curriculum {
  id: string;
  stepId: string;
  title: string;
  description: string;
  subject: string;
  content: string;
  duration: number;
  isCompleted: boolean;
  order: number;
}

import { LearningAtomPerformance } from "./learning";
import { NELIESubject } from "./curriculum/NELIESubjects";

export interface ObjectiveProgressMetrics {
  isCompleted: boolean;
  completedAt?: string;
  totalAttempts: number;          // Total attempts across all encounters
  successfulAttempts: number;     // Total successful completions
  totalTimeSpentSeconds: number;  // Sum of time taken across all attempts
  avgTimeSpentSeconds?: number;   // Can be calculated
  successRate?: number;           // Can be calculated (successfulAttempts / totalAttempts)
  avgHintsUsed?: number;          // Average hints used on successful attempts
  // Stores the performance of the most recent attempt. Could be an array for history.
  lastAttemptPerformance?: LearningAtomPerformance;
  // Optional: Could store a list of all historical LearningAtomPerformance objects if needed later.
  // historicalPerformances?: LearningAtomPerformance[];
}

export interface UserStepProgress {
  id: string;
  userId: string;
  stepId: string;
  isCompleted: boolean; // Overall status of the step
  completedAt?: string; // When the step was fully completed
  timeSpent: number; // Could be sum of totalTimeSpentSeconds from objectives, or overall session time on step
  // Key: curriculumObjectiveId from Curriculum.id
  // Value: Metrics related to the student's interaction with that objective over time
  curriculumProgress: Record<string, ObjectiveProgressMetrics>;
}

// Flexible curriculum node type used by curriculum data files
export interface CurriculumNode {
  id: string;
  parentId?: string | null;
  nodeType: string; // e.g., 'subject', 'subject_area', 'course', 'grade_level', 'domain', 'learning_objective'
  name: string;
  description?: string;
  countryCode?: string;
  languageCode?: string;
  subject?: NELIESubject;
  subjectName?: string;
  educationalLevel?: string; // e.g., 'K', '1', 'K-12'
  estimatedDuration?: number;
  difficultyLevel?: number;
  sourceIdentifier?: string; // e.g., NGSS code
  tags?: string[];
  children?: CurriculumNode[];
}

// Alias used by some modules
export type UnifiedCurriculumNode = CurriculumNode;
