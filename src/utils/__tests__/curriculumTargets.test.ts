// @ts-nocheck
// src/utils/__tests__/curriculumTargets.test.ts
import { resolveCurriculumTargets } from "@/utils/curriculumTargets";

test("DK: Dansk 6-8 giver ≥3 FM-mål", () => {
  const t = resolveCurriculumTargets({ subject: "Danish", gradeBand: "6-8", country: "DK" });
  expect(t.length).toBeGreaterThanOrEqual(3);
  expect(t[0]).toMatch(/FM:/);
});

test("Alias: Matematik → Mathematics", () => {
  const t = resolveCurriculumTargets({ subject: "Matematik", gradeBand: "3-5", country: "DK" });
  expect(t[0]).toMatch(/FM:|GEN:/);
});

test("Fallback: ukendt fag → Science defaults (≥3)", () => {
  const t = resolveCurriculumTargets({ subject: "History", gradeBand: "6-8", country: "DK" });
  expect(t.length).toBeGreaterThanOrEqual(3);
});
