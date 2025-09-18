import { LessonTask, SubjectKey } from "@/types/core";

type TaskBank = {
  core: LessonTask[];
  extensions?: LessonTask[];
};

export function composeTimedLesson({
  plan, bankBySubject
}: {
  plan: Array<{subject: SubjectKey; minutes: number}>;
  bankBySubject: Record<SubjectKey, TaskBank>;
}) {
  const tasks: LessonTask[] = [];
  let total = 0;

  for (const {subject, minutes} of plan) {
    const bank = bankBySubject[subject];
    if (!bank) continue;

    for (const t of bank.core) {
      tasks.push(t);
      total += (t.estMinutes ?? 8);
    }

    const target = minutes;
    const ext = bank.extensions ?? [];
    let i = 0;
    while (total < target && i < ext.length) {
      const e = ext[i++];
      tasks.push(e);
      total += (e.estMinutes ?? 5);
    }
  }

  return { tasks, totalMinutes: total };
}