
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { UserRole, ROLE_CONFIGS } from "@/types/auth";
import { useToast } from "@/hooks/use-toast";

/**
 * Checks and "upgrades" (fixes) user role in Supabase metadata for accounts that have a stale/legacy or missing role,
 * after login. Only runs after login, and does nothing if the user's role is already set and correct.
 */
export function useRoleUpgrade() {
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    async function maybeUpgradeRole() {
      // Only run after login. If user missing or role is valid, nothing to do.
      if (!user) return;

      // Meta role
      const metaRole = user.user_metadata?.role;
      if (metaRole && ROLE_CONFIGS[metaRole as UserRole]) {
        // Correct role already set, nothing to do.
        return;
      }

      // Infer upgrade. For most auto-migrations, we only upgrade if a role is entirely missing.
      // If user has an email e.g. school.leader@ -- and registered from school dashboard registration, etc.
      // Alternative strategies go here. For this example, just show a toast to prompt support to upgrade if email trigger fails.

      // Fallback: use email hint (if it contains "school")
      let guessedRole: UserRole | null = null;
      const email = user.email || "";
      if (email.includes("school")) {
        guessedRole = "school_leader";
      } else if (email.includes("teacher")) {
        guessedRole = "teacher";
      } else if (email.includes("parent")) {
        guessedRole = "parent";
      } else if (email.includes("admin")) {
        guessedRole = "admin";
      }

      // If we guessed, upgrade immediately in Supabase
      if (guessedRole && guessedRole !== metaRole) {
        try {
          await supabase.auth.updateUser({
            data: {
              ...user.user_metadata,
              role: guessedRole,
            },
          });
          toast({
            title: "Role updated!",
            description: `Your account has been upgraded to ${ROLE_CONFIGS[guessedRole].title}.`,
          });
          // Refresh is not strictly needed; the next useAuth/useRoleAccess renders will re-read user metadata.
        } catch (err: any) {
          toast({
            title: "Role upgrade failed",
            description: err.message || "Please contact support.",
            variant: "destructive",
          });
        }
      }
    }
    maybeUpgradeRole();
    // Only run when user changes (i.e., after fresh login)
  }, [user]);
}
