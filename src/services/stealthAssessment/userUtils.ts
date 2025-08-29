
// src/services/stealthAssessment/userUtils.ts

import { supabase } from '@/lib/supabaseClient';
import { STEALTH_ASSESSMENT_CONFIG } from './config';

export const getCurrentUserId = async (): Promise<string | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    return user.id;
  }
  console.warn('StealthAssessmentService: No authenticated user found. Using test user for integration testing.');
  return STEALTH_ASSESSMENT_CONFIG.testUserId;
};

export const getCurrentSessionId = (): string => {
  return STEALTH_ASSESSMENT_CONFIG.mockSessionId;
};
