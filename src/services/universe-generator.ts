// Simple universe generator (stub)
// @ts-nocheck

export default function generateUniverse(subjects: any[], weights: Record<string, number>) {
  const weightedSubjects: any[] = [];
  for (const subject of subjects) {
    const weight = (weights && weights[subject.id]) || 5;
    for (let i = 0; i < weight; i++) {
      weightedSubjects.push(subject);
    }
  }

  for (let i = weightedSubjects.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [weightedSubjects[i], weightedSubjects[j]] = [weightedSubjects[j], weightedSubjects[i]];
  }

  const selectedSubjects: any[] = [];
  const numSubjects = Math.min(weightedSubjects.length, Math.floor(Math.random() * 3) + 3);
  for (let i = 0; i < numSubjects; i++) {
    selectedSubjects.push(weightedSubjects[i]);
  }

  return {
    title: 'A New Universe',
    description: 'This is a new universe generated based on your preferences.',
    subjects: selectedSubjects,
  };
}
