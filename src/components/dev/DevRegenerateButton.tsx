import { useState } from 'react';
import { useUnifiedLesson } from '@/components/education/contexts/UnifiedLessonContext';
import { useToast } from '@/hooks/use-toast';

export default function DevRegenerateButton({ slotId }: { slotId: string }) {
  const { regenerateActivityBySlotId } = useUnifiedLesson() as any;
  const { toast } = useToast();
  const [busy, setBusy] = useState(false);

  if (!regenerateActivityBySlotId) return null;

  const handleClick = async () => {
    try {
      if (busy) return;
      setBusy(true);
      await regenerateActivityBySlotId(slotId);
      console.info('[NELIE] Regenerated', { slotId });
      toast({ description: 'Aktivitet opdateret' });
    } catch (e) {
      console.error(e);
      toast({ variant: 'destructive', description: 'Kunne ikke opdatere aktiviteten' });
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      className="ml-auto text-[11px] underline opacity-80 hover:opacity-100 disabled:opacity-50"
      onClick={handleClick}
      disabled={busy}
      title="Regenerate this activity (dev-only)"
    >
      {busy ? '…' : 'Regenerate (dev)'}
    </button>
  );
}

