// src/pages/DailyProgramPage.tsx
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

/**
 * STUBS: Skift til dine rigtige datakilder, når du binder rigtigt data på.
 */
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

/** Henter en stabil public URL fra edge-funktionen "image-ensure". */
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

    supabase
      .functions
      .invoke("image-ensure", { body: args })
      .then(({ data, error }) => {
        if (!alive) return;
        if (error) {
          setErr(error.message ?? String(error));
          setUrl(null);
          return;
        }
        const publicUrl = (data as any)?.publicUrl as string | undefined;
        if (!publicUrl) {
          setErr("No publicUrl returned from image-ensure");
          setUrl(null);
          return;
        }
        setUrl(publicUrl);
      })
      .catch((e) => {
        if (!alive) return;
        setErr(e?.message ?? String(e));
        setUrl(null);
      })
      .finally(() => alive && setLoading(false));

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

  // Sørg for en stabil ID, også hvis stub mangler:
  const todaysId = getId(todaysUniverse) ?? "universe-fallback";
  const todaysTitle = (todaysUniverse?.title ?? "Todays Program").trim();

  // Deduplikér kataloget og ekskludér dagens universe
  const uniqueSuggestions = useMemo(() => {
    const seen = new Set<string>();
    return (suggestions ?? []).filter((u) => {
      const id = getId(u);
      if (!id) return false;
      if (id === todaysId) return false;
      if (seen.has(id)) return false;
      seen.add(id);
      return true;
    });
  }, [suggestions, todaysId]);

  const catalogPick = uniqueSuggestions[0] ?? null;

  // Hent cover-URL direkte fra edge-funktionen
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

      {/* --- Dagens universe: ét stort billede --- */}
      <section aria-labelledby="today-cover" className="mb-6">
        <h2 id="today-cover" className="sr-only">Today’s cover</h2>

        <div className="rounded-xl overflow-hidden bg-slate-800/40 border border-white/10">
          {/* Skeleton mens vi loader */}
          {loading && (
            <div className="w-full aspect-[1200/630] animate-pulse bg-slate-700/40" />
          )}

          {/* Fejl/debug (kun i dev) */}
          {!loading && err && (
            <div className="p-4 text-sm text-red-300">
              <div className="font-semibold">Image error</div>
              <div className="opacity-80">{err}</div>
              <div className="mt-2 text-xs text-white/60">
                universeId=<code>{todaysId}</code> • grade=<code>{gradeInt}</code> • title=<code>{todaysTitle}</code>
              </div>
            </div>
          )}

          {/* Selve billedet */}
          {!loading && url && (
            <img
              src={url}
              alt={todaysTitle}
              className="w-full h-auto block"
              loading="eager"
              decoding="async"
            />
          )}
        </div>
      </section>

      {/* --- Katalog-forslag UDEN billede (kompakt card) --- */}
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

      {/* --- Feature-sektion --- */}
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
