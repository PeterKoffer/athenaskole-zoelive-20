
import { User as SupabaseUser } from '@supabase/supabase-js';

export type UserRole = 'admin' | 'school_leader' | 'school_staff' | 'teacher' | 'student' | 'parent';

export interface UserMetadata {
  first_name?: string;
  last_name?: string;
  name?: string;
  profile_picture_url?: string;
  role?: UserRole;
  grade_level?: number;
  age?: number;
  school_code?: string;
  child_code?: string;
}

export interface User extends SupabaseUser {
  user_metadata: UserMetadata;
  role?: string;
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
