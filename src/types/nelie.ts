import { StudentProfile, TeacherSettings, SchoolLeaderSettings, CalendarContext, LessonTask, SubjectKey } from "./core";

export interface NelieContext {
  student: StudentProfile;
  teacher: TeacherSettings;
  leader: SchoolLeaderSettings;
  calendar?: CalendarContext;
  adventureId: string;
  task?: LessonTask;
  timePlan?: Array<{subject: SubjectKey; minutes: number}>;
  curriculumGoals?: string[];
  mode: "chat"|"hint"|"explain"|"example"|"check"|"quiz";
  answerDraft?: string;
}