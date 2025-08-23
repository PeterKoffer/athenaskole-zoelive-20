import { supabase } from "@/integrations/supabase/client";
import { memoClear, memoNamespace } from "@/utils/cache";

// Initialize cache namespace and set up auth state management
let initialized = false;

export function initializeCacheAuth() {
  if (initialized) return;
  initialized = true;

  // Set initial namespace
  supabase.auth.getUser().then(({ data }) => {
    memoNamespace.set(data.user?.id ?? "anon");
  });

  // Clear cache and update namespace on auth changes
  supabase.auth.onAuthStateChange((event, session) => {
    // Always purge cache on auth state changes to prevent cross-user leaks
    memoClear();
    
    // Set new namespace
    memoNamespace.set(session?.user?.id ?? "anon");
    
    console.debug(`[cache] Auth state changed: ${event}, namespace: ${session?.user?.id ?? "anon"}`);
  });
}

// Auto-initialize when module is imported
initializeCacheAuth();