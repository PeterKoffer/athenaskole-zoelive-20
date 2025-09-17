// Simple similarity check to avoid generating too similar prompts

export function isTooSimilar(prompt: string, recentPrompts: string[], threshold: number = 0.7): boolean {
  const words1 = new Set(prompt.toLowerCase().split(/\s+/));
  
  for (const recent of recentPrompts) {
    const words2 = new Set(recent.toLowerCase().split(/\s+/));
    const intersection = new Set([...words1].filter(x => words2.has(x)));
    const union = new Set([...words1, ...words2]);
    const similarity = intersection.size / union.size;
    
    if (similarity > threshold) {
      return true;
    }
  }
  
  return false;
}