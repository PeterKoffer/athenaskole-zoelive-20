import { UnifiedCurriculumNode } from '@/types/curriculum/UnifiedCurriculumNode';
import { NELIESubject } from '@/types/curriculum/NELIESubjects';
import unifiedCurriculum from '../../../public/data/unified-curriculum.json';

export const mockCurriculumData: UnifiedCurriculumNode[] = unifiedCurriculum;

// Helper function to flatten the nested structure
const flattenNodes = (nodes: UnifiedCurriculumNode[]): UnifiedCurriculumNode[] => {
  const flattened: UnifiedCurriculumNode[] = [];
  const traverse = (node: UnifiedCurriculumNode) => {
    flattened.push(node);
    if (node.children) {
      node.children.forEach(traverse);
    }
  };
  nodes.forEach(traverse);
  return flattened;
};

const allNodes = flattenNodes(mockCurriculumData);

export const getCurriculumByCountry = (countryCode: string): UnifiedCurriculumNode[] => {
  return allNodes.filter(node => node.countryCode === countryCode);
};

export const getCurriculumBySubject = (subject: NELIESubject): UnifiedCurriculumNode[] => {
  return allNodes.filter(node => node.subject === subject);
};

export const getCurriculumByGrade = (educationalLevel: string): UnifiedCurriculumNode[] => {
  return allNodes.filter(node => node.educationalLevel === educationalLevel);
};
