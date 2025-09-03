import { Outlet, Navigate, useLocation } from "react-router-dom";

// TODO: Erstat med rigtig auth (Supabase/context). Midlertidigt tillader vi adgang.
function useIsAuthenticated() { return true; }

export default function ProtectedRoute() {
  const authed = useIsAuthenticated();
  const loc = useLocation();
  if (!authed) return <Navigate to="/auth" replace state={{ from: loc }} />;
  return <Outlet />;
}
