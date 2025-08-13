// @ts-nocheck
// src/utils/__tests__/curriculumTargets.defaults.test.ts
import { resolveCurriculumTargets } from "@/utils/curriculumTargets";

it("defaults to EN targets when country is omitted", () => {
  const en = resolveCurriculumTargets({ subject: "Mathematics", gradeBand: "6-8" });
  expect(en.length).toBeGreaterThanOrEqual(3);
  expect(en.some(s => /FM:/.test(s))).toBe(false);
});

it("uses DK mapping only when country==='DK'", () => {
  const dk = resolveCurriculumTargets({ subject: "Mathematics", gradeBand: "6-8", country: "DK" });
  expect(dk.length).toBeGreaterThanOrEqual(3);
  expect(dk[0]).toMatch(/^FM:/);
});
