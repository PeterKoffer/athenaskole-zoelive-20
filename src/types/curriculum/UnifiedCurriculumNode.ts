import { CurriculumNode } from './CurriculumNode';

export interface UnifiedCurriculumNode extends CurriculumNode {
  children?: UnifiedCurriculumNode[];
}
