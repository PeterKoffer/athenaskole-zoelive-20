import { ok, bad, handleOptions } from "../_shared/http.ts";
import { bflGenerateImage } from "../_shared/imageProviders.ts";

Deno.serve(async (req) => {
  const opt = handleOptions(req); if (opt) return opt;
  if (req.method !== "POST") return bad("Method not allowed", 405);

  const provider = (Deno.env.get("IMAGE_PROVIDER") || "bfl").toLowerCase();
  if (!["bfl", "replicate"].includes(provider)) return bad("Invalid IMAGE_PROVIDER");

  const bflKey = Deno.env.get("BFL_API_KEY");
  if (provider === "bfl" && !bflKey) return bad("Missing BFL_API_KEY", 500);

  let body: any;
  try { body = await req.json(); } catch { return bad("Invalid JSON body"); }

  const prompt = String(body.title ?? body.prompt ?? "Untitled");
  const width = Number(body.width ?? 1024);
  const height = Number(body.height ?? 576);

  try {
    if (provider === "bfl") {
      const { url } = await bflGenerateImage({ prompt, width, height, apiKey: bflKey! });
      return ok({ provider, url }); // simple og brugbart svar i UI
    }
    return bad("Replicate provider not enabled in this build", 501);
  } catch (e) {
    return bad(e instanceof Error ? e.message : String(e), 500);
  }
});
