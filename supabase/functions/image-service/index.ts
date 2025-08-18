// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

type Provider = "replicate" | "openai" | "stability" | "fallback";

function readEnv(name: string): string {
  // Ensure proper reading in Deno with trim and empty check
  return (Deno.env.get(name) ?? "").trim();
}

function selectProvider(): Provider {
  const p = readEnv("IMAGE_PROVIDER").toLowerCase();
  switch (p) {
    case "replicate":
    case "openai":
    case "stability":
      return p;
    default:
      return "fallback";
  }
}

function providerReady(p: Provider): boolean {
  switch (p) {
    case "replicate":
      return !!readEnv("REPLICATE_API_TOKEN");
    case "openai":
      return !!readEnv("OPENAI_API_KEY");
    case "stability":
      return !!readEnv("STABILITY_API_KEY");
    default:
      return true;
  }
}

function selectProviderWithFallback(): Provider {
  const chosen = selectProvider();
  if (providerReady(chosen)) return chosen;
  console.warn(
    `[image-service] Provider "${chosen}" valgt men ${chosen.toUpperCase()}_API_TOKEN mangler.`
  );
  return "fallback";
}

serve(async (req: Request) => {
  try {
    const url = new URL(req.url);
    const path = url.pathname;

    // Health endpoint: doesn't expose secrets
    if (path === "/health") {
      const chosen = selectProvider();
      const effective = selectProviderWithFallback();
      const status = {
        ok: true,
        configuredProvider: chosen,
        effectiveProvider: effective,
        hasReplicateToken: !!readEnv("REPLICATE_API_TOKEN"),
        hasOpenAIKey: !!readEnv("OPENAI_API_KEY"),
        hasStabilityKey: !!readEnv("STABILITY_API_KEY"),
      };
      return new Response(JSON.stringify(status), {
        headers: { "content-type": "application/json" },
      });
    }

    // Example: image generation route
    if (path === "/generate" && req.method === "POST") {
      const effective = selectProviderWithFallback();
      const body = await req.json().catch(() => ({}));
      const prompt: string = body?.prompt ?? "";

      if (!prompt) {
        return new Response(JSON.stringify({ error: "prompt required" }), {
          status: 400,
          headers: { "content-type": "application/json" },
        });
      }

      console.info(`[image-service] Provider: ${effective}`);
      if (effective !== "fallback") {
        console.info(
          `[image-service] Secrets present? replicate=${!!readEnv("REPLICATE_API_TOKEN")}, openai=${!!readEnv("OPENAI_API_KEY")}`
        );
      }

      switch (effective) {
        case "replicate": {
          // Call Replicate API here (implementation needed)
          return new Response(
            JSON.stringify({ provider: "replicate", status: "not_implemented" }),
            { headers: { "content-type": "application/json" } }
          );
        }
        case "openai": {
          // Call OpenAI images here (implementation needed)
          return new Response(
            JSON.stringify({ provider: "openai", status: "not_implemented" }),
            { headers: { "content-type": "application/json" } }
          );
        }
        case "stability": {
          // Call Stability here (implementation needed)
          return new Response(
            JSON.stringify({ provider: "stability", status: "not_implemented" }),
            { headers: { "content-type": "application/json" } }
          );
        }
        case "fallback":
        default: {
          // Return a deterministic placeholder
          return new Response(
            JSON.stringify({
              provider: "fallback",
              url: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg'><rect width='100' height='100' fill='black'/></svg>",
            }),
            { headers: { "content-type": "application/json" } }
          );
        }
      }

      // Temporary success response (replace with actual implementation)
      return new Response(
        JSON.stringify({ ok: true, provider: effective }),
        { headers: { "content-type": "application/json" } }
      );
    }

    // Default 404
    return new Response("Not Found", { status: 404 });
  } catch (err) {
    console.error("[image-service] Unhandled error:", err);
    return new Response("Internal Error", { status: 500 });
  }
});