
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home } from "lucide-react";
import { UserRole, ROLE_CONFIGS } from "@/types/auth";
import { restrictedRoles } from "./role-selector/roleConstants";
import ClearanceForm from "./role-selector/ClearanceForm";
import RoleGrid from "./role-selector/RoleGrid";

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
  const [showClearanceInput, setShowClearanceInput] = useState(false);

  // Filter roles based on current user role restrictions - but be more permissive
  const availableRoles = Object.entries(ROLE_CONFIGS).filter(([role, config]) => {
    // Always show all roles if no current user role (new users)
    if (!currentUserRole) {
      console.log('[RoleSelector] No current user role, showing all roles');
      return true;
    }
    
    // Admin can access any role
    if (currentUserRole === 'admin') {
      console.log('[RoleSelector] Admin user, showing all roles'); 
      return true;
    }
    
    // School leader can access most roles except admin
    if (currentUserRole === 'school_leader' && role !== 'admin') {
      console.log('[RoleSelector] School leader user, showing role:', role);
      return true;
    }
    
    // Check if the role is restricted from the current user
    if (config.restrictedFrom?.includes(currentUserRole)) {
      console.log('[RoleSelector] Role', role, 'is restricted from', currentUserRole);
      return false;
    }
    
    console.log('[RoleSelector] Allowing role:', role, 'for user:', currentUserRole);
    return true;
  });

  console.log('[RoleSelector] Current user role:', currentUserRole);
  console.log('[RoleSelector] Available roles:', availableRoles.map(([role]) => role));
  console.log('[RoleSelector] All roles in ROLE_CONFIGS:', Object.keys(ROLE_CONFIGS));

  const handleRoleClick = (role: UserRole) => {
    console.log('[RoleSelector] Role clicked:', role);
    if (restrictedRoles.includes(role)) {
      setSelectedRole(role);
      setShowClearanceInput(true);
    } else {
      onRoleSelect(role);
    }
  };

  const handleClearanceSuccess = (role: UserRole) => {
    onRoleSelect(role);
  };

  const handleClearanceCancel = () => {
    setShowClearanceInput(false);
    setSelectedRole(null);
  };

  if (showClearanceInput && selectedRole) {
    return (
      <ClearanceForm
        selectedRole={selectedRole}
        onSuccess={handleClearanceSuccess}
        onCancel={handleClearanceCancel}
      />
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
          {currentUserRole && (
            <p className="text-gray-400 text-sm mt-2">Current role: {currentUserRole}</p>
          )}
        </CardHeader>
        <CardContent>
          <RoleGrid 
            availableRoles={availableRoles}
            onRoleClick={handleRoleClick}
          />
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
