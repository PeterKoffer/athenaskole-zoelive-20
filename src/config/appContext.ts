// src/config/appContext.ts
export const AppContext = {
  repo: "https://github.com/PeterKoffer/athenaskole-zoelive-20",
  branch: "New-core-map",
  routes: {
    dailyProgram: "/daily-program",
    scenario: "/scenario/:scenarioId",
    legacySimulator: "/educational-simulator",
  },
  env: ["VITE_SUPABASE_URL", "VITE_SUPABASE_ANON"],
  edge: { functionName: "generate-content" },
  contentFacade: "@content",
} as const;
export type AppContextType = typeof AppContext;
