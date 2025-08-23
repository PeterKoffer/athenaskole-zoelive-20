// @ts-nocheck
// src/utils/__tests__/curriculumTargets.flags.test.ts
import { resolveCurriculumTargets } from "@/utils/curriculumTargets";

const OLD_ENV = (import.meta as any).env;

describe("country feature flag", () => {
  beforeEach(() => { (import.meta as any).env = { ...OLD_ENV }; });
  afterAll(() => { (import.meta as any).env = OLD_ENV; });

  test("EN default when flag is off", () => {
    (import.meta as any).env.VITE_FEATURE_DK_TARGETS = "false";
    const t = resolveCurriculumTargets({ subject: "Mathematics", gradeBand: "6-8" });
    expect(t.length).toBeGreaterThanOrEqual(3);
    expect(t.some((s: string) => /^FM:/.test(s))).toBe(false);
  });

  test("DK applies only when flag on AND country==='DK'", () => {
    (import.meta as any).env.VITE_FEATURE_DK_TARGETS = "true";
    const dk = resolveCurriculumTargets({ subject: "Mathematics", gradeBand: "6-8", country: "DK" });
    expect(dk[0]).toMatch(/^FM:/);

    const en = resolveCurriculumTargets({ subject: "Mathematics", gradeBand: "6-8" });
    expect(en.some((s: string) => /^FM:/.test(s))).toBe(false);
  });
});
