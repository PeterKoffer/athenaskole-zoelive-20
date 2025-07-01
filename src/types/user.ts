
import { User as SupabaseUser } from '@supabase/supabase-js';

export interface UserMetadata {
  first_name?: string;
  last_name?: string;
  name?: string;
  profile_picture_url?: string;
  role?: string;
  [key: string]: any;
}

export interface User extends SupabaseUser {
  user_metadata: UserMetadata;
  role?: string;
}

export type { UserMetadata };
