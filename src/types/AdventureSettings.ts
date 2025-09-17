export type EndMode = 'pitch' | 'showcase' | 'private' | 'pair_share' | 'panel';

export interface AdventurePresentation {
  default: EndMode;
  allowed: EndMode[];
  labels: Record<EndMode, string>;
}

export interface AdventureGamePolicy {
  enabled: boolean;        // teacher toggle
  max_share: number;       // 0.10 = 10% of total day
  gating: 'core_required'; // keep for clarity
  fallback: 'drop_games_first';
}

export interface AdventureCopy {
  hook: string;
  bullets: string[];
}

export interface AdventureConfig {
  id: string;
  title: string;
  ui_language: 'en'|'da';
  cover_image: { consistency_tag: string; prompt: string; negative: string; };
  time_anchors?: { message_at?: string; teaser_due?: string; listening_at?: string; };
  hero: AdventureCopy;
  presentation: AdventurePresentation;
  games: AdventureGamePolicy;
}