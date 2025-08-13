import { FF_DK_TARGETS } from "@/utils/featureFlags";

// Only allow DK if explicitly requested and the flag is ON.
// Otherwise return undefined so EN/default stays in effect.
export function resolveCountryFlag(requested?: string): "DK" | undefined {
  const r = (requested || "").toUpperCase();
  return FF_DK_TARGETS && r === "DK" ? "DK" : undefined;
}
