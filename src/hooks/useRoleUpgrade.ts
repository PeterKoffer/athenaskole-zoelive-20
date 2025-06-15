
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { UserRole, ROLE_CONFIGS } from "@/types/auth";
import { useToast } from "@/hooks/use-toast";
import { useRoleAccess } from "@/hooks/useRoleAccess";

/**
 * Checks and "upgrades" (fixes) user role in Supabase metadata for accounts that have a stale/legacy or missing role,
 * after login. Only runs after login, and does nothing if the user's role is already set and correct.
 */
export function useRoleUpgrade() {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const { setUserRoleManually, userRole } = useRoleAccess();

  useEffect(() => {
    async function maybeUpgradeRole() {
      // Only run after login completes and we have a user
      if (loading || !user) return;

      console.log("[useRoleUpgrade] Checking user role for:", user.email);

      // Meta role
      const metaRole = user.user_metadata?.role;
      console.log("[useRoleUpgrade] Current meta role:", metaRole);
      
      // If we already have a valid role (either from metadata or session), don't interfere
      if ((metaRole && ROLE_CONFIGS[metaRole as UserRole]) || userRole) {
        console.log("[useRoleUpgrade] Valid role already exists, no upgrade needed");
        return;
      }

      console.log("[useRoleUpgrade] No valid role found, attempting to infer from email");

      // Fallback: use email hint
      let guessedRole: UserRole | null = null;
      const email = user.email || "";
      
      if (email.includes("school") || email.includes("leader")) {
        guessedRole = "school_leader";
      } else if (email.includes("teacher")) {
        guessedRole = "teacher";
      } else if (email.includes("parent")) {
        guessedRole = "parent";
      } else if (email.includes("admin")) {
        guessedRole = "admin";
      } else {
        // For testing purposes, if no pattern matches, default to school_leader
        // This helps with the current issue where test accounts don't have role metadata
        console.log("[useRoleUpgrade] No email pattern match, defaulting to school_leader for testing");
        guessedRole = "school_leader";
      }

      // If we determined a role, upgrade immediately in Supabase and local state
      if (guessedRole) {
        try {
          console.log("[useRoleUpgrade] Upgrading to role:", guessedRole);
          
          await supabase.auth.updateUser({
            data: {
              ...user.user_metadata,
              role: guessedRole,
            },
          });
          
          // Immediately set in local state
          setUserRoleManually(guessedRole);
          
          toast({
            title: "Role updated!",
            description: `Your account has been set to ${ROLE_CONFIGS[guessedRole].title}.`,
          });
          
        } catch (err: any) {
          console.error("[useRoleUpgrade] Failed to update role:", err);
          toast({
            title: "Role upgrade failed",
            description: err.message || "Please contact support.",
            variant: "destructive",
          });
        }
      }
    }
    
    maybeUpgradeRole();
    // Only run when user or loading state changes, not when userRole changes
  }, [user, loading, setUserRoleManually, toast]);
}
