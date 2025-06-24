
import { LucideIcon } from 'lucide-react';

export interface Subject {
  title: string;
  description: string;
  path: string;
  keyAreas?: string[];
  icon?: string;
}

export interface SubjectCardProps {
  subject: Subject;
  index: number;
  onStartLearning: (path: string) => void;
}

export interface SubjectCardIconProps {
  subject: Subject;
  isHovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export interface SubjectCardTooltipProps {
  subject: Subject;
  isVisible: boolean;
}

export interface SubjectCardButtonProps {
  subject: Subject;
  onClick: () => void;
}

export interface IconMapping {
  [key: string]: LucideIcon;
}

export interface GradientMapping {
  [key: string]: string;
}
