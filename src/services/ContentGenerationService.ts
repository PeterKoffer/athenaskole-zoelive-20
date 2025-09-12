// src/services/ContentGenerationService.ts
import { buildContentRequest, normalizeGrade } from "../content";
import { generateLesson } from "./contentClient";

export type ContentGenerationRequest = ReturnType<typeof buildContentRequest>;
export type Atom = { type: string; text?: string; data?: any; steps?: any[] };
export type AtomSequence = Atom[];

export class ContentGenerationService {
  async generate(params: {
    subject: string;
    grade: number | string;
    curriculum?: string | null;
    ability?: "remedial" | "standard" | "advanced" | string;
    learningStyle?: string;
    interests?: string[] | string | null;
    schoolPhilosophy?: string | null;
    teacherWeights?: Record<string, number> | null;
    lessonDurationMins?: number | null;
    calendarKeywords?: string[] | null;
    calendarDurationDays?: number | null;
  }) {
    const body = buildContentRequest(params);
    return await generateLesson(body);
  }

  // Bagudkompatible helpers
  static normalizeGrade = normalizeGrade;
  static buildRequest = buildContentRequest;
}

export const contentGenerationService = new ContentGenerationService();
export default contentGenerationService;
