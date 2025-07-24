"use client";

import { useAIStream } from "@/hooks/useAIStream";

export default function LessonStream() {
  const { status, chunks, parsedData } = useAIStream({
    mode: "daily",
    subject: "mathematics",
    gradeLevel: 3,
    curriculum: "DK",
  });

  return (
    <div className="p-4 border rounded-md shadow-sm bg-background">
      <h2 className="font-bold mb-2 text-foreground">AI Lesson Generator</h2>
      <p className="text-muted-foreground">Status: {status}</p>
      
      {status === "loading" && (
        <div className="mt-2">
          <p className="text-primary">Generating lesson...</p>
          <div className="text-xs text-muted-foreground max-h-32 overflow-y-auto">
            Raw stream: {chunks.slice(-200)}...
          </div>
        </div>
      )}
      
      {status === "timeout" && (
        <p className="text-orange-500">Request timed out after 12 seconds</p>
      )}
      
      {status === "done" && parsedData && (
        <div className="mt-4 space-y-2">
          <h3 className="text-lg font-semibold text-foreground">{parsedData.title}</h3>
          <p className="text-muted-foreground">Duration: {parsedData.durationMinutes} min</p>
          <div>
            <h4 className="font-medium text-foreground mb-1">Objectives:</h4>
            <ul className="list-disc ml-5 space-y-1">
              {parsedData.objectives?.map((o: string, i: number) => (
                <li key={i} className="text-muted-foreground">{o}</li>
              ))}
            </ul>
          </div>
          {parsedData.activities && (
            <div>
              <h4 className="font-medium text-foreground mb-1">Activities ({parsedData.activities.length}):</h4>
              <div className="text-sm text-muted-foreground">
                {parsedData.activities.slice(0, 3).map((a: any, i: number) => (
                  <div key={i}>• {a.type} ({a.timebox}min)</div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      
      {status === "error" && (
        <div className="mt-2">
          <p className="text-destructive">Error loading lesson</p>
          <div className="text-xs text-muted-foreground">
            Raw chunks: {chunks.slice(0, 200)}...
          </div>
        </div>
      )}
    </div>
  );
}