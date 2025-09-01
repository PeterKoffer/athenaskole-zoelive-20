// src/pages/DailyProgramPage.tsx
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { generateCover } from "@/lib/functions";

/** ---- STUB DATASOURCES (replace with real data binding when ready) ---- */
type UniverseLike = { id?: string; universeId?: string; title?: string; subject?: string };

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

/** Try new route first; if it fails (404/old project), fall back to legacy `image-ensure`. */
async function getCoverUrlFallback(args: {
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
  } catch (e: any) {
    // Fallback til legacy Edge Function-navn
    const { data, error } = await supabase.functions.invoke("image-ensure", { body: args });
    if (error) throw new Error(error.message ?? String(error));
    const publicUrl = (data as any)?.publicUrl as string | undefined;
    if (!publicUrl) throw new Error("No publicUrl returned from image-ensure");
    return publicUrl;
  }
}

/** Hook der henter en stabil cover-URL fra Edge Functions. */
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

    getCoverUrlFallback(args)
      .then((u) => {
        if (!alive) return;
        setUrl(u);
        if (import.meta.env.DEV) {
          // Synligt i konsollen at vi FIK en URL
          console.log("[DailyProgram] cover url:", (u || "").slice(0, 80) + (u && u.length > 80 ? "…" : ""));
        }
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

  // Stabil ID/title selv hvis stubs mangler
  const todaysId = getId(todaysUniverse) ?? "universe-fallback";
  const todaysTitle = (todaysUniverse?.title ?? "Today’s Program").trim();

  // Dedupliker forslag og ekskludér dagens universe
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

  // Hent cover-URL (ny funktion først, legacy fallback)
  const { url, loading, err } = useCoverUrl({
    universeId: todaysId,
    gradeInt,
    title: todaysTitle,
    width: 1216,
    height: 640,
    minBytes: 2048,
  });

  return (
    <main className="mx-auto max-w-5xl px-4 py-6">
      <header className="mb-6">
        <a href="/" className="text-sm text-gray-400 hover:text-gray-200">← Back to Home</a>
        <h1 className="mt-2 text-2xl font-semibold text-white">Today&apos;s Program</h1>
        <p className="mt-1 text-sm text-gray-400">
          Welcome back! Here&apos;s your personalized AI-generated learning universe for today.
        </p>
      </header>

      {/* --- Today - LARGE cover med reserveret højde --- */}
      <section aria-labelledby="today-cover" className="mb-6">
        <h2 id="today-cover" className="sr-only">Today’s cover</h2>

        <div className="relative w-full overflow-hidden rounded-xl bg-slate-800/40 border border-white/10">
          {/* Reserve plads så layout ikke kollapser */}
          <div className="w-full aspect-[1216/640]" />

          {/* Loading skeleton fylder reserveret område */}
          {loading && <div className="absolute inset-0 animate-pulse bg-slate-700/40" />}

          {/* Fejl/debug */}
          {!loading && err && (
            <div className="absolute inset-0 p-4 text-sm text-red-300 bg-slate-900/40">
              <div className="font-semibold">Image error</div>
              <div className="opacity-80">{err}</div>
              <div className="mt-2 text-xs text-white/60">
                universeId=<code>{todaysId}</code> • grade=<code>{gradeInt}</code> • title=<code>{todaysTitle}</code>
              </div>
            </div>
          )}

          {/* Selve billedet fylder hele rammen */}
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

        {/* Dev: lyn-link til at åbne billedet */}
        {!loading && url && import.meta.env.DEV && (
          <div className="mt-2 text-xs text-white/60">
            [dev] Cover URL:&nbsp;
            <a href={url} target="_blank" rel="noreferrer" className="underline">open</a>
          </div>
        )}
      </section>

      {/* --- Catalog suggestion (kompakt, uden billede) --- */}
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

      {/* --- Feature section --- */}
      <section className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl p-4 bg-gradient-to-br from-rose-500/20 to-orange-500/20 border border-white/10">
          <h4 className="font-semibold text-white">Personalized Content</h4>
          <p className="text-sm text-gray-300">AI-crafted lessons that adapt to your progress and interests</p>
        </div>
        <div className="rounded-xl p-4 bg-gradient-to-br from-sky-500/20 to-indigo-500/20 border border-white/10">
          <h4 className="font-semibold text-white">Interactive Universe</h4>
          <p className="text-sm text-gray-300">Explore characters, locations, and activities in your learning world</p>
        </div>
        <div className="rounded-xl p-4 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-white/10">
          <h4 className="font-semibold text-white">Dynamic Learning</h4>
          <p className="text-sm text-gray-300">Content that evolves based on your performance and engagement</p>
        </div>
        <div className="rounded-xl p-4 bg-gradient-to-br from-fuchsia-500/20 to-pink-500/20 border border-white/10">
          <h4 className="font-semibold text-white">Gamified Experience</h4>
          <p className="text-sm text-gray-300">Learn through engaging activities and achievement systems</p>
        </div>
      </section>
    </main>
  );
}
