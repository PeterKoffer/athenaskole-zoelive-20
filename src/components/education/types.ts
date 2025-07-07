
export interface AdaptiveEducationSessionProps {
  subject: string;
  skillArea: string;
  studentName?: string;
  onComplete: () => void;
  onBack: () => void;
}
