import React from 'react';
import type { AdventureConfig } from '@/types/AdventureSettings';

export default function HeroBoxes({ cfg }: { cfg: AdventureConfig }) {
  return (
    <div className="space-y-4">
      <section className="rounded-xl border border-border p-4 bg-primary/5">
        <h2 className="text-sm font-semibold mb-1">Your Adventure Begins…</h2>
        <p className="text-sm leading-6">{cfg.hero.hook}</p>
      </section>

      <section className="rounded-xl border border-border p-4 bg-muted/20">
        <h3 className="text-sm font-semibold mb-1">What Awaits You Today</h3>
        <ul className="text-sm space-y-1">
          {cfg.hero.bullets.map((b, i) => <li key={i}>{b}</li>)}
        </ul>
      </section>
    </div>
  );
}