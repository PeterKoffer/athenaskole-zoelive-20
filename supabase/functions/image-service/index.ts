// supabase/functions/image-service/index.ts
import { ok, bad, handleOptions } from "../_shared/http.ts";
import { bflGenerateImage } from "../_shared/imageProviders.ts";

Deno.serve(async (req) => {
  const opt = handleOptions(req); if (opt) return opt;
  if (req.method !== "POST") return bad("Method not allowed", 405);

  const bflKey = Deno.env.get("BFL_API_KEY");
  if (!bflKey) return bad("Missing BFL_API_KEY", 500);

  let body: any;
  try { body = await req.json(); } catch { return bad("Invalid JSON body"); }

  const prompt = String(body.title ?? body.prompt ?? "Untitled");
  const width = Number(body.width ?? 1024);
  const height = Number(body.height ?? 576);

  try {
    const { url } = await bflGenerateImage({ prompt, width, height, apiKey: bflKey });
    return ok({ provider: "bfl", url, width, height });
  } catch (e) {
    return bad(e instanceof Error ? e.message : String(e), 500);
  }
});
