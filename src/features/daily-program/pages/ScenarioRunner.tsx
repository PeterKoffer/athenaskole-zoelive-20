// src/features/daily-program/pages/ScenarioRunner.tsx
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";

type Ability = "support" | "core" | "advanced";
type LearningStyle = "visual" | "auditory" | "kinesthetic" | "mixed";

type Scenario = {
  id: string;
  title: string;
  subject: string;      // fx "Mathematics", "Science"
  gradeRange?: string;
  description?: string;
};

type Context = {
  grade: number;
  curriculum: string;
  ability: Ability;
  learningStyle: LearningStyle;
  interests?: string[];
  [k: string]: unknown; // øvrige parametre ok
};

type LocationState = { scenario: Scenario; context: Context };

function parseIntSafe(v: string | null, def: number) {
  const n = v ? Number(v) : NaN;
  return Number.isFinite(n) ? n : def;
}

export default function ScenarioRunner() {
  const { scenarioId } = useParams<{ scenarioId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state as LocationState | undefined) ?? undefined;

  const search = useMemo(() => new URLSearchParams(location.search), [location.search]);

  // --- Robuste faldbacks, så selv /educational-simulator uden state virker ---
  const computedScenario: Scenario = useMemo(() => {
    if (state?.scenario) return state.scenario;

    const id = scenarioId ?? search.get("id") ?? "fraction-adventure";
    const subject = search.get("subject") ?? (id.includes("ecosystem") ? "Science" : "Mathematics");
    const title =
      search.get("title") ??
      (id === "ecosystem-explorer" ? "Ecosystem Explorer" : "Fraction Adventure");

    return {
      id,
      subject,
      title,
      description: search.get("description") ?? undefined,
      gradeRange: search.get("gradeRange") ?? undefined,
    };
  }, [state?.scenario, scenarioId, search]);

  const computedContext: Context = useMemo(() => {
    if (state?.context) return state.context;

    const grade = parseIntSafe(search.get("grade"), 5);
    const curriculum = search.get("curriculum") ?? "DK/Fælles Mål 2024";
    const ability = (search.get("ability") as Ability) ?? "core";
    const learningStyle = (search.get("learningStyle") as LearningStyle) ?? "mixed";
    const interests = (search.get("interests") ?? "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    return { grade, curriculum, ability, learningStyle, interests };
  }, [state?.context, search]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    let mounted = true;

    async function run() {
      try {
        const payload = {
          subject: computedScenario.subject,
          grade: computedContext.grade,
          curriculum: computedContext.curriculum,
          ability: computedContext.ability,
          learningStyle: computedContext.learningStyle,
          interests: computedContext.interests ?? [],
          // alt andet fra context sendes videre
          ...computedContext,
        };

        const { data, error } = await supabase.functions.invoke("generate-content", {
          body: payload,
        });

        if (error) throw error;
        if (!mounted) return;
        setResult(data);
      } catch (e: any) {
        if (!mounted) return;
        setError(e?.message ?? String(e));
      } finally {
        if (mounted) setLoading(false);
      }
    }

    run();
    return () => {
      mounted = false;
    };
  }, [computedScenario.subject, computedContext]);

  if (loading) {
    return (
      <div className="mx-auto max-w-screen-md p-6">
        <h1 className="mb-2 text-xl font-semibold">Starter scenariet…</h1>
        <p className="opacity-70">Genererer differentieret indhold ud fra dine indstillinger.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-screen-md p-6">
        <h1 className="mb-2 text-2xl font-semibold">Noget gik galt</h1>
        <p className="mb-4 text-red-700">{error}</p>
        <button
          className="rounded-lg bg-blue-600 px-4 py-2 text-white"
          onClick={() => navigate(-1)}
        >
          ⟵ Tilbage
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-screen-xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{computedScenario.title}</h1>
          <p className="text-sm opacity-70">
            Subject: {computedScenario.subject} • Grade {computedContext.grade}
          </p>
        </div>
        <button
          className="rounded-lg bg-neutral-200 px-3 py-1.5 text-sm"
          onClick={() => navigate(-1)}
        >
          ⟵ Tilbage
        </button>
      </div>

      {/* Midlertidig rendering: vis hele outputtet som JSON */}
      <pre className="overflow-auto rounded-lg bg-neutral-900 p-4 text-xs text-neutral-100">
        {JSON.stringify(result, null, 2)}
      </pre>
    </div>
  );
}
