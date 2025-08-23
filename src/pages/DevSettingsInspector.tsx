// src/pages/DevSettingsInspector.tsx
import { useEffect, useState } from "react";
import { hydrateSettings, resolveEffective } from "@/services/settings";

export default function DevSettingsInspector({ ctx }: { ctx: any }) {
  const [bag, setBag] = useState<any>(null);
  useEffect(() => { (async () => setBag(await hydrateSettings(ctx)))(); }, [JSON.stringify(ctx)]);
  if (!bag) return <div>Loading…</div>;
  const keys = [
    "school.educational_direction",
    "school.curriculum_country",
    "class.timezone",
    "teacher.lesson_duration_hours",
    "teacher.subject_weights"
  ];
  return (
    <div className="p-4 text-sm">
      <h2 className="font-semibold mb-2">Settings (effective)</h2>
      <ul className="space-y-1">
        {keys.map(k => (
          <li key={k}>
            <code>{k}</code>:{" "}
            <pre className="inline">{JSON.stringify(resolveEffective(k as any, ctx, bag))}</pre>
          </li>
        ))}
      </ul>
      <h3 className="font-semibold mt-4">Raw Bag</h3>
      <pre className="text-xs bg-black/10 p-2 rounded">{JSON.stringify(bag, null, 2)}</pre>
    </div>
  );
}