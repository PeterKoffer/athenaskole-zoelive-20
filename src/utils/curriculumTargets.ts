// src/utils/curriculumTargets.ts

type Input = {
  subject: string; // canonical (e.g., "Mathematics", "Science", "Danish")
  gradeBand: string; // e.g., "3-5", "6-8"
  country?: string; // e.g., "DK", "US"
};

const INTERNAL_DEFAULTS: Record<string, Record<string, string[]>> = {
  // DK placeholders (replace with Fælles Mål when ready)
  DK: {
    Danish: [
      "NELIE:DK-DAN-READ-INFO",
      "NELIE:DK-DAN-WRITE-SHORT",
      "NELIE:DK-DAN-COMPREHENSION",
    ],
    Mathematics: [
      "NELIE:DK-MAT-FRACTIONS",
      "NELIE:DK-MAT-PROBLEM-SOLVING",
      "NELIE:DK-MAT-DATA-READ",
    ],
    Science: [
      "NELIE:DK-NAT-OBSERVE-EXPLAIN",
      "NELIE:DK-NAT-ENERGY-BASICS",
      "NELIE:DK-NAT-ECOSYSTEMS",
    ],
  },
  // Generic goals if country/subject missing
  DEFAULT: {
    Mathematics: [
      "NELIE:GEN-MATH-NUM-REASONING",
      "NELIE:GEN-MATH-FRACTIONS",
      "NELIE:GEN-MATH-DATA",
    ],
    Science: [
      "NELIE:GEN-SCI-INVESTIGATION",
      "NELIE:GEN-SCI-MODELS",
      "NELIE:GEN-SCI-ECOSYSTEMS",
    ],
    "Language Arts": [
      "NELIE:GEN-LANG-READING",
      "NELIE:GEN-LANG-WRITING",
      "NELIE:GEN-LANG-SPEAKING",
    ],
    Geography: [
      "NELIE:GEN-GEO-MAPS",
      "NELIE:GEN-GEO-REGIONS",
      "NELIE:GEN-GEO-HUMAN-ENV",
    ],
  },
};

export function resolveCurriculumTargets(input: Input): string[] {
  const subject = (input.subject || "").trim();
  const country = (input.country || "DEFAULT").toUpperCase();

  const pool =
    INTERNAL_DEFAULTS[country]?.[subject] ||
    INTERNAL_DEFAULTS.DEFAULT[subject] ||
    Object.values(INTERNAL_DEFAULTS.DEFAULT)[0]; // first generic fallback

  // Guarantee: at least 3 goals
  const out = Array.isArray(pool) ? [...pool] : [];
  while (out.length < 3) out.push("NELIE:GEN-GOAL-PLACEHOLDER");
  return out.slice(0, 6); // reasonable cap
}
