
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Shield, School, Users, BookOpen, GraduationCap, UserCheck } from "lucide-react";
import { UserRole, ROLE_CONFIGS } from "@/types/auth";

interface RoleSelectorProps {
  onRoleSelect: (role: UserRole) => void;
  onBack: () => void;
  currentUserRole?: UserRole | null;
}

const roleIcons: Record<UserRole, React.ComponentType<any>> = {
  admin: Shield,
  school_leader: School,
  school_staff: UserCheck,
  teacher: BookOpen,
  student: GraduationCap,
  parent: Users,
};

const roleColors: Record<UserRole, string> = {
  admin: "from-red-500 to-red-600",
  school_leader: "from-orange-500 to-orange-600", 
  school_staff: "from-teal-500 to-teal-600",
  teacher: "from-purple-500 to-purple-600",
  student: "from-blue-500 to-blue-600",
  parent: "from-green-500 to-green-600",
};

const RoleSelector = ({ onRoleSelect, onBack, currentUserRole }: RoleSelectorProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl bg-gray-800/90 backdrop-blur-sm border-gray-700 shadow-2xl">
        <CardHeader className="relative pb-8">
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute left-4 top-4 text-gray-400 hover:text-white hover:bg-gray-700/50"
            onClick={onBack}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="text-center pt-4">
            <CardTitle className="text-3xl font-bold text-white mb-2">
              Choose Your Role
            </CardTitle>
            <p className="text-gray-300 text-lg">
              Select how you'll be using the platform
            </p>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-8">
          {Object.entries(ROLE_CONFIGS).map(([role, config]) => {
            const IconComponent = roleIcons[role as UserRole];
            const colorClass = roleColors[role as UserRole];
            
            return (
              <Card
                key={role}
                className="group relative overflow-hidden bg-gray-700/50 border-gray-600 hover:border-gray-500 transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer"
                onClick={() => onRoleSelect(role as UserRole)}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${colorClass} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                
                <CardContent className="p-6 h-full flex flex-col items-center text-center space-y-4 relative z-10">
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${colorClass} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-white group-hover:text-gray-100">
                      {config.title}
                    </h3>
                    <p className="text-sm text-gray-300 group-hover:text-gray-200 leading-relaxed">
                      {config.description}
                    </p>
                  </div>
                  
                  <div className="mt-auto pt-4">
                    <div className={`px-4 py-2 rounded-full bg-gradient-to-r ${colorClass} text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0`}>
                      Select Role
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
};

export default RoleSelector;
