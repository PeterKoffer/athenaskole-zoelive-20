
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Users, BookOpen, Building, Shield, Home } from "lucide-react";
import { UserRole, ROLE_CONFIGS } from "@/types/auth";

interface RoleSelectorProps {
  onRoleSelect: (role: UserRole) => void;
  onBack: () => void;
  currentUserRole?: UserRole;
}

const RoleSelector = ({
  onRoleSelect,
  onBack,
  currentUserRole
}: RoleSelectorProps) => {
  const roleIcons = {
    admin: Shield,
    school_leader: Building,
    teacher: BookOpen,
    student: GraduationCap,
    parent: Users
  };

  const roleColors = {
    admin: "from-red-400 to-red-600",
    school_leader: "from-orange-400 to-orange-600",
    teacher: "from-purple-400 to-purple-600",
    student: "from-blue-400 to-blue-600",
    parent: "from-green-400 to-green-600"
  };

  // Filter roles based on current user role restrictions
  const availableRoles = Object.entries(ROLE_CONFIGS).filter(([role, config]) => {
    if (!currentUserRole) return true;
    if (currentUserRole === 'admin') return true;
    if (currentUserRole === 'school_leader' && role !== 'admin') return true;
    if (config.restrictedFrom?.includes(currentUserRole)) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl bg-gray-800 border-gray-700">
        <CardHeader className="text-center relative">
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-4 top-4 text-gray-400 hover:text-white hover:bg-gray-700"
            onClick={onBack}
          >
            <Home className="w-4 h-4" />
          </Button>
          <CardTitle className="text-white text-2xl mb-4">Select User Role</CardTitle>
          <p className="text-gray-300">Choose how you want to access the system</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableRoles.map(([role, config]) => {
              const IconComponent = roleIcons[role as UserRole];
              const colorClass = roleColors[role as UserRole];
              
              return (
                <Button
                  key={role}
                  variant="outline"
                  className="h-auto p-6 bg-gray-700 border-gray-600 hover:bg-gray-600 text-white flex flex-col items-center justify-center space-y-4 min-h-[180px]"
                  onClick={() => onRoleSelect(role as UserRole)}
                >
                  <div className={`w-16 h-16 bg-gradient-to-br ${colorClass} rounded-full flex items-center justify-center`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-center space-y-2">
                    <span className="font-semibold text-lg">{config.title}</span>
                    <span className="text-sm text-gray-300 block">{config.description}</span>
                  </div>
                </Button>
              );
            })}
          </div>
          <div className="text-center mt-6">
            <Button 
              variant="outline" 
              onClick={onBack} 
              className="border-gray-600 text-zinc-950 bg-slate-50"
            >
              Back to home page
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RoleSelector;
