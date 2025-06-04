
import { Shield, School, Users, BookOpen, GraduationCap, UserCheck } from "lucide-react";
import { UserRole } from "@/types/auth";

export const roleIcons: Record<UserRole, React.ComponentType<any>> = {
  admin: Shield,
  school_leader: School,
  school_staff: UserCheck,
  teacher: BookOpen,
  student: GraduationCap,
  parent: Users,
};

export const roleColors: Record<UserRole, string> = {
  admin: "from-red-500 to-red-600",
  school_leader: "from-orange-500 to-orange-600", 
  school_staff: "from-teal-500 to-teal-600",
  teacher: "from-purple-500 to-purple-600",
  student: "from-blue-500 to-blue-600",
  parent: "from-green-500 to-green-600",
};

export const restrictedRoles: UserRole[] = ['admin', 'school_leader', 'school_staff'];

export const clearanceCode1111 = "1111";
