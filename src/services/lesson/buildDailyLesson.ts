import { getContentSource } from "@/utils/contentSource";
import { pickForDay } from "@/services/content/offlineScheduler"; // your scheduler
import { buildFromPack } from "@/services/content/aiGlue";        // already returns structured activities
import { getUserLocaleCountry } from "@/services/user/locale";
import { saveLessonCache, loadLessonCache } from "@/services/cache/LessonCache";

type BuildArgs = {
  userId: string;
  gradeBand: "K-2"|"3-5"|"6-8"|"9-10"|"11-12";
  minutes: number;
  subject?: string;            // optional; if provided, bias scheduler
  dateISO: string;             // YYYY-MM-DD
};

export async function buildDailyLesson(args: BuildArgs) {
  const source = getContentSource(); // "offline" | "ai" | "hybrid"
  const country = getUserLocaleCountry(); // e.g., "US" | "DK"
  const cacheKey = [
    "lesson",
    args.userId,
    args.dateISO,
    source,
    args.subject ?? "any",
    args.gradeBand,
    args.minutes
  ].join(":");

  const cached = loadLessonCache(cacheKey);
  if (cached) return { ...cached, __source: source };

  // 1) Always pick an offline pack first (even for AI/hybrid, it becomes the grounding brief)
  const pick = await pickForDay({
    userId: args.userId,
    dateISO: args.dateISO,
    gradeBand: args.gradeBand,
    subjectBias: args.subject,
    minutes: args.minutes,
    country
  });
  
  if (!pick?.pack) {
    console.warn("[Universe] No pack returned; falling back to tiny safe default.");
    // Return a minimal fallback lesson
    return {
      activities: [],
      hero: {
        subject: args.subject || "general",
        gradeBand: args.gradeBand,
        minutes: args.minutes,
        title: "Learning Session",
        subtitle: "A brief learning experience",
        packId: "fallback"
      },
      __source: source,
      __packId: "fallback"
    };
  }

  // 2) Build activities from pack only (OFFLINE), or let AI enrich (AI/HYBRID)
  let lesson;
  if (source === "offline") {
    lesson = await buildFromPack({ pack: pick.pack, minutes: args.minutes, gradeBand: args.gradeBand, country, ai: false });
  } else if (source === "ai") {
    lesson = await buildFromPack({ pack: pick.pack, minutes: args.minutes, gradeBand: args.gradeBand, country, ai: true });
  } else {
    // hybrid: structured from pack, ask AI for 1–2 embellishments only
    lesson = await buildFromPack({ pack: pick.pack, minutes: args.minutes, gradeBand: args.gradeBand, country, ai: { embellishments: 2 } });
  }

  // 3) Force hero/metadata to come from the pack (prevents old "Learning Lab" template)
  lesson.hero = {
    subject: pick.pack.subject,
    gradeBand: args.gradeBand,
    minutes: args.minutes,
    title: pick.pack.title,
    subtitle: pick.pack.tagline ?? pick.pack.description,
    packId: pick.pack.id
  };

  // 4) Persist "no repeat" history via the scheduler's API
  try { await pick.markUsed?.(); } catch {}

  const final = { ...lesson, __source: source, __packId: pick.pack.id };
  saveLessonCache(cacheKey, final);
  return final;
}