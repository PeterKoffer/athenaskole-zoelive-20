// src/pages/DailyProgramPage.tsx
import { useEffect, useMemo, useState, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import { generateCover } from "@/lib/functions";

type UniverseLike = { id?: string; universeId?: string; title?: string; subject?: string };

// ---- STUB DATASOURCES (replace once your real data is wired) ----
function useTodaysUniverse(): UniverseLike | null {
  // @ts-ignore
  return window.__TODAYS_UNIVERSE__ || null;
}
function useSuggestions(): UniverseLike[] {
  // @ts-ignore
  return window.__SUGGESTIONS__ || [];
}
function useStudentGradeInt(): number {
  // @ts-ignore
  return window.__STUDENT_GRADE_INT__ ?? 8;
}

function getId(u?: UniverseLike | null): string | null {
  if (!u) return null;
  return (u.id || u.universeId || null) as string | null;
}

// ---- Call new function first, then legacy fallback ----
async function getCoverUrlWithFallback(args: {
  universeId: string;
  gradeInt: number;
  title: string;
  width?: number;
  height?: number;
  minBytes?: number;
}): Promise<string> {
  try {
    const url = await generateCover({
      universeId: args.universeId,
      gradeInt: args.gradeInt,
      title: args.title,
      width: args.width ?? 1216,
      height: args.height ?? 640,
    });
    if (!url) throw new Error("No url from image-service/generate");
    return url;
  } catch (e) {
    const { data, error } = await supabase.functions.invoke("image-ensure", { body: args });
    if (error) throw new Error(error.message ?? String(error));
    const publicUrl = (data as any)?.publicUrl as string | undefined;
    if (!publicUrl) throw new Error("No publicUrl from image-ensure");
    return publicUrl;
  }
}

function useCoverUrl(args: {
  universeId: string;
  gradeInt: number;
  title: string;
  width?: number;
  height?: number;
  minBytes?: number;
}) {
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setErr(null);

    getCoverUrlWithFallback(args)
      .then((u) => {
        if (!alive) return;
        setUrl(u);
        try {
          console.log("[DailyProgram] cover url:", u.slice(0, 120) + (u.length > 120 ? "…" : ""));
        } catch {}
      })
      .catch((e) => {
        if (!alive) return;
        setErr(e?.message ?? String(e));
        setUrl(null);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [args.universeId, args.gradeInt, args.title, args.width, args.height, args.minBytes]);

  return { url, loading, err };
}

export default function DailyProgramPage() {
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

  const { url, loading, err } = useCoverUrl({
    universeId: todaysId,
    gradeInt,
    title: todaysTitle,
    width: 1216,
    height: 640,
    minBytes: 2048,
  });

  const scheme = url?.split(":")[0] ?? "";
  const urlLen = url?.length ?? 0;

  // ---- Debug probe: fetch -> blob -> object URL (helps bypass data: CSP) ----
  const [probeBusy, setProbeBusy] = useState(false);
  const [probeUrl, setProbeUrl] = useState<string | null>(null);
  const [probeErr, setProbeErr] = useState<string | null>(null);

  const runProbe = useCallback(async () => {
    if (!url) return;
    setProbeBusy(true);
    setProbeErr(null);
    setProbeUrl(null);
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`fetch ${res.status}: ${res.statusText}`);
      const blob = await res.blob();
      const obj = URL.createObjectURL(blob);
      setProbeUrl(obj);
    } catch (e: any) {
      setProbeErr(e?.message ?? String(e));
    } finally {
      setProbeBusy(false);
    }
  }, [url]);

  return (
    <main className="mx-auto max-w-5xl px-4 py-6">
      <header className="mb-6">
        <a href="/" className="text-sm text-gray-400 hover:text-gray-200">← Back to Home</a>
        <h1 className="mt-2 text-2xl font-semibold text-white">Today&apos;s Program</h1>
        <p className="mt-1 text-sm text-gray-400">
          Welcome back! Here&apos;s your personalized AI-generated learning universe for today.
        </p>
      </header>

      {/* ---- Hero with reserved space ---- */}
      <section aria-labelledby="today-cover" className="mb-6">
        <h2 id="today-cover" className="sr-only">Today’s cover</h2>

        <div className="relative w-full overflow-hidden rounded-xl bg-slate-800/40 border border-white/10">
          {/* Reserve space so layout never collapses */}
          <div className="w-full aspect-[1216/640]" />

          {loading && <div className="absolute inset-0 animate-pulse bg-slate-700/40" />}

          {!loading && err && (
            <div className="absolute inset-0 p-4 text-sm text-red-300 bg-slate-900/60">
              <div className="font-semibold">Image error</div>
              <div className="opacity-80">{err}</div>
              <div className="mt-2 text-xs text-white/60">
                universeId=<code>{todaysId}</code> • grade=<code>{gradeInt}</code> • title=<code>{todaysTitle}</code>
              </div>
            </div>
          )}

          {!loading && url && (
            <>
              <img
                src={url}
                alt={todaysTitle}
                className="absolute inset-0 h-full w-full object-cover"
                loading="eager"
                decoding="async"
                onError={() => console.warn("[DailyProgram] <img> failed to load cover image.")}
              />
              <div className="absolute right-2 bottom-2 rounded-md bg-black/60 px-2 py-1 text-[10px] text-white/80">
                {scheme || "no-scheme"} • {urlLen} chars
              </div>
            </>
          )}
        </div>
      </section>

      {/* ---- DEBUG PANEL (temporary; keep until we see the image) ---- */}
      <section className="mb-6 rounded-lg border border-yellow-400/30 bg-yellow-500/10 p-3 text-xs text-yellow-200">
        <div className="font-semibold mb-1">Debug</div>
        <div className="grid gap-1">
          <div>loading: <code>{String(loading)}</code></div>
          <div>error: <code>{err ?? "none"}</code></div>
          <div>url (scheme/len): <code>{scheme || "n/a"}</code> / <code>{urlLen}</code></div>
          <div className="truncate">url preview: <code>{url ? url.slice(0, 160) + (url.length > 160 ? "…" : "") : "n/a"}</code></div>
          <div className="flex gap-2 mt-1">
            <button
              className="rounded bg-white/10 px-2 py-1 hover:bg-white/20 disabled:opacity-50"
              disabled={!url}
              onClick={() => url && window.open(url, "_blank")}
            >
              Open URL in new tab
            </button>
            <button
              className="rounded bg-white/10 px-2 py-1 hover:bg-white/20 disabled:opacity-50"
              disabled={!url || probeBusy}
              onClick={runProbe}
            >
              {probeBusy ? "Probing…" : "Probe via fetch→blob"}
            </button>
          </div>
          {probeErr && <div className="text-red-300 mt-1">probe error: {probeErr}</div>}
          {probeUrl && (
            <div className="mt-2">
              <div className="mb-1 opacity-80">blob preview (object URL):</div>
              <img src={probeUrl} alt="probe" className="max-h-48 w-auto rounded border border-white/10" />
            </div>
          )}
        </div>
      </section>

      {/* ---- Compact suggestion card ---- */}
      {catalogPick ? (
        <section className="mt-4" aria-labelledby="catalog-pick">
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
                <svg viewBox="0 0 20 20" fill="currentColor" className="size-4 opacity-80" aria-hidden="true">
                  <path d="M10.75 3.5a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0V5.56l-7.72 7.72a.75.75 0 1 1-1.06-1.06l7.72-7.72H11.5a.75.75 0 0 1-.75-.75Z" />
                  <path d="M4.25 5A1.75 1.75 0 0 0 2.5 6.75v8A1.75 1.75 0 0 0 4.25 16.5h8A1.75 1.75 0 0 0 14 14.75v-3a.75.75 0 0 1 1.5 0v3A3.25 3.25 0 0 1 12.25 18.5h-8A3.25 3.25 0 0 1 1 15.25v-8A3.25 3.25 0 0 1 4.25 4h3a.75.75 0 0 1 0 1.5h-3Z" />
                </svg>
              </a>
            </div>
          </div>
        </section>
      ) : null}
    </main>
  );
}
