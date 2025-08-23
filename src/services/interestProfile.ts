import { InterestTag } from "./interestSignals";

type Profile = { 
  counts: Record<InterestTag, number>; 
  updatedAt: string; 
};

const KEY = "nelie_interest_profile:v1";

export function loadProfile(): Profile {
  try { 
    const stored = localStorage.getItem(KEY);
    if (stored) {
      return JSON.parse(stored) as Profile;
    }
  } catch (e) {
    console.warn("Failed to load interest profile:", e);
  }
  return { counts: Object.create(null), updatedAt: new Date().toISOString() };
}

export function bump(tag: InterestTag, delta = 1) {
  const p = loadProfile();
  p.counts[tag] = (p.counts[tag] ?? 0) + delta;
  p.updatedAt = new Date().toISOString();
  localStorage.setItem(KEY, JSON.stringify(p));
  return p;
}

export function topTags(k = 3): InterestTag[] {
  const p = loadProfile();
  return Object.entries(p.counts)
    .sort((a, b) => (b[1] ?? 0) - (a[1] ?? 0))
    .slice(0, k)
    .map(([t]) => t as InterestTag);
}

export function getInterestScore(tag: InterestTag): number {
  const p = loadProfile();
  return p.counts[tag] ?? 0;
}

export function getAllInterests(): Record<InterestTag, number> {
  const p = loadProfile();
  return { ...p.counts };
}