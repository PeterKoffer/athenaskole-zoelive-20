
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserRole } from "@/types/auth";
import { roleIcons, roleColors } from "./roleConstants";

interface RoleGridProps {
  availableRoles: [string, any][];
  onRoleClick: (role: UserRole) => void;
}

const RoleGrid = ({ availableRoles, onRoleClick }: RoleGridProps) => {
  console.log('[RoleGrid] Available roles:', availableRoles.map(([role]) => role));
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {availableRoles.map(([role, config]) => {
        const Icon = roleIcons[role as UserRole];
        const colorClass = roleColors[role as UserRole];
        
        return (
          <Card
            key={role}
            className="bg-gray-700 border-gray-600 hover:bg-gray-600 cursor-pointer transition-colors"
            onClick={() => onRoleClick(role as UserRole)}
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-lg flex items-center">
                <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${colorClass} flex items-center justify-center mr-3`}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
                {config.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 text-sm">{config.description}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default RoleGrid;
