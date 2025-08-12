import { useUnifiedLesson } from '@/components/education/contexts/UnifiedLessonContext';

export default function DevRegenerateButton({ slotId }: { slotId: string }) {
  const { regenerateActivityBySlotId } = useUnifiedLesson() as any;

  if (!regenerateActivityBySlotId) return null;

  return (
    <button
      className="ml-auto text-[11px] underline opacity-80 hover:opacity-100"
      onClick={() => regenerateActivityBySlotId(slotId)}
      title="Regenerate this activity (dev-only)"
    >
      Regenerate (dev)
    </button>
  );
}
