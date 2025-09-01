// deno run --allow-net --allow-env
import { createClient } from "npm:@supabase/supabase-js@2";

type Payload = {
  universeId: string;
  gradeInt: number;
  title: string;
  width: number;
  height: number;
};

// TODO: Plug din nuværende generator ind her og returnér { url: string }
async function generateRawImage(_p: Payload): Promise<{ url: string }> {
  // Du har allerede en generator der giver en data: URL — kald den her.
  // Midlertidigt stub for at illustrere strukturen:
  return { url: "data:image/jpeg;base64,/9j/4AAQSkZJRgABA..." };
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
      "Access-Control-Allow-Methods": "POST,OPTIONS",
    },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return json({});
  try {
    const payload = (await req.json()) as Payload;

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")! // service role for upload
    );

    // 1) Generér billedet (kan returnere data: eller http:)
    const { url: rawUrl } = await generateRawImage(payload);

    // 2) Hvis http(s), returnér direkte. Ellers upload til Storage.
    let publicUrl = rawUrl;
    if (rawUrl.startsWith("data:")) {
      const [meta, b64] = rawUrl.split(",");
      const mime = /data:(.*);base64/.exec(meta)?.[1] ?? "image/jpeg";
      const ext = mime.split("/")[1] || "jpg";
      const path = `covers/${crypto.randomUUID()}.${ext}`;

      const bytes = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
      const { error: upErr } = await supabase.storage.from("images").upload(path, bytes, {
        contentType: mime,
        upsert: false,
      });
      if (upErr) return json({ error: upErr.message }, 500);

      const { data } = supabase.storage.from("images").getPublicUrl(path);
      publicUrl = data.publicUrl;
    }

    return json({ url: publicUrl }, 200);
  } catch (e) {
    return json({ error: (e as Error).message ?? "unknown error" }, 500);
  }
});
