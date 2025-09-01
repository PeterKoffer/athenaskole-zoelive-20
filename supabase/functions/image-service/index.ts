cat > supabase/functions/image-service/index.ts <<'EOF'
import { ok, bad, handleOptions } from "../_shared/http.ts";
import { bflGenerateImage } from "../_shared/imageProviders.ts";

Deno.serve(async (req) => {
  const opt = handleOptions(req); if (opt) return opt;
  if (req.method !== "POST") return bad("Method not allowed", 405);

  let body: any; try { body = await req.json(); } catch { return bad("Invalid JSON body", 400); }

  const provider = (Deno.env.get("IMAGE_PROVIDER") || "bfl").toLowerCase();
  if (provider !== "bfl") return bad("Only 'bfl' supported in this build", 501);

  const apiKey = Deno.env.get("BFL_API_KEY");
  if (!apiKey) return bad("Missing BFL_API_KEY", 500);

  const prompt = String(body.prompt ?? body.title ?? "Untitled");
  const width  = Number(body.width  ?? 1024);
  const height = Number(body.height ?? 1024);

  try {
    const { url } = await bflGenerateImage({
      prompt, width, height, apiKey,
      seed: body.seed,
      promptUpsampling: body.promptUpsampling,
      outputFormat: body.outputFormat,
      safetyTolerance: body.safetyTolerance,
    });
    // Markør så vi kan SE at den nye kode kører
    return ok({ impl: "bfl-v1", provider: "bfl", model: Deno.env.get("BFL_MODEL") ?? "flux-pro-1.1", url, width, height });
  } catch (e) {
    return bad(e instanceof Error ? e.message : String(e), 502);
  }
});
EOF
