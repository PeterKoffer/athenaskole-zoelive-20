// @ts-ignore - Deno runtime
declare global {
  var Deno: {
    env: {
      get(key: string): string | undefined;
    };
    serve(handler: (req: Request) => Promise<Response> | Response): void;
  };
}

import { createClient } from "@supabase/supabase-js";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
} as const;

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY") || "";

// Run queries **as the user** (RLS applies) by using the JWT from the request
function userClient(authHeader: string | null) {
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: authHeader || "" } },
  });
}

const json = (obj: unknown, status = 200) =>
  new Response(JSON.stringify(obj), { status, headers: corsHeaders });

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function ensureUniqueSlug(
  supabase: ReturnType<typeof userClient>,
  baseSlug: string
) {
  let slug = baseSlug;
  for (let i = 1; i < 20; i++) {
    const { data, error } = await supabase
      .from("universes")
      .select("id")
      .eq("slug", slug)
      .limit(1)
      .maybeSingle();
    if (error) throw error;
    if (!data) return slug;
    slug = `${baseSlug}-${i + 1}`;
  }
  throw new Error("Could not generate unique slug");
}

function subjectPlaceholder(subject?: string) {
  const host = SUPABASE_URL.replace(/^https?:\//, "");
  const key = 
    (subject || "").toLowerCase().replace(/[^a-z]/g, "");
  // fallback chain: subject.png > default.png
  return `https://${host}/storage/v1/object/public/universe-images/${key || "default"}.png`;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const auth = req.headers.get("authorization");
  if (!auth) return json({ error: "Missing authorization" }, 400);

  const supabase = userClient(auth);

  let body: any = {};
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }

  // Basic validation
  const title = (body.title ?? "").toString().trim();
  const subject = (body.subject ?? "").toString().trim();
  const grade_level = (body.gradeLevel ?? body.grade_level ?? "").toString().trim();
  const lang = (body.lang ?? "en").toString().trim();
  const visibility = (body.visibility ?? "private").toString().trim();
  const description = (body.description ?? "").toString().trim();
  const goals = body.goals ?? null;

  if (!title || !subject || !grade_level) {
    return json(
      { error: "title, subject, and gradeLevel are required" },
      400
    );
  }

  // Resolve owner_id from the JWT
  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();
  if (userErr || !user) return json({ error: "Unauthorized" }, 401);

  // Slug
  const baseSlug = slugify(body.slug ?? title);
  let slug: string;
  try {
    slug = await ensureUniqueSlug(supabase, baseSlug);
  } catch (e: any) {
    return json({ error: `Slug error: ${e?.message}` }, 400);
  }

  // Placeholder image (subject -> subject.png -> default.png)
  const img = subjectPlaceholder(subject);

  // Insert
  const { data, error } = await supabase
    .from("universes")
    .insert({
      owner_id: user.id,
      slug,
      title,
      subject,
      grade_level,
      lang,
      visibility,
      description: description || null,
      goals,
      image_url: img,
      image_status: "none",
    })
    .select("*")
    .single();

  if (error) return json({ error: error.message }, 400);

  // Optional: prime your image cache row as "locked"
  // If you have a universe_images table with the same pattern,
  // you can safely ignore duplicates.
  // await supabase.from("universe_images").upsert({
  //   universe_id: data.id, lang, image_url: img, source: "fallback"
  // }, { onConflict: "universe_id,lang" });

  return json({ success: true, universe: data });
});