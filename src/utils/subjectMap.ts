
export function canonicalizeSubject(theme?: string): string {
  const t = (theme ?? '').toLowerCase();
  const map: Record<string, string> = {
    adventure: 'Science',
    exploration: 'Geography',
    detective: 'Language Arts',
    coding: 'Computer Science',
    wellness: 'Mental Wellness',
    art: 'Creative Arts',
    music: 'Music',
  };
  return map[t] ?? 'Science';
}
