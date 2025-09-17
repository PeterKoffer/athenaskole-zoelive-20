import React, { useEffect, useState } from 'react';
import type { AdventureConfig, EndMode } from '@/types/AdventureSettings';
import { loadSettings, saveSettings } from '@/services/adventureSettings';
import { useDebounce } from '@/hooks/useDebounce';

type Props = {
  classId: string;
  adventureId: string;
  initial: AdventureConfig;                 // fallback (e.g., living_history.en.json)
};

export default function AdventureSettingsPanel({ classId, adventureId, initial }: Props) {
  const [cfg, setCfg] = useState<AdventureConfig>(initial);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    loadSettings(classId, adventureId)
      .then((s) => { if (s) setCfg(s); })
      .finally(() => setLoaded(true));
  }, [classId, adventureId]);

  useDebounce(cfg, 600, (v) => { 
    if (loaded) {
      saveSettings(classId, adventureId, v).catch(console.error);
    }
  });

  const setEndMode = (em: EndMode) => setCfg({ ...cfg, presentation: { ...cfg.presentation, default: em } });
  const setGamesEnabled = (enabled: boolean) => setCfg({ ...cfg, games: { ...cfg.games, enabled } });

  return (
    <div className="space-y-4">
      {/* End Mode */}
      <div className="rounded-xl border border-border p-4">
        <h3 className="text-sm font-semibold mb-2">End Mode</h3>
        <p className="text-xs text-muted-foreground mb-2">How do you want today's work to conclude?</p>
        <div className="flex flex-wrap gap-2">
          {cfg.presentation.allowed.map((mode) => (
            <button 
              key={mode} 
              onClick={() => setEndMode(mode)}
              className={`px-3 py-1 rounded border text-sm transition-colors ${
                cfg.presentation.default === mode 
                  ? 'bg-primary text-primary-foreground border-primary' 
                  : 'bg-background hover:bg-muted border-border'
              }`}
              title={cfg.presentation.labels[mode]}
            >
              {cfg.presentation.labels[mode]}
            </button>
          ))}
        </div>
      </div>

      {/* Games cap */}
      <div className="rounded-xl border border-border p-4">
        <h3 className="text-sm font-semibold mb-2">Micro-interactions (games)</h3>
        <p className="text-xs text-muted-foreground mb-2">Unlock only after core tasks; hard-capped at 10% of the day.</p>
        <label className="inline-flex items-center gap-2 text-sm">
          <input 
            type="checkbox" 
            checked={cfg.games.enabled} 
            onChange={(e) => setGamesEnabled(e.target.checked)}
            className="rounded border-border" 
          />
          Enable micro-interactions (max 10%)
        </label>
      </div>

      {/* Read-only anchors */}
      <div className="rounded-xl border border-border p-4 grid grid-cols-3 gap-3 text-sm">
        <div>
          <div className="text-xs text-muted-foreground">Message at</div>
          <div>{cfg.time_anchors?.message_at || '—'}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Teaser due</div>
          <div>{cfg.time_anchors?.teaser_due || '—'}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Listening at</div>
          <div>{cfg.time_anchors?.listening_at || '—'}</div>
        </div>
      </div>
    </div>
  );
}