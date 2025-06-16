
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import RoleSelector from "@/components/auth/RoleSelector";
import AuthForm from "@/components/auth/AuthForm";
import { UserRole } from "@/types/auth";
import { useRoleUpgrade } from "@/hooks/useRoleUpgrade";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { useRoleAccess } from "@/hooks/useRoleAccess";

const Auth = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { userRole, setUserRoleManually } = useRoleAccess();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(
    (searchParams.get('role') as UserRole) || null
  );

  // Run automatic "role upgrade after login" logic
  useRoleUpgrade();
  
  // Handle automatic redirect after successful auth
  useAuthRedirect();

  // Clear any existing role when entering auth page for role switching
  useEffect(() => {
    console.log('[Auth] Entering auth page, current role:', userRole);
    
    // If we're coming here to switch roles, clear the manual role change flag after a delay
    // to allow the user to select a new role
    if (userRole) {
      console.log('[Auth] User has existing role, allowing role switching');
    }
  }, [userRole]);

  const handleRoleSelect = (role: UserRole) => {
    console.log('[Auth] Role selected:', role);
    setSelectedRole(role);
    // Set the role manually to trigger the role change process
    setUserRoleManually(role);
  };

  const handleRoleDeselect = () => {
    console.log('[Auth] Role deselected');
    setSelectedRole(null);
  };

  if (!selectedRole) {
    return (
      <RoleSelector
        onRoleSelect={handleRoleSelect}
        onBack={() => navigate('/')}
        currentUserRole={userRole}
      />
    );
  }

  return (
    <AuthForm
      selectedRole={selectedRole}
      onRoleDeselect={handleRoleDeselect}
    />
  );
};

export default Auth;
