
// src/services/learnerProfile/UserIdService.ts

import { supabase } from '@/integrations/supabase/client';

export class UserIdService {
  async getCurrentUserId(): Promise<string | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      return user.id;
    }
    console.warn('UserIdService: No authenticated user found. Operations will likely fail or use mocks if not handled by caller.');
    return null;
  }
}

export const userIdService = new UserIdService();
