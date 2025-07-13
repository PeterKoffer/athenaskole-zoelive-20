
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useRoleAccess } from "@/hooks/useRoleAccess";

interface AccessControlProps {
  children: React.ReactNode;
}

const SchoolDashboardAccessControl = ({ children }: AccessControlProps) => {
  const { userRole } = useRoleAccess();
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  console.log('[SchoolDashboardAccessControl] Current state:', { 
    userRole, 
    loading, 
    userEmail: user?.email,
    hasUser: !!user 
  });

  // Show loading state while auth is loading
  if (loading) {
    console.log('[SchoolDashboardAccessControl] Showing loading state');
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-white text-lg font-semibold">Loading School Dashboard...</h2>
          <p className="text-gray-400 mt-2">Preparing your educational management system...</p>
        </div>
      </div>
    );
  }

  // If no user, show auth required
  if (!user) {
    console.log('[SchoolDashboardAccessControl] No user, showing access denied');
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔐</div>
          <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
          <p className="text-gray-400">Please log in to access the school dashboard.</p>
          <Button 
            onClick={() => navigate('/auth')}
            className="mt-4 bg-purple-600 hover:bg-purple-700"
          >
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  // Check access permissions - only allow school_leader and admin
  const allowedRoles = ['admin', 'school_leader'];
  const hasAccess = userRole && allowedRoles.includes(userRole);
  
  console.log('[SchoolDashboardAccessControl] Access check:', { 
    userRole, 
    allowedRoles, 
    hasAccess,
    hasUser: !!user 
  });

  // If user exists but doesn't have access, show role-based access denied
  if (!hasAccess) {
    console.log('[SchoolDashboardAccessControl] User exists but no access, role:', userRole);
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🏫</div>
          <h1 className="text-2xl font-bold mb-4">School Leader Access Required</h1>
          <p className="text-gray-400 mb-2">You need school leader or administrator privileges to access this dashboard.</p>
          <p className="text-gray-400 mb-4">Current role: {userRole || 'None assigned'}</p>
          <Button 
            onClick={() => navigate('/auth')}
            className="bg-purple-600 hover:bg-purple-700 mr-2"
          >
            Change Role
          </Button>
          <Button 
            onClick={() => navigate('/')}
            variant="outline"
            className="border-gray-600 text-white hover:bg-gray-700"
          >
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  // User has access - render the dashboard content
  console.log('[SchoolDashboardAccessControl] Rendering dashboard content for user:', user.email, 'with role:', userRole);
  return <>{children}</>;
};

export default SchoolDashboardAccessControl;
