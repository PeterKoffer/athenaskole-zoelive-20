
import { UserRole, ROLE_CONFIGS } from "@/types/auth";
import RoleCard from "./RoleCard";

interface RoleGridProps {
  availableRoles: [string, any][];
  onRoleClick: (role: UserRole) => void;
}

const RoleGrid = ({ availableRoles, onRoleClick }: RoleGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {availableRoles.map(([role, config]) => (
        <RoleCard
          key={role}
          role={role as UserRole}
          config={config}
          onRoleClick={onRoleClick}
        />
      ))}
    </div>
  );
};

export default RoleGrid;
