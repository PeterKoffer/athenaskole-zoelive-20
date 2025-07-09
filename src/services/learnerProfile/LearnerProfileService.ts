
// src/services/learnerProfile/LearnerProfileService.ts

import { mockLearnerProfileService } from './MockLearnerProfileService';
import type { LearnerProfileService } from './types';

// For now, we export the mock service
// Later this can be switched to a real implementation (Supabase, etc.)
const learnerProfileService: LearnerProfileService = mockLearnerProfileService;

export default learnerProfileService;
