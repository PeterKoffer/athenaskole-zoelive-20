// Adventure and Lesson Types for 12-step Framework

export interface LearningObjective {
  subject: string;
  curriculum_ref?: string;
  goal: string;
}

export interface ActivitySpec {
  name: string;
  duration: number;
  type: 'discussion' | 'hands-on' | 'creative' | 'reflection' | 'diagnostic_quickcheck' | 'applied_problem_set' | 'scenario_decision' | 'simulation_loop' | 'language_lab' | 'pitch_rehearsal' | 'qna_scenario' | 'exit_ticket' | 'planning_note' | 'creative_asset' | 'writing_prompt';
  instructions: string;
  materials: string[];
  interaction: 'individual' | 'pairs' | 'groups' | 'class';
  engagement_element?: string;
  subject?: string;
  estimated_minutes?: number;
  adaptive?: any;
  success_criteria?: string;
  input_spec?: any;
  hints?: number;
  scoring?: any;
  generated?: any;
  rubric?: any;
}

export interface LessonPhase {
  id: string;
  name: string;
  target_minutes: {
    core: number;
    min: number;
    max: number;
  };
  objective: string;
  type: 'hook' | 'exploration' | 'instruction' | 'practice' | 'reflection';
  description: string;
  activities: ActivitySpec[];
  assessment: string;
  differentiation?: string;
}

export interface AdventureBlueprint {
  version: string;
  adventure: {
    id: string;
    title: string;
    forhistory_hook: {
      text: string;
      image_prompt: string;
    };
    learning_goals: LearningObjective[];
    parameters: {
      grade: number;
      curriculum: string;
      lesson_duration_minutes: number;
      student_ability: string;
      learning_style: string[];
    };
    timebox_policy: {
      total_minutes: number;
      phase_budgeting: string;
      checkpoint_every_minutes: number;
      grace_period_minutes: number;
      fallback_rule: string;
    };
    phases: LessonPhase[];
    assessment_summary: {
      auto_scored: string[];
      teacher_review: string[];
    };
    time_adaptation_runtime_rules: Array<{
      if: string;
      then: string[];
    }>;
  };
}