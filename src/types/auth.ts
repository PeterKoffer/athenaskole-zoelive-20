
import { User as SupabaseUser } from '@supabase/supabase-js';

export interface UserMetadata {
  name?: string;
  first_name?: string;
  role?: string;
}

export interface User extends SupabaseUser {
  user_metadata: UserMetadata;
  role?: string;
}
