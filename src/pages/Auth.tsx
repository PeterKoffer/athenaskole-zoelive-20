
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import RoleSelector from "@/components/auth/RoleSelector";
import AuthForm from "@/components/auth/AuthForm";
import { UserRole } from "@/types/auth";
import { useRoleUpgrade } from "@/hooks/useRoleUpgrade";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { useRoleAccess } from "@/hooks/useRoleAccess";
import { useAuth } from "@/hooks/useAuth";

const Auth = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
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
    
    // If user is already authenticated, just redirect to appropriate dashboard
    if (user) {
      console.log('[Auth] User is authenticated, redirecting to dashboard');
      // Redirect based on the new role
      switch (role) {
        case 'admin':
          navigate('/admin-dashboard');
          break;
        case 'school_leader':
        case 'school_staff':
          navigate('/school-dashboard');
          break;
        case 'teacher':
          navigate('/teacher-dashboard');
          break;
        case 'parent':
          navigate('/parent-dashboard');
          break;
        case 'student':
          navigate('/daily-program');
          break;
        default:
          navigate('/');
          break;
      }
    }
  };

  const handleRoleDeselect = () => {
    console.log('[Auth] Role deselected');
    setSelectedRole(null);
  };

  // If user is authenticated and just switching roles, show role selector
  if (user && !selectedRole) {
    return (
      <RoleSelector
        onRoleSelect={handleRoleSelect}
        onBack={() => navigate('/profile')}
        currentUserRole={userRole}
      />
    );
  }

  // If user is authenticated and has selected a role, redirect them
  if (user && selectedRole) {
    return null; // Will redirect via useEffect above
  }

  // If no role selected, show role selector
  if (!selectedRole) {
    return (
      <RoleSelector
        onRoleSelect={handleRoleSelect}
        onBack={() => navigate('/')}
        currentUserRole={userRole}
      />
    );
  }

  // Show auth form for unauthenticated users
  return (
    <AuthForm
      selectedRole={selectedRole}
      onRoleDeselect={handleRoleDeselect}
    />
  );
};

export default Auth;
