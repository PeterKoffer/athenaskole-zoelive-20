// supabase/functions/image-service/index.ts
import { ok, bad, handleOptions } from "../_shared/http.ts";

Deno.serve(async (req) => {
  // CORS preflight
  const opt = handleOptions(req);
  if (opt) return opt;

  // Tillad KUN POST (GET skal give 405 – ikke 404)
  if (req.method !== "POST") return bad("Method not allowed", 405);

  // Provider-guards (tydelige fejl fremfor tavs 404)
  const provider = (Deno.env.get("IMAGE_PROVIDER") || "bfl").toLowerCase();
  if (!["bfl", "replicate"].includes(provider)) return bad("Invalid IMAGE_PROVIDER");
  if (provider === "bfl" && !Deno.env.get("BFL_API_KEY")) return bad("Missing BFL_API_KEY", 500);

  // Parse body
  let body: any;
  try {
    body = await req.json();
  } catch {
    return bad("Invalid JSON body");
  }

  // TODO: kald BFL her. Midlertidigt returnerer vi bekræftelse.
  return ok({
    provider,
    received: body,
    status: "hello-from-image-service",
  });
});
