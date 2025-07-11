import { CurriculumNode, CurriculumNodeFilters } from '../../types/curriculum'; // Adjusted path
import { ICurriculumService } from './types';
import { mockCurriculumData } from '../../data/mockCurriculumData'; // Adjusted path

export class MockCurriculumService implements ICurriculumService {
  private data: CurriculumNode[];

  constructor() {
    // In a real scenario, data might be fetched or initialized differently.
    // For mock, we can deep clone to prevent accidental modification of the source mock data during filtering.
    this.data = JSON.parse(JSON.stringify(mockCurriculumData));
  }

  async getNodeById(id: string): Promise<CurriculumNode | undefined> {
    return this.data.find(node => node.id === id);
  }

  async getChildrenOfNode(parentId: string): Promise<CurriculumNode[]> {
    return this.data.filter(node => node.parentId === parentId);
  }

  async getNodes(filters: CurriculumNodeFilters): Promise<CurriculumNode[]> {
    return this.data.filter(node => {
      let match = true;

      if (filters.parentId !== undefined && node.parentId !== filters.parentId) {
        match = false;
      }
      if (filters.nodeType) {
        const typesToFilter = Array.isArray(filters.nodeType) ? filters.nodeType : [filters.nodeType];
        if (!typesToFilter.includes(node.nodeType)) {
          match = false;
        }
      }
      if (filters.countryCode && node.countryCode !== filters.countryCode) {
        match = false;
      }
      if (filters.languageCode && node.languageCode !== filters.languageCode) {
        match = false;
      }
      if (filters.regionCode && node.regionCode !== filters.regionCode) {
        match = false;
      }
      if (filters.educationalLevel) {
        const levelsToFilter = Array.isArray(filters.educationalLevel) ? filters.educationalLevel : [filters.educationalLevel];
        if (!node.educationalLevel || !levelsToFilter.includes(node.educationalLevel)) {
          match = false;
        }
      }
      if (filters.subjectName) {
        const subjectsToFilter = Array.isArray(filters.subjectName) ? filters.subjectName : [filters.subjectName];
        if (!node.subjectName || !subjectsToFilter.includes(node.subjectName)) { // Assuming subjectName is on CurriculumNode based on schema
          match = false;
        }
      }
      if (filters.tags && filters.tags.length > 0) {
        if (!node.tags || !filters.tags.some(tag => node.tags!.includes(tag))) {
          match = false;
        }
      }
      if (filters.nameContains && (!node.name || !node.name.toLowerCase().includes(filters.nameContains.toLowerCase()))) {
        match = false;
      }

      // Basic subjectSpecificFilters check - can be expanded for more complex logic
      if (filters.subjectSpecificFilters) {
        if (!node.subjectSpecific) {
          match = false;
        } else {
          for (const key in filters.subjectSpecificFilters) {
            const filterValue = filters.subjectSpecificFilters[key as keyof typeof filters.subjectSpecificFilters];
            const nodeValue = node.subjectSpecific[key as keyof typeof node.subjectSpecific];
            if (nodeValue !== filterValue) {
              match = false;
              break;
            }
          }
        }
      }

      // Add other filter conditions from CurriculumNodeFilters as needed

      return match;
    });
  }

  // Placeholder for potential future methods, can be expanded from ICurriculumService
  // async getDescendantsOfNode(parentId: string, maxDepth?: number, filters?: CurriculumNodeFilters): Promise<CurriculumNode[]> {
  //   // Implementation for fetching descendants would go here
  //   console.warn("getDescendantsOfNode not fully implemented in MockCurriculumService");
  //   return [];
  // }

  // async getNodePath(nodeId: string): Promise<CurriculumNode[]> {
  //   // Implementation for fetching node path would go here
  //   console.warn("getNodePath not fully implemented in MockCurriculumService");
  //   return [];
  // }
}
