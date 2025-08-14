export type Beat =
  | { type: "introduction"; title: string; content: string; duration: number }
  | { type: "exploration"; title: string; content: string; duration: number }
  | { type: "practice"; title: string; content: string; duration: number }
  | { type: "reflection"; title: string; content: string; duration: number };

export function beatToActivities(beats: Beat[], opts: {
  subject: string;
  gradeBand: "K-2"|"3-5"|"6-8"|"9-10"|"11-12";
  minutes: number;
}) {
  const out: any[] = [];
  for (const b of beats) {
    if (b.type === "introduction") {
      out.push({
        id: crypto.randomUUID(),
        kind: "read",
        title: b.title,
        body: b.content,
        estimatedMinutes: Math.max(5, Math.min(15, b.duration ?? 10))
      });
    }
    if (b.type === "exploration") {
      // Hands-on task aligned to subject
      out.push({
        id: crypto.randomUUID(),
        kind: "task",
        title: b.title,
        instructions: b.content,
        deliverable: { type: "photo_or_doc" },
        estimatedMinutes: Math.max(20, Math.min(60, b.duration ?? 40)),
        tags: ["apply","hands-on", opts.subject]
      });
    }
    if (b.type === "practice") {
      // Quick problem set / quiz stub the student renderer already supports
      out.push({
        id: crypto.randomUUID(),
        kind: "mcq",
        title: b.title,
        stem: b.content,
        options: [
          { key: "A", text: "Option A" },
          { key: "B", text: "Option B" },
          { key: "C", text: "Option C" },
          { key: "D", text: "Option D" }
        ],
        correctKey: "A",
        explanation: "Explanation will be AI-embellished in hybrid/ai mode.",
        estimatedMinutes: Math.max(10, Math.min(30, b.duration ?? 20)),
        tags: ["practice", opts.subject]
      });
    }
    if (b.type === "reflection") {
      out.push({
        id: crypto.randomUUID(),
        kind: "journal",
        title: b.title,
        prompt: b.content,
        estimatedMinutes: Math.max(5, Math.min(20, b.duration ?? 10)),
        tags: ["reflection"]
      });
    }
  }
  return out;
}