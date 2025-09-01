// supabase/functions/image-service/index.ts
import { ok, bad, handleOptions } from "../_shared/http.ts";
import { bflGenerateImage } from "../_shared/imageProviders.ts";

Deno.serve(async (req) => {
  const opt = handleOptions(req);
  if (opt) return opt;

  if (req.method !== "POST") return bad("Method not allowed", 405);

  // Input
  let body: any;
  try {
    body = await req.json();
  } catch {
    return bad("Invalid JSON body", 400);
  }

  const provider = (Deno.env.get("IMAGE_PROVIDER") || "bfl").toLowerCase();
  const prompt = String(body.prompt ?? body.title ?? "Untitled");
  const width = Number(body.width ?? 1024);
  const height = Number(body.height ?? 1024);

  if (provider !== "bfl") {
    return bad("Only 'bfl' supported in this build", 501);
  }

  const apiKey = Deno.env.get("BFL_API_KEY");
  if (!apiKey) return bad("Missing BFL_API_KEY", 500);

  try {
    const { url, raw } = await bflGenerateImage({
      prompt,
      width,
      height,
      apiKey,
      seed: body.seed,
      promptUpsampling: body.promptUpsampling,
      outputFormat: body.outputFormat,
      safetyTolerance: body.safetyTolerance,
    });

    // Returnér et stabilt svarformat som UI kan bruge
    return ok({
      ok: true,
      provider: "bfl",
      model: Deno.env.get("BFL_MODEL") ?? "flux-pro-1.1",
      url,
      width,
      height,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return bad(msg, 502);
  }
});
