export type GradeBand = 'K-2' | '3-5' | '6-8' | '9-10' | '11-12';

export function gradeToBand(grade?: number): GradeBand {
  if (grade == null) return '6-8';
  if (grade <= 2) return 'K-2';
  if (grade <= 5) return '3-5';
  if (grade <= 8) return '6-8';
  if (grade <= 10) return '9-10';
  return '11-12';
}