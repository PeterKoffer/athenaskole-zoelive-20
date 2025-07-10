
// src/services/learnerProfile/LearnerProfileService.ts

import { SupabaseProfileService } from './SupabaseProfileService';
import type { LearnerProfileService } from './types';

// Using the real Supabase implementation
const learnerProfileService: LearnerProfileService = new SupabaseProfileService();

export default learnerProfileService;
