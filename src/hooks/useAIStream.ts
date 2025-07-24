import { useEffect, useState } from "react";
import { SUPABASE_URL } from "@/integrations/supabase/client";

type StreamStatus = "idle" | "loading" | "error" | "done";

export function useAIStream(request: Record<string, any>) {
  const [status, setStatus] = useState<StreamStatus>("idle");
  const [chunks, setChunks] = useState<string>("");

  useEffect(() => {
    if (!request) return;
    setStatus("loading");
    setChunks("");

    // Brug POST til at sende request body til edge function
    const controller = new AbortController();
    const url = `${SUPABASE_URL}/functions/v1/ai-stream`;

    (async () => {
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(request),
          signal: controller.signal,
        });

        if (!response.body) {
          throw new Error("No stream from AI function");
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder("utf-8");

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value);
          setChunks((prev) => prev + chunk);
        }

        setStatus("done");
      } catch (err) {
        console.error("Stream error:", err);
        setStatus("error");
      }
    })();

    return () => controller.abort();
  }, [JSON.stringify(request)]);

  return { status, chunks };
}