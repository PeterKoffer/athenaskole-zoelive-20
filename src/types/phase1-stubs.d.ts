declare module '@/services/*' { const mod: any; export = mod; }
declare module '@/services/*/*' { const mod: any; export = mod; }
declare module '@/services/*/*/*' { const mod: any; export = mod; }

declare module '@/integrations/*' { const mod: any; export = mod; }

/* Manglende named-exports fra lærings-typer (for at tilfredsstille imports) */
declare module '@/types/learnerProfile' {
  export type LearnerProfile = any;
  export type KnowledgeComponentMastery = any;
  export type LearnerPreferences = any;
  export type KCMasteryUpdateData = any;
  const _default: any;
  export default _default;
}

/* Education-komponenter der kan boble services ind */
declare module '@/components/education/*' { const mod: any; export = mod; }
declare module '@/components/education/*/*' { const mod: any; export = mod; }
