export function DevLessonQA({ lesson }: { lesson: any }) {
  if (!import.meta.env.DEV || !lesson) return null;

  const acts = lesson.activities ?? lesson.allActivities ?? [];
  const kinds = Array.from(new Set(acts.map((a: any) => a.kind || a.type || a.phase).filter(Boolean)));
  const timeSum = acts.reduce((s: number, a: any) => {
    const est = a.estimatedTimeMin ?? (a.duration ? Math.round(a.duration / 60) : 0);
    return s + (Number.isFinite(est) ? est : 0);
  }, 0);
  const missingStd = acts.filter((a: any) => !(a.curriculumStandard || a?.metadata?.curriculumStandard)).length;

  const weak = acts.filter((a: any) => {
    const question = a.question ?? a?.content?.question ?? a?.title;
    const options = a.options ?? a?.content?.options;
    const rubric = a.rubric ?? a?.content?.rubric;
    const hints = a.hints ?? a?.content?.hints;
    const explanation = a.explanation ?? a?.content?.explanation;
    const assess = ((Array.isArray(options) && options.length >= 3 && a.correctIndex !== undefined) ||
      (Array.isArray(rubric) && rubric.length >= 2));
    return !question || !assess || !(Array.isArray(hints) && hints.length >= 1) || !explanation;
  }).length;

  const target = lesson?.meta?.durationMin ?? lesson?.targetDuration ?? 150;

  return (
    <div className="mt-2 text-xs rounded-lg p-3 border border-amber-300 bg-amber-50">
      <div><b>QA · Planner→Activities</b></div>
      <div>Aktiviteter: {acts.length} · Typer: {kinds.join(", ") || "—"}</div>
      <div>Samlet tid: {timeSum} / {target} min</div>
      <div>Manglende standard: {missingStd} · Svage aktiviteter: {weak}</div>
      {kinds.length < Math.min(3, acts.length) && (
        <div className="text-red-600">⚠️ Lav variation – overvej at regenerere 1–2 slots.</div>
      )}
      {Math.abs(timeSum - target) > 5 && (
        <div className="text-red-600">⚠️ Tidsbudget off – check normalisering/slot-estimates.</div>
      )}
    </div>
  );
}
