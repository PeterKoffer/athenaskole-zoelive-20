export function getSessionId(): string {
  const k = "nelie_session_id";
  try {
    const w = typeof window !== "undefined" ? window : null;
    if (!w) return "nosess";
    let v = w.localStorage.getItem(k);
    if (!v) {
      v = (w.crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2)).slice(0, 36);
      w.localStorage.setItem(k, v);
    }
    return v;
  } catch {
    return "nosess";
  }
}
