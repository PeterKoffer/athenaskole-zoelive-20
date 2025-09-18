export function resolveLessonDuration({ teacherMinutes, calendarMinutes }:{
  teacherMinutes?: number; calendarMinutes?: number;
}) {
  const candidate = calendarMinutes ?? teacherMinutes ?? 150;
  const clamped = Math.max(150, Math.min(360, candidate));
  return clamped;
}