// Adventure Blueprint Types for structured educational content
export type AdaptiveLevel = "remedial" | "core" | "stretch";

export interface TimeboxPolicy {
  total_minutes: number;
  phase_budgeting: "fixed_core+elastic_enrichment" | "fixed_all" | "elastic_all";
  checkpoint_every_minutes: number;
  grace_period_minutes: number;
  fallback_rule: "prefer_core_completion_over_enrichment" | "balance_core_and_reflection";
}

export interface TargetMinutes {
  core: number;
  min: number;
  max: number;
}

export interface LearningGoal {
  subject: string;
  curriculum_ref: string;
  goal: string;
}

export interface AdventureActivity {
  type: "diagnostic_quickcheck" | "applied_problem_set" | "writing_prompt" | "scenario_decision" | "exit_ticket" | "simulation" | "creative_task";
  subject: string;
  estimated_minutes: number;
  adaptive?: {
    level_map: Record<AdaptiveLevel, string>;
  };
  input_spec?: {
    format: string;
    count?: number;
    item_type?: string;
    item_types?: string[];
  };
  scoring?: {
    auto: boolean;
    partial_credit?: boolean;
  };
  hints?: number;
  success_criteria?: string;
  remediation?: {
    offer: boolean;
    max_minutes: number;
    content: string;
  };
  enrichment?: {
    offer: boolean;
    max_minutes: number;
    content: string;
  };
  decisions?: number;
  feedback_mode?: "immediate" | "delayed";
  items?: Array<{
    format: string;
    prompt: string;
  }>;
  rubric?: Array<{
    dimension: string;
    scale: string;
  }>;
  next_step_rules?: Array<{
    if: string;
    then: string;
  }>;
}

export interface AdventureAssets {
  images?: Array<{
    role: string;
    prompt: string;
  }>;
  audio?: Array<{
    role: string;
    prompt: string;
  }>;
}

export interface PhaseCheckpoint {
  minute: number;
  ensure: string;
  on_miss: string;
}

export interface AdventurePhase {
  id: string;
  name: string;
  target_minutes: TargetMinutes;
  objective: string;
  narrative: string;
  activities: AdventureActivity[];
  assets?: AdventureAssets;
  checkpoints?: PhaseCheckpoint[];
}

export interface AdventureParameters {
  grade: number;
  curriculum: string;
  school_philosophy: string;
  teacher_weights: Record<string, number>;
  lesson_duration_minutes: number;
  student_ability: string;
  learning_style: string[];
  interests: string[];
  calendar: {
    keywords: string[];
    day_minutes: number;
  };
}

export interface GlobalPacingControls {
  adaptive_levels: AdaptiveLevel[];
  difficulty_band: {
    min: number;
    target: number;
    max: number;
  };
  mastery_gate_policy: string;
  branching_mode: string;
}

export interface AssessmentSummary {
  auto_scored: string[];
  teacher_review: string[];
  mastery_gate_results: Record<string, "pass" | "remediate">;
}

export interface TimeAdaptationRule {
  if: string;
  then: string[];
}

export interface AdventureValidation {
  age_fit: boolean;
  curriculum_coverage_ok: boolean;
  token_budget_ok: boolean;
  notes?: string;
}

export interface AdventureBlueprint {
  version: "nelie.adventure.v1";
  adventure: {
    id: string;
    title: string;
    forhistory_hook: {
      text: string;
      image_prompt: string;
    };
    learning_goals: LearningGoal[];
    parameters: AdventureParameters;
    timebox_policy: TimeboxPolicy;
    global_pacing_controls: GlobalPacingControls;
    phases: AdventurePhase[];
    assessment_summary: AssessmentSummary;
    time_adaptation_runtime_rules: TimeAdaptationRule[];
    validation: AdventureValidation;
  };
}