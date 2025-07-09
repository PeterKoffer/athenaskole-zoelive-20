
// Learner Types

import { KcMastery } from './learnerProfile';

export interface Learner {
  id: string;
  profile: {
    kc_masteries: KcMastery[];
    overall_mastery: number;
  };
}
