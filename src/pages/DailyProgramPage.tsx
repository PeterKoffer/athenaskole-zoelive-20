// src/pages/DailyProgramPage.tsx
import { useEffect, useMemo, useState, useCallback } from "react";

/** --------- Tiny helpers (local + robust) ---------- */
type Json = Record<string, unknown>;
const sanitize = (u?: string) => (u ?? "").trim().replace(/\/+$/, "");
const BASE = sanitize(import.meta.env.VITE_SUPABASE_URL as string);
const ANON = (import.meta.env.VITE_SUPABASE_ANON_KEY as string)?.trim();

async function postEdge<T>(path: string, body: Json): Promise<T> {
  if (!BASE || !ANON) {
    throw new Error("ENV missing: VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY");
  }
  const url = `${BASE}/functions/v1${path.startsWith("/") ? path : "/" + path}`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: ANON,
      Authorization: `Bearer ${ANON}`,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`Edge ${path} ${res.status}: ${txt || res.statusText}`);
  }
  return res.json() as Promise<T>;
}

async function getCoverUrl(args: {
  universeId: string;
  gradeInt: number;
  title: string;
  width: number;
  height: number;
}): Promise<string> {
  // 1) New route
  try {
    const data = await postEdge<{ url: string }>("/image-service", args);
    if (!data?.url) throw new Error("No url from /image-service/generate");
    return data.url;
  } catch (e) {
    // 2) Legacy route fallback
    const data = await postEdge<{ publicUrl?: string; url?: string }>("/image-ensure", args);
    const u = data.publicUrl || data.url;
    if (!u) throw new Error("No publicUrl from /image-ensure");
    return u;
  }
}

/** --------- STUB DATA (replace with your real bindings) ---------- */
type UniverseLike = { id?: string; universeId?: string; title?: string; subject?: string };
function useTodaysUniverse(): UniverseLike | null {
  // @ts-ignore
  return window.__TODAYS_UNIVERSE__ || { id: "universe-fallback", title: "Today’s Program", subject: "General" };
}
function useSuggestions(): UniverseLike[] {
  // @ts-ignore
  return window.__SUGGESTIONS__ || [
    { id: "cat-1", title: "Catalog Pick", subject: "Technology" },
  ];
}
function useStudentGradeInt(): number {
  // @ts-ignore
  return window.__STUDENT_GRADE_INT__ ?? 8;
}
const getId = (u?: UniverseLike | null) => (u?.id || u?.universeId || null) as string | null;

/** --------- Page ---------- */
export default function DailyProgramPage() {
  console.log("[DailyProgram] mounted from", import.meta.url);

  const todaysUniverse = useTodaysUniverse();
  const suggestions = useSuggestions();
  const gradeInt = useStudentGradeInt();

  const todaysId = getId(todaysUniverse) ?? "universe-fallback";
  const todaysTitle = (todaysUniverse?.title ?? "Today’s Program").trim();

  const uniqueSuggestions = useMemo(() => {
    const seen = new Set<string>();
    return (suggestions ?? []).filter((u) => {
      const id = getId(u);
      if (!id || id === todaysId || seen.has(id)) return false;
      seen.add(id);
      return true;
    });
  }, [suggestions, todaysId]);
  const catalogPick = uniqueSuggestions[0] ?? null;

  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setErr(null);
    setUrl(null);

    const args = { universeId: todaysId, gradeInt, title: todaysTitle, width: 1216, height: 640 };
    console.log("[DailyProgram] fetching cover with", args, { BASE, hasAnon: !!ANON });

    getCoverUrl(args)
      .then((u) => {
        if (!alive) return;
        console.log("[DailyProgram] cover url:", u?.slice(0, 120) + (u?.length > 120 ? "…" : ""));
        setUrl(u);
      })
      .catch((e: any) => {
        if (!alive) return;
        console.error("[DailyProgram] cover error", e);
        setErr(e?.message ?? String(e));
      })
      .finally(() => alive && setLoading(false));

    return () => {
      alive = false;
    };
  }, [todaysId, gradeInt, todaysTitle]);

  const probeBlob = useCallback(async () => {
    if (!url) return;
    try {
      const resp = await fetch(url);
      const blob = await resp.blob();
      const obj = URL.createObjectURL(blob);
      window.open(obj, "_blank", "noopener,noreferrer");
      setTimeout(() => URL.revokeObjectURL(obj), 4000);
    } catch (e) {
      console.error("probeBlob error", e);
    }
  }, [url]);

  const testBfl = useCallback(async () => {
    try {
      const data = await postEdge<any>("/test-bfl", {});
      console.log("[DailyProgram] BFL test result:", data);
      alert(JSON.stringify(data, null, 2));
    } catch (e) {
      console.error("[DailyProgram] BFL test error", e);
      alert("BFL test failed: " + (e as Error).message);
    }
  }, []);

  const urlScheme = url?.slice(0, 5) ?? "none";
  const urlLen = url?.length ?? 0;

  return (
    <main className="mx-auto max-w-5xl px-4 py-6">
      <header className="mb-6">
        <a href="/" className="text-sm text-gray-400 hover:text-gray-200">← Back to Home</a>
        <h1 className="mt-2 text-2xl font-semibold text-white">Today&apos;s Program</h1>
        <p className="mt-1 text-sm text-gray-400">
          Welcome back! Here&apos;s your personalized AI-generated learning universe for today.
        </p>
      </header>

      {/* --- Today: big hero (always visible) --- */}
      <section aria-labelledby="today-cover" className="mb-4">
        <h2 id="today-cover" className="sr-only">Today’s cover</h2>

        <div className="relative w-full overflow-hidden rounded-xl bg-slate-800/40 border border-white/10">
          {/* Reserve space so layout never collapses */}
          <div className="w-full aspect-[1216/640]" />

          {/* Loading skeleton overlays the reserved space */}
          {loading && (
            <div className="absolute inset-0 animate-pulse bg-slate-700/40" />
          )}

          {/* Error */}
          {!loading && err && (
            <div className="absolute inset-0 p-4 text-sm text-red-300 bg-slate-900/50">
              <div className="font-semibold">Image error</div>
              <div className="opacity-80 whitespace-pre-wrap break-all">{err}</div>
              <div className="mt-2 text-xs text-white/60">
                universeId=<code>{todaysId}</code> • grade=<code>{gradeInt}</code> • title=<code>{todaysTitle}</code>
              </div>
            </div>
          )}

          {/* Actual image */}
          {!loading && url && (
            <img
              src={url}
              alt={todaysTitle}
              className="absolute inset-0 h-full w-full object-cover"
              loading="eager"
              decoding="async"
            />
          )}
        </div>
      </section>

      {/* Debug panel */}
      <section className="mb-6">
        <div className="rounded-md border border-yellow-500/30 bg-yellow-300/10 p-3 text-xs text-yellow-200">
          <div className="font-semibold mb-1">Debug</div>
          <div>loading: <code>{String(loading)}</code></div>
          <div>err: <code>{err ?? "none"}</code></div>
          <div>url scheme(len): <code>{urlScheme} ({urlLen})</code></div>
          {url && (
            <div className="mt-2 flex gap-2 flex-wrap">
              <a className="underline" href={url} target="_blank" rel="noreferrer">Open URL in new tab</a>
              <button className="underline" onClick={probeBlob}>Probe via fetch→blob</button>
              <button className="underline" onClick={testBfl}>Test BFL API</button>
              <div className="opacity-70">url preview: <code>{url.slice(0, 120)}{url.length>120?"…":""}</code></div>
            </div>
          )}
        </div>
      </section>

      {/* Catalog suggestion (no image) */}
      {catalogPick ? (
        <section className="mt-2" aria-labelledby="catalog-pick">
          <p className="mb-2 text-xs text-blue-300">
            From Universe Catalog — add to plan if you like it
          </p>
          <div
            id="catalog-pick"
            className="rounded-xl border border-white/10 bg-gradient-to-br from-slate-800/60 to-slate-900/60 p-4"
          >
            <div className="text-xs text-blue-200">
              {catalogPick?.subject ?? "Technology"} • Grade {gradeInt} • 150 min
            </div>
            <h3 className="mt-1 text-lg font-semibold text-white">
              {catalogPick?.title ?? "Catalog Pick"}
            </h3>
            <p className="text-sm text-gray-300">
              A curated learning universe for Grade {gradeInt}. Click to preview and add it to today’s plan.
            </p>

            <div className="mt-3">
              <a
                href={`/universes/${getId(catalogPick) ?? ""}`}
                className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-sm font-medium text-white hover:bg-white/20"
              >
                Open catalog item
              </a>
            </div>
          </div>
        </section>
      ) : null}
    </main>
  );
}
