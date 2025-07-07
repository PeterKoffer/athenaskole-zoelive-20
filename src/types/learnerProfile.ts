
// Learner Profile Types

export interface KcMastery {
  kc_id: string;
  mastery_level: number;
  confidence: number;
  last_updated: string;
}

export interface LearnerProfile {
  user_id: string;
  overall_mastery: number;
  kc_masteries: KcMastery[];
  preferences: any;
  created_at: string;
  updated_at: string;
}
