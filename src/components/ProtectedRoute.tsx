import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

type Props = {
  children: React.ReactNode;
  /** Kræv login? default = true */
  requireAuth?: boolean;
  /** Evt. krævet rolle, fx "teacher" | "school_leader" | "student" */
  requiredRole?: string;
};

function FullscreenSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin h-8 w-8 rounded-full border-4 border-gray-300 border-t-transparent" />
    </div>
  );
}

export default function ProtectedRoute({
  children,
  requireAuth = true,
  requiredRole,
}: Props) {
  const { user, loading } = useAuth();
  const location = useLocation();

  // 1) Mens vi ikke kender session endnu → vis spinner (ikke crash)
  if (loading) return <FullscreenSpinner />;

  // 2) Hvis auth er påkrævet men ingen bruger → send til /auth
  if (requireAuth && !user) {
    return <Navigate to="/auth" replace state={{ from: location }} />;
  }

  // 3) Rolle-krav (hvis specificeret)
  if (requiredRole && user && (user as any)?.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  // 4) Ellers vis indholdet
  return <>{children}</>;
}
