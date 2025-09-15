// src/services/nelie/chat.ts
// Minimal, robust klient der kalder Supabase Edge Function `generate-content` via fetch.
// Undgår afhængighed til supabase-js her for at være helt plug-and-play.

type AskOptions = {
  subject?: string;
  context?: Record<string, any>;
};

function requireEnv(name: string): string {
  const v = (import.meta as any).env?.[name];
  if (!v) throw new Error(`Missing ${name}. Add it to .env.local`);
  return v as string;
}

function edgeBaseFromUrl(url: string): string {
  // https://XYZ.supabase.co  -> https://XYZ.functions.supabase.co
  return url.replace(".supabase.co", ".functions.supabase.co");
}

export async function askNelie(question: string, opts: AskOptions = {}): Promise<string> {
  const url = requireEnv("VITE_SUPABASE_URL");
  const anon = requireEnv("VITE_SUPABASE_ANON");
  const edgeBase = edgeBaseFromUrl(url);

  const body = {
    subject: opts.subject ?? "general",
    context: {
      source: "NELIE-floating",
      question,
      ...(opts.context ?? {}),
    },
  };

  const res = await fetch(`${edgeBase}/generate-content`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${anon}`,
      apikey: anon,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const t = await res.text().catch(() => "");
    throw new Error(`Edge error ${res.status}: ${t || res.statusText}`);
  }

  const data = await res.json().catch(() => null);
  const payload = (data && (data.data ?? data)) as any;

  const text =
    (typeof payload === "string" && payload) ||
    payload?.answer ||
    payload?.text ||
    payload?.message ||
    JSON.stringify(payload);

  return String(text);
}
