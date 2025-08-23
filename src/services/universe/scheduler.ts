export function pickStandardsForToday(
  allStandards: string[], 
  mastery: Record<string, number>,
  maxCount: number = 3
): string[] {
  if (!allStandards.length) return [];
  
  // Sort by mastery level (lowest first) and take the top ones
  return [...allStandards]
    .sort((a, b) => (mastery[a] ?? 0) - (mastery[b] ?? 0))
    .slice(0, Math.min(maxCount, allStandards.length));
}

export function calculateEngagementSignals(
  interestSignals: Array<{tag: string, weight: number, source: string}>
): Array<{tag: string, delta: number}> {
  
  // Group signals by tag and sum weights
  const tagSums: Record<string, number> = {};
  
  interestSignals.forEach(signal => {
    if (!tagSums[signal.tag]) {
      tagSums[signal.tag] = 0;
    }
    tagSums[signal.tag] += signal.weight;
  });
  
  // Convert to delta format, normalizing to -1 to +1 range
  return Object.entries(tagSums).map(([tag, sum]) => ({
    tag,
    delta: Math.max(-1, Math.min(1, sum / 10)) // Scale down large values
  }));
}

export function blendCurriculumWithInterests(
  curriculumStandards: string[],
  userInterests: string[],
  curriculumWeight: number = 0.7 // 70% curriculum, 30% interests
): { standards: string[], interests: string[] } {
  
  const maxStandards = Math.max(1, Math.floor(4 * curriculumWeight));
  const maxInterests = Math.max(1, Math.floor(4 * (1 - curriculumWeight)));
  
  return {
    standards: curriculumStandards.slice(0, maxStandards),
    interests: userInterests.slice(0, maxInterests)
  };
}