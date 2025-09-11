// src/features/daily-program/pages/UniverseLesson.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";

type Scenario = {
  id: string;
  title: string;
  subject: string;
  gradeRange?: string;
  description?: string;
};

type Context = {
  grade: number;
  curriculum: string;
  ability: "support" | "core" | "advanced";
  learningStyle: "visual" | "auditory" | "kinesthetic" | "mixed";
  interests?: string[];
  [k: string]: unknown;
};

const scenarios: Scenario[] = [
  {
    id: "fraction-adventure",
    title: "Fraction Adventure",
    subject: "Mathematics",
    gradeRange: "3-5",
    description:
      "Help a baker divide pizzas equally among customers while learning fractions.",
  },
  {
    id: "ecosystem-explorer",
    title: "Ecosystem Explorer",
    subject: "Science",
    gradeRange: "4-6",
    description:
      "Discover how animals and plants depend on each other in different habitats.",
  },
];

export default function DailyUniverseLessonPage() {
  const navigate = useNavigate();

  // TODO: Hent fra din rigtige profil/dashboard state
  const [context] = useState<Context>({
    grade: 5,
    curriculum: "DK/Fælles Mål 2024",
    ability: "core",
    learningStyle: "mixed",
    interests: ["baking", "nature"],
  });

  const [universeLoading, setUniverseLoading] = useState(false);
  const [universeError, setUniverseError] = useState<string | null>(null);
  const [universe, setUniverse] = useState<any>(null);

  async function onGenerateNewUniverse() {
    setUniverseError(null);
    setUniverseLoading(true);
    try {
      // ✅ Dedupe + normalisér: undgå duplikerede keys ved at spreade kun én gang
      const sanitizedContext: Context = {
        ...context,
        interests: context.interests ?? [],
      };

      const payload = {
        subject: "Universe", // skift til korrekt nøgle hvis backend forventer andet
        ...sanitizedContext,
      };

      const { data, error } = await supabase.functions.invoke("generate-content", {
        body: payload,
      });
      if (error) {
        // @ts-ignore supabase error kan have status/context
        console.error("[generate-content] non-2xx", {
          message: error.message,
          // @ts-ignore
          status: error.status,
          // @ts-ignore
          context: error.context,
        });
        throw error;
      }
      setUniverse(data);
    } catch (e: any) {
      console.error("[UniverseLesson] invoke failed", e);
      setUniverseError(e?.message ?? String(e));
    } finally {
      setUniverseLoading(false);
    }
  }

  function onStartScenario(s: Scenario) {
    // ✅ Ny rute + state
    navigate(`/scenario/${s.id}`, { state: { scenario: s, context } });
    // Hvis du vil støtte fuld URL uden state, behold evt. denne som reference (kommenteret):
    // navigate(`/educational-simulator?subject=${encodeURIComponent(s.subject)}&id=${encodeURIComponent(s.id)}&title=${encodeURIComponent(s.title)}&grade=${context.grade}&curriculum=${encodeURIComponent(context.curriculum)}&ability=${context.ability}&learningStyle=${context.learningStyle}&interests=${encodeURIComponent((context.interests ?? []).join(","))}`);
  }

  return (
    <div className="mx-auto max-w-screen-xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="text-sm opacity-70">Welcome</div>
          <h1 className="text-2xl font-semibold">Today's Learning Universe</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="rounded-md bg-neutral-200 px-3 py-1.5 text-sm"
            onClick={onGenerateNewUniverse}
            disabled={universeLoading}
            title="Generate a fresh universe using your parameters"
          >
            {universeLoading ? "Generating…" : "Generate New Universe"}
          </button>
        </div>
      </div>

      {/* Universe summary */}
      <div className="mb-6 rounded-xl border bg-white p-4 shadow-sm">
        <h2 className="mb-1 text-lg font-semibold">Your Daily Universe</h2>
        {!universe && (
          <p className="text-sm opacity-70">
            Click “Generate New Universe” to create an engaging daily learning
            universe with characters, locations, and activities.
          </p>
        )}
        {universeError && (
          <div className="mt-2 rounded-md bg-red-50 p-3 text-sm text-red-700">
            {universeError}
          </div>
        )}
        {universe && (
          <pre className="mt-3 max-h-80 overflow-auto rounded-lg bg-neutral-900 p-3 text-xs text-neutral-100">
            {JSON.stringify(universe, null, 2)}
          </pre>
        )}
      </div>

      {/* Scenarios */}
      <h3 className="mb-3 text-lg font-semibold">Interactive Learning Scenarios</h3>
      <div className="grid gap-4 md:grid-cols-2">
        {scenarios.map((s) => (
          <div key={s.id} className="rounded-xl border bg-white p-4 shadow-sm">
            <h4 className="mb-1 text-base font-semibold">{s.title}</h4>
            <p className="mb-3 text-sm opacity-80">{s.description}</p>
            <div className="mb-4 text-xs opacity-70">
              <div>Subject: {s.subject}</div>
              {s.gradeRange && <div>Grade: {s.gradeRange}</div>}
            </div>
            <button
              className="rounded-md bg-blue-600 px-4 py-2 text-white"
              onClick={() => onStartScenario(s)}
            >
              Start Scenario
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
