
// Learner Types

import { KnowledgeComponentMastery } from './learnerProfile';

export interface Learner {
  id: string;
  profile: {
    kc_masteries: KnowledgeComponentMastery[];
    overall_mastery: number;
  };
}
