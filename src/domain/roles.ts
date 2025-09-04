export type Role = 'student' | 'teacher' | 'school-leader' | 'parent' | 'admin' | 'guest';

export const ROLE_HOME: Record<Role, string> = {
  student: '/app/today',
  teacher: '/teacher',
  'school-leader': '/school',
  parent: '/parent',
  admin: '/admin',
  guest: '/landing',
};
