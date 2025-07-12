
import { User as SupabaseUser } from '@supabase/supabase-js';
import { UserRole } from './auth';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: UserRole;
  preferences: {
    theme: 'light' | 'dark';
    language: string;
  };
}

export interface User extends SupabaseUser {
  user_metadata: {
    name?: string;
    avatar_url?: string;
    role?: UserRole;
  };
  role: UserRole;
}
