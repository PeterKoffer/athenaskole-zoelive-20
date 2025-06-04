
import { Badge } from "@/components/ui/badge";
import { Shield, School, BookOpen, GraduationCap, Users, UserCheck } from "lucide-react";
import { UserRole } from "@/types/auth";

interface UserRoleDisplayProps {
  role: UserRole;
  className?: string;
}

const UserRoleDisplay = ({ role, className }: UserRoleDisplayProps) => {
  const getRoleConfig = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return { icon: Shield, label: 'Administrator', color: 'bg-red-500' };
      case 'school_leader':
        return { icon: School, label: 'School Leader', color: 'bg-orange-500' };
      case 'school_staff':
        return { icon: UserCheck, label: 'School Staff', color: 'bg-teal-500' };
      case 'teacher':
        return { icon: BookOpen, label: 'Teacher', color: 'bg-purple-500' };
      case 'student':
        return { icon: GraduationCap, label: 'Student', color: 'bg-blue-500' };
      case 'parent':
        return { icon: Users, label: 'Parent', color: 'bg-green-500' };
      default:
        return { icon: GraduationCap, label: 'User', color: 'bg-gray-500' };
    }
  };

  const config = getRoleConfig(role);
  const Icon = config.icon;

  return (
    <Badge variant="outline" className={`${className} border-gray-600 text-white hover:bg-gray-700`}>
      <Icon className="w-3 h-3 mr-1" />
      {config.label}
    </Badge>
  );
};

export default UserRoleDisplay;
