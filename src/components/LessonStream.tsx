"use client";

import { useAIStream } from "@/hooks/useAIStream";
import { useMemo } from "react";

export default function LessonStream() {
  const { status, chunks } = useAIStream({
    mode: "daily",
    subject: "mathematics",
    gradeLevel: 3,
    curriculum: "DK",
  });

  const parsed = useMemo(() => {
    try {
      return JSON.parse(chunks.replace(/event:\s?\w+\n?data:\s?/g, "").trim());
    } catch {
      return null;
    }
  }, [chunks]);

  return (
    <div className="p-4 border rounded-md shadow-sm bg-background">
      <h2 className="font-bold mb-2 text-foreground">AI Lesson Generator</h2>
      <p className="text-muted-foreground">Status: {status}</p>
      {status === "loading" && <p className="text-primary">Generating lesson...</p>}
      {status === "done" && parsed && (
        <div className="mt-4 space-y-2">
          <h3 className="text-lg font-semibold text-foreground">{parsed.title}</h3>
          <p className="text-muted-foreground">Duration: {parsed.durationMinutes} min</p>
          <div>
            <h4 className="font-medium text-foreground mb-1">Objectives:</h4>
            <ul className="list-disc ml-5 space-y-1">
              {parsed.objectives?.map((o: string, i: number) => (
                <li key={i} className="text-muted-foreground">{o}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
      {status === "error" && <p className="text-destructive">Error loading lesson</p>}
    </div>
  );
}