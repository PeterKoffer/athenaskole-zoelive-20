// src/hooks/useSetting.ts
import { useEffect, useMemo, useState } from "react";
import { Context, getEffective, setSetting } from "@/services/settings";

export function useSetting<T = any>(
  key: any,
  ctx: Context,
  options?: { fallback?: T; scopeForWrites?: "school"|"class"|"teacher"|"student" }
) {
  const [value, setValue] = useState<T | undefined>(options?.fallback);
  const [loading, setLoading] = useState(true);
  const scopeForWrites = options?.scopeForWrites ?? "teacher"; // sane default

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const v = await getEffective<T>(key, ctx, { fallback: options?.fallback });
      if (!cancelled) { setValue(v); setLoading(false); }
    })();
    return () => { cancelled = true; };
  }, [key, JSON.stringify(ctx)]); // eslint-disable-line

  const save = useMemo(() => async (next: T) => {
    const payload = (typeof next === "object" && next !== null) ? next : { value: next };
    await setSetting({ scope: scopeForWrites, key, value: payload, ctx });
    setValue(next);
  }, [key, JSON.stringify(ctx), scopeForWrites]); // eslint-disable-line

  return { value, setValue: save, loading };
}