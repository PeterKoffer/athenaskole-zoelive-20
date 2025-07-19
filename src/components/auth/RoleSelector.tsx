
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserRole, ROLE_CONFIGS } from "@/types/auth";
import { ArrowLeft } from "lucide-react";

interface RoleSelectorProps {
  onRoleSelect: (role: UserRole) => void;
  onBack: () => void;
  currentUserRole?: UserRole | null;
}

const RoleSelector = ({ onRoleSelect, onBack, currentUserRole }: RoleSelectorProps) => {
  const roles: UserRole[] = ['student', 'teacher', 'parent', 'school_staff', 'school_leader', 'admin'];

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-gray-800 border-gray-700">
        <CardHeader>
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-gray-400 hover:text-white hover:bg-gray-700"
              onClick={onBack}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <CardTitle className="text-white">
              {currentUserRole ? 'Switch Role' : 'Select Your Role'}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {roles.map((role) => {
              const config = ROLE_CONFIGS[role];
              return (
                <Card 
                  key={role}
                  className="bg-gray-700 border-gray-600 hover:bg-gray-600 cursor-pointer transition-colors"
                  onClick={() => onRoleSelect(role)}
                >
                  <CardContent className="p-4">
                    <h3 className="text-white font-semibold mb-2">{config.title}</h3>
                    <p className="text-gray-300 text-sm">{config.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RoleSelector;
