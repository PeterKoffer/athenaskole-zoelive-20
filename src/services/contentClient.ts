+// src/services/contentClient.ts
+// Thin wrapper around Supabase Edge Function `generate-content`
+
+import { createClient } from "@supabase/supabase-js";
+
+const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
+const anon = import.meta.env.VITE_SUPABASE_ANON as string | undefined;
+
+if (!url || !anon) {
+ // Do not throw during module import to avoid breaking dev server tooling.
+ // We fail fast at call time with a clearer error.
+ // eslint-disable-next-line no-console
+ console.warn(
+ "[contentClient] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON env. Edge function calls will fail until set."
+ );
+}
+
+export const supabase = url && anon ? createClient(url, anon) : undefined;
+
+export async function generateLesson(body: any): Promise<any> {
+ if (!supabase) {
+ throw new Error(
+ "Supabase client not initialized. Check VITE_SUPABASE_URL and VITE_SUPABASE_ANON in .env.local"
+ );
+ }
+ const { data, error } = await supabase.functions.invoke("generate-content", {
+ body,
+ });
+ if (error) throw error;
+ // Our edge function typically returns { ok, data } — support both shapes.
+ // @ts-expect-error - tolerate unknown structure
+ return data?.data ?? data;
+}
+
