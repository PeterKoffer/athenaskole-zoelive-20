
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { GraduationCap, Users, BookOpen, Building, Shield, Home, Lock } from "lucide-react";
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
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [clearanceCode, setClearanceCode] = useState("");
  const [showClearanceInput, setShowClearanceInput] = useState(false);
  const [clearanceError, setClearanceError] = useState("");

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

  // Roles that require special clearance
  const restrictedRoles = ['admin', 'teacher', 'school_leader'];

  // Mock clearance codes (in real app, this would be validated on the backend)
  const clearanceCodes = {
    admin: 'ADMIN2025',
    teacher: 'TEACH2025',
    school_leader: 'SCHOOL2025'
  };

  // Filter roles based on current user role restrictions
  const availableRoles = Object.entries(ROLE_CONFIGS).filter(([role, config]) => {
    if (!currentUserRole) return true;
    if (currentUserRole === 'admin') return true;
    if (currentUserRole === 'school_leader' && role !== 'admin') return true;
    if (config.restrictedFrom?.includes(currentUserRole)) return false;
    return true;
  });

  const handleRoleClick = (role: UserRole) => {
    if (restrictedRoles.includes(role)) {
      setSelectedRole(role);
      setShowClearanceInput(true);
      setClearanceError("");
      setClearanceCode("");
    } else {
      onRoleSelect(role);
    }
  };

  const handleClearanceSubmit = () => {
    if (!selectedRole) return;

    const expectedCode = clearanceCodes[selectedRole as keyof typeof clearanceCodes];
    
    if (clearanceCode === expectedCode) {
      onRoleSelect(selectedRole);
    } else {
      setClearanceError("Invalid clearance code. Please contact your administrator for access.");
    }
  };

  const handleClearanceCancel = () => {
    setShowClearanceInput(false);
    setSelectedRole(null);
    setClearanceCode("");
    setClearanceError("");
  };

  if (showClearanceInput && selectedRole) {
    const config = ROLE_CONFIGS[selectedRole];
    const IconComponent = roleIcons[selectedRole];
    const colorClass = roleColors[selectedRole];

    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-gray-800 border-gray-700">
          <CardHeader className="text-center">
            <div className={`w-16 h-16 bg-gradient-to-br ${colorClass} rounded-full flex items-center justify-center mx-auto mb-4`}>
              <IconComponent className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-white text-xl mb-2">
              {config.title} Access
            </CardTitle>
            <p className="text-gray-300 text-sm">
              This role requires special clearance. Please enter your access code.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="clearance" className="text-white">Clearance Code</Label>
              <Input
                id="clearance"
                type="password"
                value={clearanceCode}
                onChange={(e) => setClearanceCode(e.target.value)}
                placeholder="Enter clearance code"
                className="bg-gray-700 border-gray-600 text-white"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleClearanceSubmit();
                  }
                }}
              />
            </div>

            {clearanceError && (
              <Alert className="bg-red-900 border-red-700">
                <Lock className="h-4 w-4" />
                <AlertDescription className="text-red-200">
                  {clearanceError}
                </AlertDescription>
              </Alert>
            )}

            <div className="flex space-x-3">
              <Button
                onClick={handleClearanceSubmit}
                className="flex-1 bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600"
                disabled={!clearanceCode.trim()}
              >
                Verify Access
              </Button>
              <Button
                variant="outline"
                onClick={handleClearanceCancel}
                className="border-gray-600 text-white hover:bg-gray-700"
              >
                Cancel
              </Button>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-400">
                Need access? Contact your system administrator.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

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
              const requiresClearance = restrictedRoles.includes(role);
              
              return (
                <Button
                  key={role}
                  variant="outline"
                  className="h-auto p-6 bg-gray-700 border-gray-600 hover:bg-gray-600 text-white flex flex-col items-center justify-center space-y-4 min-h-[200px] relative"
                  onClick={() => handleRoleClick(role as UserRole)}
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
                        Requires clearance
                      </span>
                    )}
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
