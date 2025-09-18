export type StudentLevel = 'remedial'|'core'|'stretch';

export interface GameStartOptions { 
  seed: string; 
  timeboxSec: number; 
  studentLevel: StudentLevel; 
  i18n?: 'da'|'en'|'es'|'it'; 
  context?: Record<string, unknown>; 
}

export interface GameHandle { 
  start(): void; 
  pause(): void; 
  resume(): void; 
  destroy(): void; 
  submit(input: unknown): Promise<{ ok: boolean; scoreDelta?: number; data?: unknown }>; 
  on(event:'checkpoint'|'telemetry'|'complete', cb:(p:any)=>void): void; 
  getState(): unknown; 
}

export interface AdventureGame { 
  mount(el: HTMLElement, opts: GameStartOptions): Promise<GameHandle>; 
  id: string; 
  title: string; 
  subject: string; 
  minVersion?: string; 
}