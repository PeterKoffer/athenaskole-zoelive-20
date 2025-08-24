import { UniverseGenerator } from "@/services/UniverseGenerator";

export const UnifiedQuestionGenerationService = {
  async generateQuestion() {
    // Grab the first activity from the sample universes as a simple question
    const universes = UniverseGenerator.getUniverses();
    const activity = universes[0]?.activities?.[0];

    if (activity) {
      return { question: activity };
    }

    // Fallback for tests so we always return *something*
    return { question: "What is 2 + 2?" };
  },
};

export default UnifiedQuestionGenerationService;
