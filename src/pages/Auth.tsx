
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

  // Only redirect if coming from a protected route, not if directly accessing auth for role switching
  useEffect(() => {
    if (user && userRole && searchParams.get('redirect') === 'true') {
      console.log('[Auth] User is authenticated, redirecting based on role:', userRole);
      
      // Define target paths for each role
      const targetPaths: Record<string, string> = {
        'admin': '/school-dashboard',
        'school_leader': '/school-dashboard',
        'school_staff': '/school-dashboard',
        'teacher': '/teacher-dashboard',
        'parent': '/parent-dashboard',
        'student': '/daily-program'
      };
      
      const targetPath = targetPaths[userRole] || '/profile';
      console.log('[Auth] Redirecting authenticated user to:', targetPath);
      navigate(targetPath, { replace: true });
      return;
    }
  }, [user, userRole, navigate, searchParams]);

  const handleRoleSelect = (role: UserRole) => {
    console.log('[Auth] Role selected:', role);
    setSelectedRole(role);
    // Set the role manually to trigger the role change process
    setUserRoleManually(role);
    
    // If user is already authenticated, redirect immediately
    if (user) {
      console.log('[Auth] User is authenticated, redirecting to dashboard for role:', role);
      const targetPaths: Record<string, string> = {
        'admin': '/school-dashboard',
        'school_leader': '/school-dashboard',
        'school_staff': '/school-dashboard',
        'teacher': '/teacher-dashboard',
        'parent': '/parent-dashboard',
        'student': '/daily-program'
      };
      
      const targetPath = targetPaths[role] || '/profile';
      navigate(targetPath, { replace: true });
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

  // If user is authenticated and has selected a role, they should already be redirected
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
