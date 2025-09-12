// src/services/content/ContentGenerationService.ts
import { buildContentRequest, normalizeGrade } from "../../content";
import { generateLesson } from "../contentClient";

export type ContentGenerationRequest = ReturnType<typeof buildContentRequest>;
export type Atom = { type: string; text?: string; data?: any; steps?: any[] };
export type AtomSequence = Atom[];

class ContentGenerationService {
  async generate(params: Parameters<typeof buildContentRequest>[0]) {
    const body = buildContentRequest(params);
    return await generateLesson(body);
  }

  // Instance helpers (bevarer tidligere API)
  normalizeGrade = normalizeGrade;
  buildRequest = buildContentRequest;
}

export default new ContentGenerationService();
export { ContentGenerationService };
