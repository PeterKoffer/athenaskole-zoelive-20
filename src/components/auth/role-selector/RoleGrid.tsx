
import { School, Users, User, BookOpen, GraduationCap, UserCheck } from "lucide-react";
import { UserRole, ROLE_CONFIGS } from "@/types/auth";
import { restrictedRoles } from "./roleConstants";
import RoleCard from "./RoleCard";

interface RoleGridProps {
  availableRoles: [string, any][];
  onRoleClick: (role: UserRole) => void;
}

const RoleGrid = ({ availableRoles, onRoleClick }: RoleGridProps) => {
  const getRoleConfig = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return { icon: UserCheck, color: 'bg-red-500' };
      case 'school_leader':
        return { icon: School, color: 'bg-orange-500' };
      case 'school_staff':
        return { icon: Users, color: 'bg-teal-500' };
      case 'teacher':
        return { icon: BookOpen, color: 'bg-purple-500' };
      case 'student':
        return { icon: GraduationCap, color: 'bg-blue-500' };
      case 'parent':
        return { icon: User, color: 'bg-green-500' };
      default:
        return { icon: User, color: 'bg-gray-500' };
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {availableRoles.map(([role, roleConfig]) => {
        const config = getRoleConfig(role as UserRole);
        const isRestricted = restrictedRoles.includes(role as UserRole);
        
        return (
          <RoleCard
            key={role}
            role={role as UserRole}
            config={{
              title: roleConfig.title,
              description: roleConfig.description,
              icon: config.icon,
              color: config.color
            }}
            isRestricted={isRestricted}
            onClick={() => onRoleClick(role as UserRole)}
          />
        );
      })}
    </div>
  );
};

export default RoleGrid;
