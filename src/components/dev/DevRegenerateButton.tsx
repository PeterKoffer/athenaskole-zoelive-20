import { useState } from 'react';
import { useUnifiedLesson } from '@/components/education/contexts/UnifiedLessonContext';
import { useToast } from '@/hooks/use-toast';

export default function DevRegenerateButton({ slotId }: { slotId: string }) {
  if (!import.meta.env.DEV) return null;
  const { regenerateActivityBySlotId, isSlotBusy } = useUnifiedLesson() as any;
  const { toast } = useToast();
  const [busy, setBusy] = useState(false);
  const [intent, setIntent] = useState<undefined | 'harder' | 'easier' | 'changeKind'>(undefined);

  if (!regenerateActivityBySlotId) return null;

  const handleClick = async () => {
    try {
      if (busy || (typeof isSlotBusy === 'function' && isSlotBusy(slotId))) return;
      setBusy(true);
      await regenerateActivityBySlotId(slotId, intent);
      console.info('[NELIE] Regenerated', { slotId, intent });
      toast({ description: 'Aktivitet opdateret' });
    } catch (e) {
      console.error(e);
      toast({ variant: 'destructive', description: 'Kunne ikke opdatere aktiviteten' });
    } finally {
      setBusy(false);
    }
  };

  const globallyBusy = typeof isSlotBusy === 'function' && isSlotBusy(slotId);

  return (
    <div className="ml-auto flex items-center gap-2">
      <select
        value={intent || ''}
        onChange={(e) => setIntent((e.target.value || undefined) as any)}
        className="text-[11px] bg-transparent border border-white/30 rounded px-1 py-0.5"
        title="Regenerate intent (dev)"
      >
        <option value="">intent</option>
        <option value="harder">harder</option>
        <option value="easier">easier</option>
        <option value="changeKind">change kind</option>
      </select>
      <button
        className="text-[11px] underline opacity-80 hover:opacity-100 disabled:opacity-50"
        onClick={handleClick}
        disabled={busy || globallyBusy}
        title="Regenerate this activity (dev-only)"
      >
        {busy || globallyBusy ? '…' : 'Regenerate (dev)'}
      </button>
    </div>
  );
}

