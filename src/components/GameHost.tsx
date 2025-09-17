import React, { useEffect, useRef, useState } from 'react';
import { getGame } from '@/games/registry';
import type { GameStartOptions } from '@/games/sdk';
import { emitGameEvent } from '@/games/telemetry';

export function GameHost({
  gameId,
  opts,
  allowStart,               // gating fra core-opgave
  onComplete,
  onTick,
}: {
  gameId: string;
  opts: GameStartOptions;
  allowStart: boolean;
  onComplete: (r: { score: number; data?: any }) => void;
  onTick?: (secLeft: number) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const handleRef = useRef<any>(null);
  const [secLeft, setSecLeft] = useState<number>(opts.timeboxSec);

  useEffect(() => {
    let timer: any; let raf: any;
    let destroyed = false;

    async function mount() {
      const root = ref.current!;
      root.innerHTML = '';
      const game = getGame(gameId);
      if (!game) { root.innerText = `Game not found: ${gameId}`; return; }

      if (!allowStart) {
        root.innerHTML = `<div class="p-4 text-sm">Afslut kerneopgaven for at låse op for spillet.</div>`;
        return;
      }

      const handle = await game.mount(root, opts);
      handleRef.current = handle;
      emitGameEvent({ type:'game:start', id: gameId, seed: opts.seed, t0: Date.now() });

      // Timebox
      const startedAt = Date.now();
      timer = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startedAt) / 1000);
        const left = Math.max(0, opts.timeboxSec - elapsed);
        setSecLeft(left);
        onTick?.(left);
        if (left % 60 === 0) emitGameEvent({ type:'game:checkpoint', id: gameId, t: Date.now(), payload: { left } });
        if (left <= 0) finish();
      }, 1000);

      function finish() {
        if (destroyed) return;
        handle.submit({ reason: 'timebox' }).then((res) => {
          emitGameEvent({ type:'game:complete', id: gameId, score: res.scoreDelta ?? 0, t: Date.now(), data: res.data });
          onComplete({ score: res.scoreDelta ?? 0, data: res.data });
        }).catch(() => onComplete({ score: 0 }));
      }
    }

    mount();
    return () => { destroyed = true; try { clearInterval(timer); handleRef.current?.destroy?.(); } catch {} };
  }, [gameId, allowStart, opts.seed]);

  return (
    <div className="relative border rounded-xl p-2">
      <div className="absolute right-2 top-2 text-xs opacity-70">⏱ {Math.ceil(secLeft/60)}m</div>
      <div ref={ref} className="min-h-[220px]" />
    </div>
  );
}