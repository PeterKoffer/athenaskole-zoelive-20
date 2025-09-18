import { DailyProgramPayload, StudentProfile, TeacherSettings, SchoolLeaderSettings, SubjectKey } from "@/types/core";
import { adventurePrompt } from "@/prompts/adventurePrompt";
import { faithMatrix } from "@/prompts/faithMatrix";
import { resolveLessonDuration } from "@/services/time/resolveLessonDuration";
import { distributeMinutes } from "@/services/time/distributeMinutes";
import { composeTimedLesson } from "@/services/time/composeTimedLesson";

export async function pickAdventure({adventureId}:{adventureId?: string}) {
  // Stub – brug adventureId eller fallback til "food-truck"
  return { id: adventureId ?? "food-truck", title: "Food Truck Challenge" };
}

export function chooseSubjects(leaderWeights: Record<string, number>, teacherEmphasis: Record<string, number>) {
  return { ...leaderWeights, ...teacherEmphasis };
}

export async function loadTaskBanksForAdventure(_:any) {
  // Stub: i demoen er tasks læst direkte fra public/demo/adventures/.../*.json
  return {};
}

export async function buildDailyProgram(args:{
  student: StudentProfile; teacher: TeacherSettings; leader: SchoolLeaderSettings; calendar?: {dayDurationMinutes?: number}; adventureId?: string;
}): Promise<DailyProgramPayload> {
  const { student, teacher, leader, calendar } = args;
  const faithRules = faithMatrix(leader.worldview, leader.faithIntegrationLevel, leader.policy);
  const adventure = await pickAdventure(args);
  const weights = { ...(leader?.subjectWeights||{}), ...(teacher?.subjectEmphasis||{}) };
  const targetMinutes = resolveLessonDuration({ teacherMinutes: teacher?.dayLessonMinutes, calendarMinutes: calendar?.dayDurationMinutes });
  const timePlan = distributeMinutes({ subjectWeights: weights as any, targetMinutes });

  // Demo: vend tilbage med minimal payload – i UI loader vi JSON-filerne per elev/adventure
  return {
    adventureId: adventure.id,
    title: adventure.title,
    intro: "Loaded from demo JSON.",
    images: { cover: "", scenes: [] },
    tasks: [],
    faithBlock: null,
    totalMinutes: targetMinutes,
    targetMinutes,
    timePlan
  };
}