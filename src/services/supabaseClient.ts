// src/services/supabaseClient.ts
// Shim der bevarer gamle imports og peger på den kanoniske klient i lib/
import supabaseDefault, { getSupabase, supabase } from "@/lib/supabaseClient";

export { getSupabase, supabase };
export default supabaseDefault;
