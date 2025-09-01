export const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
} as const;

export function json(body: unknown, init: ResponseInit = {}) {
  return new Response(JSON.stringify(body), {
    ...init,
    headers: { "content-type": "application/json", ...CORS, ...(init.headers ?? {}) },
  });
}
export function bad(msg: string, code = 400) {
  return json({ ok:false, error: msg }, { status: code });
}
export function ok(data: unknown) {
  return json({ ok:true, data });
}
export function handleOptions(req: Request) {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS, status: 204 });
}