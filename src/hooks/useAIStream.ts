import { useEffect, useState } from "react";

type StreamStatus = "idle" | "loading" | "error" | "done" | "timeout";

function extractFinalJsonFromStream(raw: string) {
  // Fjerner evt. "event: chunk\ndata:" præfikser
  const cleaned = raw
    .split('\n')
    .filter(l => l.startsWith('data:'))
    .map(l => l.replace(/^data:\s?/, ''))
    .join('');

  try {
    return JSON.parse(cleaned);
  } catch {
    // fallback: find første og sidste { }
    const first = cleaned.indexOf('{');
    const last = cleaned.lastIndexOf('}');
    if (first >= 0 && last > first) {
      return JSON.parse(cleaned.slice(first, last + 1));
    }
    throw new Error("Could not parse JSON from stream");
  }
}

export function useAIStream(request: Record<string, any>) {
  const [status, setStatus] = useState<StreamStatus>("idle");
  const [chunks, setChunks] = useState<string>("");
  const [parsedData, setParsedData] = useState<any>(null);

  useEffect(() => {
    if (!request) return;
    setStatus("loading");
    setChunks("");
    setParsedData(null);

    const controller = new AbortController();
    const url = `https://yphkfkpfdpdmllotpqua.supabase.co/functions/v1/ai-stream`;
    
    // Timeout efter 12 sekunder
    const timeoutId = setTimeout(() => {
      controller.abort();
      setStatus("timeout");
    }, 12000);

    (async () => {
      try {
        console.log("[useAIStream] Starting request:", request);
        
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
        let fullContent = "";

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          
          const chunk = decoder.decode(value);
          fullContent += chunk;
          setChunks(fullContent);
        }

        clearTimeout(timeoutId);
        
        // Parse når stream er færdig
        try {
          const parsed = extractFinalJsonFromStream(fullContent);
          setParsedData(parsed);
          setStatus("done");
          console.log("[useAIStream] Successfully parsed:", parsed);
        } catch (parseError) {
          console.error("[useAIStream] Parse error:", parseError);
          setStatus("error");
        }
        
      } catch (err) {
        clearTimeout(timeoutId);
        console.error("[useAIStream] Stream error:", err);
        setStatus("error");
      }
    })();

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [JSON.stringify(request)]);

  return { status, chunks, parsedData };
}