
import { useAuth } from "@/hooks/useAuth";
import { useRoleAccess } from "@/hooks/useRoleAccess";

const SchoolWelcomeBanner = () => {
  const { user } = useAuth();
  const { userRole } = useRoleAccess();

  return (
    <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-lg mb-6">
      <h1 className="text-3xl font-bold mb-2">Welcome to Your School Dashboard</h1>
      <p className="text-purple-100">
        Manage your educational institution with AI-powered insights and comprehensive tools.
      </p>
      <div className="mt-4 text-sm">
        <span className="bg-white/20 px-3 py-1 rounded-full">
          Logged in as: {userRole} • {user?.email || 'Guest User'}
        </span>
      </div>
    </div>
  );
};

export default SchoolWelcomeBanner;
