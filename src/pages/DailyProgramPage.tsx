import { useMemo } from "react";
import UniverseImage from "@/components/UniverseImage";

/**
 * STUBS: Skift til dine rigtige datakilder (Redux/Zustand/React-Query/Context).
 * De gør, at siden kan køre med placeholders, indtil du binder rigtige data på.
 */
type UniverseLike = { id?: string; universeId?: string; title?: string; subject?: string };

function useTodaysUniverse(): UniverseLike | null {
  // TODO: bind til rigtig kilde (fx selectTodaysUniverse())
  // @ts-ignore
  return window.__TODAYS_UNIVERSE__ || null;
}
function useSuggestions(): UniverseLike[] {
  // TODO: bind til rigtig kilde (fx selectCatalogSuggestions())
  // @ts-ignore
  return window.__SUGGESTIONS__ || [];
}
function useStudentGradeInt(): number {
  // TODO: bind til rigtig kilde (fx selectStudent().gradeInt)
  // @ts-ignore
  return window.__STUDENT_GRADE_INT__ ?? 6;
}

function getId(u?: UniverseLike | null): string | null {
  if (!u) return null;
  return (u.id || u.universeId || null) as string | null;
}

export default function DailyProgramPage() {
  const todaysUniverse = useTodaysUniverse();
  const suggestions = useSuggestions();
  const gradeInt = useStudentGradeInt();

  const todaysId = getId(todaysUniverse);

  // Deduplikér kataloget: fjern dubletter og ekskludér dagens universe
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

  return (
    <main className="mx-auto max-w-5xl px-4 py-6">
      <header className="mb-6">
        <a href="/" className="text-sm text-gray-400 hover:text-gray-200">← Back to Home</a>
        <h1 className="mt-2 text-2xl font-semibold text-white">Today&apos;s Program</h1>
        <p className="mt-1 text-sm text-gray-400">
          Welcome back! Here&apos;s your personalized AI-generated learning universe for today.
        </p>
      </header>

      {/* --- Dagens universe --- */}
      <section className="mb-6">
        <div className="rounded-xl overflow-hidden">
          <UniverseImage
            universeId={todaysId ?? "unknown-universe"}
            gradeInt={gradeInt}
            title={todaysUniverse?.title ?? "Today’s Program"}
            className="w-full h-auto block"
            width={1200}
            height={630}
            minBytes={2048}
          />
        </div>
        <div className="sr-only">{todaysUniverse?.title}</div>
      </section>

      {/* --- Katalog-forslag (deduplikeret) --- */}
      {catalogPick ? (
        <section className="mt-2">
          <p className="mb-2 text-xs text-blue-300">
            From Universe Catalog — add to plan if you like it
          </p>
          <div className="rounded-xl overflow-hidden bg-gradient-to-b from-slate-800 to-slate-900 border border-white/10">
            <UniverseImage
              universeId={getId(catalogPick) ?? "unknown-catalog"}
              gradeInt={gradeInt}
              title={catalogPick?.title ?? "Catalog Pick"}
              className="w-full h-auto block"
              width={1200}
              height={630}
              minBytes={2048}
            />
            <div className="p-4">
              <div className="text-xs text-blue-200">
                {catalogPick?.subject ?? "Technology"} • Grade {gradeInt} • 150 min
              </div>
              <h3 className="mt-1 text-lg font-semibold text-white">
                {catalogPick?.title ?? "Catalog Pick"}
              </h3>
              <p className="text-sm text-gray-300">
                A curated learning universe for Grade {gradeInt}
              </p>
            </div>
          </div>
        </section>
      ) : null}

      {/* --- Feature-sektion --- */}
      <section className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl p-4 bg-gradient-to-br from-rose-500/20 to-orange-500/20 border border-white/10">
          <h4 className="font-semibold text-white">Personalized Content</h4>
          <p className="text-sm text-gray-300">
            AI-crafted lessons that adapt to your progress and interests
          </p>
        </div>
        <div className="rounded-xl p-4 bg-gradient-to-br from-sky-500/20 to-indigo-500/20 border border-white/10">
          <h4 className="font-semibold text-white">Interactive Universe</h4>
          <p className="text-sm text-gray-300">
            Explore characters, locations, and activities in your learning world
          </p>
        </div>
        <div className="rounded-xl p-4 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-white/10">
          <h4 className="font-semibold text-white">Dynamic Learning</h4>
          <p className="text-sm text-gray-300">
            Content that evolves based on your performance and engagement
          </p>
        </div>
        <div className="rounded-xl p-4 bg-gradient-to-br from-fuchsia-500/20 to-pink-500/20 border border-white/10">
          <h4 className="font-semibold text-white">Gamified Experience</h4>
          <p className="text-sm text-gray-300">
            Learn through engaging activities and achievement systems
          </p>
        </div>
      </section>
    </main>
  );
}

