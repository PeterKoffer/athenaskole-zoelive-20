export type RubricReport = {
  groundedInDailyLife: boolean;
  usesProps: boolean;
  clearLearningGoal: boolean;
  standardLinked: boolean;
  cognitiveLevel: "remember"|"understand"|"apply"|"analyze"|"evaluate"|"create";
  engagementHooks: string[]; // timer, budget, map, choice, role
  fix?: string;              // one-line fix instruction
};

export const RUBRIC_PROMPT = (subject: string, activity: any) => `
Evaluate this ${subject} activity against world-class educational criteria.
Activity JSON: ${JSON.stringify(activity)}

Check these criteria:
1. Grounded in daily life (school, home, work, community - not fantasy)
2. Uses concrete props/tools mentioned in the activity
3. Has clear, measurable learning goal
4. Links to specific curriculum standard
5. Cognitive level (Bloom's taxonomy)
6. Engagement hooks (budget, timer, map, choice, role-play, etc.)

Return strict JSON with:
{
  "groundedInDailyLife": true/false,
  "usesProps": true/false,
  "clearLearningGoal": true/false,
  "standardLinked": true/false,
  "cognitiveLevel": "apply|analyze|evaluate|create|understand|remember",
  "engagementHooks": ["budget","map","timer"] (list 0-3 hooks found),
  "fix": "one precise instruction if anything needs improvement"
}
`.trim();