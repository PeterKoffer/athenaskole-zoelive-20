// src/services/universe/offlineScheduler.ts
import { UniversePack } from "@/content/types";
import { UniversePacks, Prime100 } from "@/content/universe.catalog";

type TZ = string; // e.g., "Europe/Copenhagen"
type HistoryRow = { packId: string; isoDate: string };

const HKEY = (userId: string) => `nelie:universeHistory:${userId}`;
const TZKEY = (schoolId: string) => `nelie:tz:${schoolId}`;
const PINKEY = (classId: string) => `nelie:pinWeek:${classId}`; // {packId, startISO, endISO}

export function setSchoolTimezone(schoolId: string, tz: TZ) {
  localStorage.setItem(TZKEY(schoolId), tz);
}
export function getSchoolTimezone(schoolId: string, fallback: TZ = Intl.DateTimeFormat().resolvedOptions().timeZone): TZ {
  return localStorage.getItem(TZKEY(schoolId)) ?? fallback;
}

function todayInTZ(tz: TZ) {
  return new Date(new Date().toLocaleString("en-US", { timeZone: tz })).toISOString().slice(0,10);
}

export function pinWeek(classId: string, packId: string, startISO: string, endISO: string) {
  localStorage.setItem(PINKEY(classId), JSON.stringify({ packId, startISO, endISO }));
}
export function getPinnedWeek(classId: string): { packId: string; startISO: string; endISO: string } | null {
  try { return JSON.parse(localStorage.getItem(PINKEY(classId)) || "null"); } catch { return null; }
}

function loadHistory(userId: string): HistoryRow[] {
  try { return JSON.parse(localStorage.getItem(HKEY(userId)) || "[]"); } catch { return []; }
}
function saveHistory(userId: string, hist: HistoryRow[]) {
  localStorage.setItem(HKEY(userId), JSON.stringify(hist.slice(-60))); // keep last 60 days
}

export function choosePackForToday(opts: {
  userId: string;
  schoolId: string;
  classId?: string;
  preferPrime?: boolean;
  avoidRepeatsDays?: number;   // default 30
}): { date: string; pack: UniversePack } {
  const tz = getSchoolTimezone(opts.schoolId);
  const date = todayInTZ(tz);
  const hist = loadHistory(opts.userId);
  const avoid = new Set(hist.slice(- (opts.avoidRepeatsDays ?? 30)).map(h => h.packId));

  // Pin-week override
  if (opts.classId) {
    const pin = getPinnedWeek(opts.classId);
    if (pin && date >= pin.startISO && date <= pin.endISO) {
      const pinned = UniversePacks.find(p => p.id === pin.packId);
      if (pinned) {
        if (!hist.find(h => h.isoDate === date)) saveHistory(opts.userId, [...hist, { packId: pinned.id, isoDate: date }]);
        return { date, pack: pinned };
      }
    }
  }

  const pool = (opts.preferPrime ? Prime100 : UniversePacks).filter(p => !avoid.has(p.id));
  const pick = pool.length ? pool[Math.floor(Math.random() * pool.length)] : UniversePacks[Math.floor(Math.random() * UniversePacks.length)];
  if (!hist.find(h => h.isoDate === date)) saveHistory(opts.userId, [...hist, { packId: pick.id, isoDate: date }]);
  return { date, pack: pick };
}