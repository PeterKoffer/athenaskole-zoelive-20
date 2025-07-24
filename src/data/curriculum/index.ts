
import type { UnifiedCurriculumNode } from '@/types/curriculum';
import { NELIESubject } from '@/types/curriculum/NELIESubjects';

// Mock curriculum data - in a real app this would come from your API/database
export const mockCurriculumData: UnifiedCurriculumNode[] = [
  {
    id: 'us-root',
    parentId: null,
    name: 'United States Education System',
    nodeType: 'country',
    countryCode: 'US',
    educationalLevel: 'K-12',
    subject: NELIESubject.MATH,
    subjectName: 'Mathematics',
    children: []
  }
];

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
