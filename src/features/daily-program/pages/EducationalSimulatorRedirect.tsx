// src/features/daily-program/pages/EducationalSimulatorRedirect.tsx
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

type Ability = "support" | "core" | "advanced";
type LearningStyle = "visual" | "auditory" | "kinesthetic" | "mixed";

export default function EducationalSimulatorRedirect() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const qs = new URLSearchParams(location.search);

    const id = qs.get("id") ?? "fraction-adventure";
    const subject =
      qs.get("subject") ?? (id.includes("ecosystem") ? "Science" : "Mathematics");
    const title =
      qs.get("title") ??
      (id === "ecosystem-explorer" ? "Ecosystem Explorer" : "Fraction Adventure");

    const description = qs.get("description") ?? undefined;
    const gradeRange = qs.get("gradeRange") ?? undefined;

    const gradeRaw = Number(qs.get("grade") ?? 5);
    const grade = Number.isFinite(gradeRaw) ? gradeRaw : 5;
    const curriculum = qs.get("curriculum") ?? "DK/Fælles Mål 2024";
    const ability = (qs.get("ability") as Ability) ?? "core";
    const learningStyle = (qs.get("learningStyle") as LearningStyle) ?? "mixed";
    const interests = (qs.get("interests") ?? "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const scenario = { id, subject, title, description, gradeRange };
    const context = { grade, curriculum, ability, learningStyle, interests };

    navigate(`/scenario/${id}`, { replace: true, state: { scenario, context } });
  }, [location.search, navigate]);

  return (
    <div className="mx-auto max-w-screen-md p-6">
      <div className="animate-pulse text-sm opacity-70">Redirecting…</div>
    </div>
  );
}
