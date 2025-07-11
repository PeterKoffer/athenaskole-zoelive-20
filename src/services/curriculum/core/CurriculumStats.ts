
import { CurriculumNode } from '@/types/curriculum/index';

export class CurriculumStats {
  static generateStats(nodes: CurriculumNode[]) {
    const nodesByType: Record<string, number> = {};
    const nodesByCountry: Record<string, number> = {};
    const nodesBySubject: Record<string, number> = {};

    for (const node of nodes) {
      // Count by type
      nodesByType[node.nodeType] = (nodesByType[node.nodeType] || 0) + 1;

      // Count by country
      if (node.countryCode) {
        nodesByCountry[node.countryCode] = (nodesByCountry[node.countryCode] || 0) + 1;
      }

      // Count by subject
      if (node.subjectName) {
        nodesBySubject[node.subjectName] = (nodesBySubject[node.subjectName] || 0) + 1;
      }
    }

    return {
      totalNodes: nodes.length,
      nodesByType,
      nodesByCountry,
      nodesBySubject
    };
  }
}
