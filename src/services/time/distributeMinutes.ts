import { SubjectKey } from "@/types/core";

export function distributeMinutes({
  subjectWeights, targetMinutes
}: { subjectWeights: Record<SubjectKey, number>; targetMinutes: number; }) {
  const entries = Object.entries(subjectWeights) as [SubjectKey, number][];
  const totalWeight = entries.reduce((s, [,w]) => s + (w||0), 0) || 1;
  const minPer = 5;
  let minutes = entries.map(([s,w]) => [s, Math.max(minPer, Math.round((w||0)/totalWeight * targetMinutes))] as const);
  let sum = minutes.reduce((s, [,m]) => s + m, 0);
  while (sum > targetMinutes) { const i = minutes.reduce((imax, cur, idx, arr) => arr[idx][1] > arr[imax][1] ? idx : imax, 0); minutes[i] = [minutes[i][0], minutes[i][1]-1] as const; sum--; }
  while (sum < targetMinutes) { const i = minutes.reduce((imin, cur, idx, arr) => arr[idx][1] < arr[imin][1] ? idx : imin, 0); minutes[i] = [minutes[i][0], minutes[i][1]+1] as const; sum++; }
  return minutes.map(([subject, minutes]) => ({ subject, minutes }));
}