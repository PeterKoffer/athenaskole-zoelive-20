
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";
import { UserRole, RoleConfig } from "@/types/auth";
import { roleIcons, roleColors, restrictedRoles } from "./roleConstants";

interface RoleCardProps {
  role: UserRole;
  config: RoleConfig;
  onRoleClick: (role: UserRole) => void;
}

const RoleCard = ({ role, config, onRoleClick }: RoleCardProps) => {
  const IconComponent = roleIcons[role];
  const colorClass = roleColors[role];
  const requiresClearance = restrictedRoles.includes(role);

  return (
    <Button
      variant="outline"
      className="h-auto p-6 bg-gray-700 border-gray-600 hover:bg-gray-600 text-white flex flex-col items-center justify-center space-y-4 min-h-[200px] relative"
      onClick={() => onRoleClick(role)}
    >
      {requiresClearance && (
        <div className="absolute top-2 right-2">
          <Lock className="w-4 h-4 text-yellow-400" />
        </div>
      )}
      
      <div className={`w-16 h-16 bg-gradient-to-br ${colorClass} rounded-full flex items-center justify-center`}>
        <IconComponent className="w-8 h-8 text-white" />
      </div>
      <div className="text-center space-y-2">
        <span className="font-semibold text-lg">{config.title}</span>
        <span className="text-sm text-gray-300 block">{config.description}</span>
        {requiresClearance && (
          <span className="text-xs text-yellow-400 block">
            Requires clearance (1111)
          </span>
        )}
      </div>
    </Button>
  );
};

export default RoleCard;
