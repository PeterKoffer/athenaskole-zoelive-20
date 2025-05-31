
import { GraduationCap, Users, BookOpen, Building, Shield } from "lucide-react";
import { UserRole } from "@/types/auth";

export const roleIcons = {
  admin: Shield,
  school_leader: Building,
  teacher: BookOpen,
  student: GraduationCap,
  parent: Users
} as const;

export const roleColors = {
  admin: "from-red-400 to-red-600",
  school_leader: "from-orange-400 to-orange-600",
  teacher: "from-purple-400 to-purple-600",
  student: "from-blue-400 to-blue-600",
  parent: "from-green-400 to-green-600"
} as const;

// Roles that require special clearance
export const restrictedRoles: UserRole[] = ['admin', 'teacher', 'school_leader'];

// Updated clearance code to "1111" for all restricted roles
export const clearanceCode1111 = '1111';
