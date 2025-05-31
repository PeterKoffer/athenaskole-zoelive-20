
export type UserRole = 'admin' | 'school_leader' | 'teacher' | 'student' | 'parent';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  schoolCode?: string;
  childCode?: string;
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
    restrictedFrom: ['admin', 'school_leader', 'teacher', 'parent'],
  },
  parent: {
    title: "Parent",
    description: "Monitor child's progress and communicate with school",
    allowedRoutes: ['/parent-dashboard', '/profile'],
    dashboardRoute: '/parent-dashboard',
    restrictedFrom: ['admin', 'school_leader', 'teacher', 'student'],
  },
};
