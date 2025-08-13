import { SUBJECTS_12, normalizeSubject } from "@/utils/subjects";

export function chooseSubjectFromWeights(
  weights: Record<string, number>,
  recentlyUsed: string[] = []
): string {
  const avoid = new Set(recentlyUsed.map(s => normalizeSubject(s)));
  
  const scored = SUBJECTS_12.map(s => {
    const normalizedSubject = normalizeSubject(s);
    const w = Number.isFinite(weights[s] as number) ? (weights[s] as number) : 
              Number.isFinite(weights[normalizedSubject] as number) ? (weights[normalizedSubject] as number) : 5;
    const penalty = avoid.has(normalizedSubject) ? 0.5 : 0;
    return { 
      subject: s, 
      score: w - penalty + Math.random() * 0.01 
    };
  }).sort((a, b) => b.score - a.score);
  
  return scored[0]?.subject ?? "Mathematics";
}

export function getHighPrioritySubjects(
  weights: Record<string, number>,
  threshold: number = 7
): string[] {
  return SUBJECTS_12.filter(subject => {
    const normalizedSubject = normalizeSubject(subject);
    const weight = weights[subject] || weights[normalizedSubject] || 5;
    return weight >= threshold;
  });
}