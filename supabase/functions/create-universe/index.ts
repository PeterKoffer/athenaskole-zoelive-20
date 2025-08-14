// @ts-ignore - Deno runtime
declare global {
  var Deno: {
    env: {
      get(key: string): string | undefined;
    };
    serve(handler: (req: Request) => Promise<Response> | Response): void;
  };
}

// @ts-ignore - JSR import for Deno
import { createClient } from "jsr:@supabase/supabase-js@2";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": 
    "authorization, content-type, apikey, x-client-info",
  "Content-Type": "application/json",
} as const;

const json = (obj: unknown, status = 200) =>
  new Response(JSON.stringify(obj), { status, headers: CORS });

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: CORS });

  // Forward the caller's JWT so RLS applies
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    { global: { headers: { Authorization: req.headers.get("Authorization") || "" } } }
  );

  try {
    const body = await req.json().catch(() => ({}));
    const { data: { user }, error: authErr } = await supabase.auth.getUser();
    if (authErr || !user) return json({ error: "Unauthorized" }, 401);

    // Minimal validation
    const title = String(body?.title ?? "").trim();
    const subject = String(body?.subject ?? "").trim();
    const gradeLevel = String(body?.gradeLevel ?? "").trim();
    const lang = String(body?.lang ?? "en").trim();
    const visibility = body?.visibility === "public" ? "public" : "private";
    if (!title || !subject || !gradeLevel)
      return json({ error: "title, subject, gradeLevel are required" }, 400);

    // Slug (unique per owner)
    const base = title.toLowerCase()
      .normalize("NFKD").replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
    let slug = base; let n = 1;
    // try a few suffixes
    while (n < 6) {
      const { data: exists } = await supabase
        .from("universes")
        .select("id")
        .eq("owner_id", user.id)
        .eq("slug", slug)
        .maybeSingle();
      if (!exists) break;
      slug = `${base}-${++n}`;
    }

    const { data, error } = await supabase
      .from("universes")
      .insert({
        owner_id: user.id,
        title,
        subject,
        grade_level: gradeLevel,
        lang,
        visibility,
        slug,
        image_status: "pending",
      })
      .select("*")
      .single();

    if (error) return json({ error: error.message }, 400);
    return json({ success: true, universe: data });
  } catch (e: any) {
    return json({ error: e?.message ?? "unknown error" }, 500);
  }
});