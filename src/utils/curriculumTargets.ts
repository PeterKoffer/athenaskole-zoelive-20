// src/utils/curriculumTargets.ts
import { DK_TARGETS } from "./curriculumTargets.dk";

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
  const country = (input.country ?? "DK").toUpperCase();
  const subjectRaw = (input.subject ?? "").trim();
  const bandRaw = (input.gradeBand ?? "").trim();

  const aliasMap: Record<string, string> = {
    "Natur/teknologi": "Science",
    "Naturfag": "Science",
    "Dansk": "Danish",
    "Matematik": "Mathematics",
  };

  const subject = (aliasMap[subjectRaw] ?? subjectRaw) || "Science";

  const band = (() => {
    if (bandRaw.match(/^\d+$/)) {
      const n = Number(bandRaw);
      if (n >= 3 && n <= 5) return "3-5";
      if (n >= 6 && n <= 8) return "6-8";
    }
    return bandRaw;
  })();

  const atLeast3 = (arr: string[]) => {
    const out = Array.isArray(arr) ? [...arr] : [];
    while (out.length < 3) out.push("GEN: Placeholder-mål");
    return out.slice(0, 6);
  };

  if (country === "DK" && band && (DK_TARGETS as any)[band]?.[subject]?.length) {
    return atLeast3((DK_TARGETS as any)[band][subject]);
  }

  const pool =
    (INTERNAL_DEFAULTS as any)[country]?.[subject] ||
    (INTERNAL_DEFAULTS as any).DEFAULT[subject] ||
    Object.values((INTERNAL_DEFAULTS as any).DEFAULT)[0];

  // Guarantee at least 3 using generic placeholder
  const out = Array.isArray(pool) ? [...pool] : [];
  while (out.length < 3) out.push("NELIE:GEN-GOAL-PLACEHOLDER");
  return out.slice(0, 6);
}
