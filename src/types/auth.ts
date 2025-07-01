
import type { User as SupabaseUser } from '@supabase/supabase-js';

export type UserRole = 'admin' | 'school_leader' | 'school_staff' | 'teacher' | 'student' | 'parent';

// Interface for the custom data stored within user.user_metadata
export interface UserMetadata {
  first_name?: string;
  last_name?: string;
  name?: string; // This can be derived from first_name and last_name or stored directly
  profile_picture_url?: string;
  role?: UserRole;
  grade_level?: number;
  age?: number;
  // Add other custom fields from your Supabase user_metadata if any
  school_code?: string; // Assuming schoolCode might be here
  child_code?: string;  // Assuming childCode might be here
}

// This will be our primary User type, extending Supabase's User type
// and strongly typing user_metadata.
export interface User extends SupabaseUser {
  user_metadata: UserMetadata & SupabaseUser['user_metadata'];
}

// UserProfile might still be useful for forms or data fetched from a separate 'profiles' table.
// Review its usage to see if it can be consolidated or if it serves a distinct purpose.
export interface UserProfile {
  id: string; // Corresponds to User.id
  email?: string; // Corresponds to User.email
  name?: string; // Derived or from User.user_metadata.name/first_name/last_name
  role?: UserRole; // Corresponds to User.user_metadata.role
  schoolCode?: string; // Potentially from User.user_metadata.school_code
  childCode?: string;  // Potentially from User.user_metadata.child_code
}

export interface RoleConfig {
  title: string;
  description: string;
  allowedRoutes: string[];
  dashboardRoute: string;
  restrictedFrom?: UserRole[];
}

export const ROLE_CONFIGS: Record<UserRole, RoleConfig> = {
  admin: {
    title: "Administrator",
    description: "Full system access and management",
    allowedRoutes: ['*'],
    dashboardRoute: '/admin-dashboard',
  },
  school_leader: {
    title: "School Leader",
    description: "Manage school operations and staff",
    allowedRoutes: ['/school-dashboard', '/teacher-dashboard', '/parent-dashboard', '/daily-program'],
    dashboardRoute: '/school-dashboard',
  },
  school_staff: {
    title: "School Staff",
    description: "Administrative support and school operations",
    allowedRoutes: ['/school-dashboard', '/daily-program', '/profile'],
    dashboardRoute: '/school-dashboard',
  },
  teacher: {
    title: "Teacher",
    description: "Manage classes and student progress",
    allowedRoutes: ['/teacher-dashboard', '/daily-program', '/learn'],
    dashboardRoute: '/teacher-dashboard',
  },
  student: {
    title: "Student",
    description: "Access learning materials and games",
    allowedRoutes: ['/daily-program', '/learn', '/profile'],
    dashboardRoute: '/daily-program',
    restrictedFrom: ['admin', 'school_leader', 'school_staff', 'teacher', 'parent'],
  },
  parent: {
    title: "Parent",
    description: "Monitor child's progress and communicate with school",
    allowedRoutes: ['/parent-dashboard', '/profile'],
    dashboardRoute: '/parent-dashboard',
    restrictedFrom: ['admin', 'school_leader', 'school_staff', 'teacher', 'student'],
  },
};
