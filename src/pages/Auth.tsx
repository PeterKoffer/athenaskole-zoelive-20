
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import RoleSelector from "@/components/auth/RoleSelector";
import AuthForm from "@/components/auth/AuthForm";
import { UserRole } from "@/types/auth";

const Auth = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(
    (searchParams.get('role') as UserRole) || null
  );

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
