import { useEffect, useMemo, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { buildContentRequest, normalizeGrade } from "../content";
import { generateLesson } from "../services/contentClient";

type Json = Record<string, any>;

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

const SUBJECT_ALIASES: Record<string, string> = {
  science: "Science",
  math: "Mathematics",
  maths: "Mathematics",
  language: "Language lab",
  history: "History & Religion",
  geography: "Geography",
  tech: "Computer and technology",
};

export default function ScenarioPlayerPage() {
  const { scenarioId = "demo" } = useParams();
  const qs = useQuery();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [content, setContent] = useState<Json | null>(null);

  const subject = useMemo(() => {
    const fromQs = qs.get("subject");
    if (fromQs) return SUBJECT_ALIASES[fromQs.toLowerCase()] ?? fromQs;
    return SUBJECT_ALIASES[scenarioId.toLowerCase()] ?? "Science";
  }, [qs, scenarioId]);

  const grade = useMemo(() => normalizeGrade(qs.get("grade") ?? 5), [qs]);
  const learningStyle = useMemo(() => qs.get("learningStyle") ?? "mixed", [qs]);
  const ability = useMemo(() => qs.get("ability") ?? "standard", [qs]);
  const interests = useMemo(() => {
    const raw = qs.get("interests");
    if (!raw) return [] as string[];
    return raw.split(",").map((s) => s.trim()).filter(Boolean);
  }, [qs]);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      setLoading(true);
      setError(null);
      setContent(null);
      try {
        const request = buildContentRequest({
          subject,
          grade,
          curriculum: qs.get("curriculum"),
          ability,
          learningStyle,
          interests,
          schoolPhilosophy: qs.get("schoolPhilosophy"),
          lessonDurationMins: Number(qs.get("duration")) || 45,
          calendarKeywords: (qs.get("calendar") ?? "")
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
          calendarDurationDays: Number(qs.get("calendarDays")) || 1,
        });
        const result = await generateLesson(request);
        if (!cancelled) setContent(result);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : String(e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    run();
    return () => { cancelled = true; };
  }, [subject, grade, learningStyle, ability, interests, qs]);

  const title =
    (content as any)?.title ??
    (content as any)?.lesson?.title ??
    `${subject} Scenario (Grade ${grade})`;

  const firstActivity: Json | undefined =
    (content as any)?.lesson?.activities?.[0] ??
    (content as any)?.activities?.[0] ??
    (content as any)?.game?.steps?.[0];

  const reflection: string | undefined =
    (content as any)?.lesson?.reflection ??
    (content as any)?.reflection;

  return (
    <div className="mx-auto max-w-4xl p-6 space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="text-sm text-muted-foreground">
          Scenario ID: <span className="font-mono">{scenarioId}</span> • Subject: {subject} • Grade: {grade} • Style: {learningStyle} • Ability: {ability}
        </p>
        <div className="text-xs text-muted-foreground">
          Tip: <code>?subject=Science&grade=5&interests=basketball,space</code>
        </div>
      </header>

      {loading && (
        <div className="rounded-xl border p-6 animate-pulse">
          <div className="h-4 w-1/3 rounded bg-gray-300" />
          <div className="mt-4 h-3 w-2/3 rounded bg-gray-200" />
          <div className="mt-2 h-3 w-1/2 rounded bg-gray-200" />
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-300 bg-red-50 p-4 text-red-800">
          <div className="font-medium">Fejl ved indholds-generering</div>
          <div className="text-sm mt-1">{error}</div>
          <div className="text-xs mt-2 text-red-700/80">
            Tjek at <code>.env.local</code> har <code>VITE_SUPABASE_URL</code> og <code>VITE_SUPABASE_ANON</code>.
          </div>
        </div>
      )}

      {!loading && !error && content && (
        <section className="space-y-6">
          {firstActivity && (
            <div className="rounded-xl border p-6">
              <h2 className="text-lg font-semibold">Aktivitet</h2>
              <p className="mt-2 whitespace-pre-wrap">
                {firstActivity.description || firstActivity.text || JSON.stringify(firstActivity)}
              </p>
              {Array.isArray(firstActivity.steps) && (
                <ol className="mt-4 list-decimal pl-6 space-y-1">
                  {firstActivity.steps.map((s: any, i: number) => (
                    <li key={i} className="whitespace-pre-wrap">
                      {typeof s === "string" ? s : s?.text ?? JSON.stringify(s)}
                    </li>
                  ))}
                </ol>
              )}
            </div>
          )}

          {reflection && (
            <div className="rounded-xl border p-6">
              <h2 className="text-lg font-semibold">Refleksion</h2>
              <p className="mt-2 whitespace-pre-wrap">{reflection}</p>
            </div>
          )}

          <details className="rounded-xl border p-4">
            <summary className="cursor-pointer text-sm font-medium">Rå data (debug)</summary>
            <pre className="mt-3 overflow-auto text-xs leading-relaxed">
              {JSON.stringify(content, null, 2)}
            </pre>
          </details>
        </section>
      )}

      {!loading && !error && !content && (
        <div className="text-sm text-muted-foreground">Intet indhold endnu.</div>
      )}
    </div>
  );
}
