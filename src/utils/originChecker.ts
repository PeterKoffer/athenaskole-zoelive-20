export const allowedOrigins = [
  'https://lovable.dev',
  'https://gptengineer.app',
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:8080',
  'https://*.google.com',
  'https://*.ai.google.dev',
  'https://bard.google.com',
  'https://gemini.google.com',
];

export function isOriginAllowed(origin: string): boolean {
  if (window.location.origin === origin) {
    return true;
  }
  return allowedOrigins.some(allowedOrigin => {
    if (allowedOrigin.startsWith('*.')) {
      const domain = allowedOrigin.substring(2);
      return origin.endsWith(domain);
    }
    return origin === allowedOrigin;
  });
}
