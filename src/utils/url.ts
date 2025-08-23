// Safe URL parameter utilities

export function withParam(url: string, key: string, value: string | number): string {
  const u = new URL(url);
  u.searchParams.set(key, String(value));
  return u.toString();
}

export function addCacheBuster(url: string): string {
  return withParam(url, 'v', Date.now());
}