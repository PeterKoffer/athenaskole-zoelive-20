export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

export function withCors(req: Request, res: Response) {
  const origin = req.headers.get('Origin') ?? '*';
  const headers = {
    'Access-Control-Allow-Origin': origin,
    'Vary': 'Origin',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };
  const merged = new Headers(res.headers);
  for (const [k, v] of Object.entries(headers)) {
    merged.set(k, v as string);
  }
  return new Response(res.body, { status: res.status, headers: merged });
}

export function okCors(req: Request) {
  return withCors(req, new Response('ok', { status: 200 }));
}

export function json(req: Request, data: unknown, init?: ResponseInit) {
  return withCors(req, new Response(JSON.stringify(data), {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
  }));
}