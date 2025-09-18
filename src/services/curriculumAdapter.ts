export interface CurriculumGoal { id: string; subject: string; gradeBand: string; label: string; }
export interface CurriculumAdapter { findGoals(subject: string, gradeBand: string): CurriculumGoal[]; }
export const curriculumAdapters: Record<string, CurriculumAdapter> = {
  "US-CommonCore-2023": { findGoals: (s,g)=>[] },
  "DK-FM-2022": { findGoals: (s,g)=>[] }
};
export function matchGoals(curriculum: string, subject: string, gradeBand: string){
  const ad = curriculumAdapters[curriculum] ?? curriculumAdapters["US-CommonCore-2023"];
  return ad.findGoals(subject, gradeBand);
}