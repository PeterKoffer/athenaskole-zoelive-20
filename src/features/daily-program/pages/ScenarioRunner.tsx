// src/features/daily-program/pages/ScenarioRunner.tsx
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";

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
  ability: "support" | "core" | "advanced";
  learningStyle: "visual" | "auditory" | "kinesthetic" | "mixed";
  interests?: string[];
  [k: string]: unknown; // alle dine øvrige 11 parametre kan med
};

type LocationState = { scenario: Scenario; context: Context };

export default function ScenarioRunner() {
  const { scenarioId } = useParams<{ scenarioId: string }>();
  const navigate = useNavigate();
  const { state } = useLocation() as { state?: LocationState };

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    let mounted = true;

    async function run() {
      if (!state?.scenario || !state?.context) {
        setError("Manglende scenarie- eller kontekstdata. Gå tilbage og start igen.");
        setLoading(false);
        return;
      }

      try {
        const payload = {
          subject: state.scenario.subject,
          grade: state.context.grade,
          curriculum: state.context.curriculum,
          ability: state.context.ability,
          learningStyle: state.context.learningStyle,
          interests: state.context.interests ?? [],
          ...state.context, // alle ekstra parametre sendes videre
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
  }, [scenarioId, state]);

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
        <h1 className="text-2xl font-semibold">Scenarie</h1>
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
