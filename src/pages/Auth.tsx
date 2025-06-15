
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import RoleSelector from "@/components/auth/RoleSelector";
import AuthForm from "@/components/auth/AuthForm";
import { UserRole } from "@/types/auth";
import { useRoleUpgrade } from "@/hooks/useRoleUpgrade";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";

const Auth = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(
    (searchParams.get('role') as UserRole) || null
  );

  // Run automatic "role upgrade after login" logic
  useRoleUpgrade();
  
  // Handle automatic redirect after successful auth
  useAuthRedirect();

  if (!selectedRole) {
    return (
      <RoleSelector
        onRoleSelect={setSelectedRole}
        onBack={() => navigate('/')}
      />
    );
  }

  return (
    <AuthForm
      selectedRole={selectedRole}
      onRoleDeselect={() => setSelectedRole(null)}
    />
  );
};

export default Auth;
