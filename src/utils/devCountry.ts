// DEV-only helpers to override country per *session*.
import { getSessionId } from "@/utils/session";

const key = (sid: string) => `nelie_country_override:${sid}`;

export function getDevCountryOverride(): "DK" | undefined {
  if (!import.meta.env.DEV) return undefined;
  try {
    const sid = typeof window !== "undefined" ? getSessionId() : "nosess";
    const v = window.localStorage.getItem(key(sid));
    return v === "DK" ? "DK" : undefined;
  } catch { return undefined; }
}

export function setDevCountryOverride(v: "DK" | "" | undefined) {
  if (!import.meta.env.DEV) return;
  try {
    const sid = typeof window !== "undefined" ? getSessionId() : "nosess";
    const k = key(sid);
    if (v === "DK") window.localStorage.setItem(k, v);
    else window.localStorage.removeItem(k);
  } catch { /* no-op */ }
}
