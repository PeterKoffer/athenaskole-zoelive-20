
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { UserRole, ROLE_CONFIGS } from "@/types/auth";

interface RoleSelectorProps {
  onRoleSelect: (role: UserRole) => void;
  onBack: () => void;
  currentUserRole?: UserRole | null;
}

const RoleSelector = ({ onRoleSelect, onBack, currentUserRole }: RoleSelectorProps) => {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-gray-800 border-gray-700">
        <CardHeader className="relative">
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute left-2 top-2 text-gray-400 hover:text-white hover:bg-gray-700"
            onClick={onBack}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <CardTitle className="text-center text-white">
            Choose Your Role
          </CardTitle>
          <p className="text-gray-400 text-center">
            Select how you'll be using the platform
          </p>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(ROLE_CONFIGS).map(([role, config]) => (
            <Button
              key={role}
              onClick={() => onRoleSelect(role as UserRole)}
              className="h-auto p-4 bg-gray-700 hover:bg-purple-600 text-left flex flex-col items-start space-y-2 border border-gray-600"
              variant="outline"
            >
              <span className="font-semibold text-white">{config.title}</span>
              <span className="text-sm text-gray-300">{config.description}</span>
            </Button>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default RoleSelector;
