// Auth cache wiring (no cache import to avoid cycles)
import { supabase } from "@/integrations/supabase/client";

export function wireAuthCache(onScope: (ns: string) => void, onClear: () => void) {
  // Set initial namespace
  supabase.auth.getUser().then(({ data }) => {
    onScope(data.user?.id ?? "anon");
  });

  // Clear cache and update namespace on auth changes
  supabase.auth.onAuthStateChange((event, session) => {
    // Always purge cache on auth state changes to prevent cross-user leaks
    onClear();
    
    // Set new namespace
    onScope(session?.user?.id ?? "anon");
    
    console.debug(`[cache] Auth state changed: ${event}, namespace: ${session?.user?.id ?? "anon"}`);
  });
}