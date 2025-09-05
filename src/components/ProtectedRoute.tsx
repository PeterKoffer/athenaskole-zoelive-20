// src/components/ProtectedRoute.tsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

type Props = {
  children: React.ReactNode;
  requireAuth?: boolean;
  requiredRole?: string; // e.g. "teacher" | "school_leader"
};

const ProtectedRoute: React.FC<Props> = ({ children, requireAuth = true, requiredRole }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return null;

  if (requireAuth && !user) {
    return <Navigate to="/auth" state={{ from: location.pathname }} replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
