export type StudentLevel = 'remedial'|'core'|'stretch';

export interface GameStartOptions {
  seed: string;                 // stabilt run (brug fx seedFromId(adventureId, phaseIndex))
  timeboxSec: number;           // fasetid (typisk 600–900s)
  studentLevel: StudentLevel;
  i18n?: 'da'|'en'|'es'|'it';
  context?: Record<string, unknown>; // fx BOM, priser, events
}

export interface GameHandle {
  start(): void;
  pause(): void;
  resume(): void;
  destroy(): void;
  submit(input: unknown): Promise<{ ok: boolean; scoreDelta?: number; data?: unknown }>;
  on(event: 'checkpoint'|'telemetry'|'complete', cb: (p: any)=>void): void;
  getState(): unknown;
}

export interface AdventureGame {
  mount(el: HTMLElement, opts: GameStartOptions): Promise<GameHandle>;
  id: string;                    // registry key
  title: string;
  subject: string;               // fx "Mathematics", "Science"
  minVersion?: string;           // optional semver
}