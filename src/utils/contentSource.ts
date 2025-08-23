export type ContentSource = "offline" | "ai" | "hybrid";

// Read from localStorage (dev-friendly) or env variable fallback
export function getContentSource(): ContentSource {
  try {
    const ls = (localStorage.getItem("nelie.contentSource") || "").toLowerCase();
    if (ls === "offline" || ls === "ai" || ls === "hybrid") return ls as ContentSource;
  } catch {}
  const env = (import.meta.env.VITE_CONTENT_SOURCE || "hybrid").toLowerCase();
  return (["offline","ai","hybrid"].includes(env) ? env : "hybrid") as ContentSource;
}