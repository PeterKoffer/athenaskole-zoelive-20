
import { CurriculumNode, CurriculumNodeFilters } from '@/types/curriculum/index';
import { mockCurriculumData } from '@/data/mockCurriculumData';
import { CurriculumService } from './types';

class MockCurriculumServiceImpl implements CurriculumService {
  private data: CurriculumNode[] = mockCurriculumData;

  async getNodes(filters?: CurriculumNodeFilters): Promise<CurriculumNode[]> {
    if (!filters || Object.keys(filters).length === 0) {
      return [...this.data];
    }

    return this.data.filter(node => {
      let match = true;

      if (filters.parentId !== undefined) { // Handles null for root or specific parentId
        match = match && node.parentId === filters.parentId;
      }
      if (filters.nodeType) {
        const types = Array.isArray(filters.nodeType) ? filters.nodeType : [filters.nodeType];
        match = match && types.includes(node.nodeType);
      }
      if (filters.countryCode) {
        match = match && node.countryCode === filters.countryCode;
      }
      if (filters.languageCode) {
        match = match && node.languageCode === filters.languageCode;
      }
      if (filters.regionCode) {
        match = match && node.regionCode === filters.regionCode;
      }
      if (filters.educationalLevel) {
        const levels = Array.isArray(filters.educationalLevel) ? filters.educationalLevel : [filters.educationalLevel];
        match = match && node.educationalLevel !== undefined && levels.includes(node.educationalLevel);
      }
      if (filters.subjectName) {
         const subjects = Array.isArray(filters.subjectName) ? filters.subjectName : [filters.subjectName];
        match = match && node.subjectName !== undefined && subjects.includes(node.subjectName);
      }
      if (filters.tags && node.tags) {
        match = match && filters.tags.some(tag => node.tags?.includes(tag));
      }
      if (filters.nameContains && node.name) {
        match = match && node.name.toLowerCase().includes(filters.nameContains.toLowerCase());
      }
      return match;
    });
  }

  async getNodeById(id: string): Promise<CurriculumNode | undefined> {
    return this.data.find(node => node.id === id);
  }

  async getChildren(parentId: string): Promise<CurriculumNode[]> {
    return this.data.filter(node => node.parentId === parentId);
  }

  async getDescendants(parentId: string): Promise<CurriculumNode[]> {
    const results: CurriculumNode[] = [];
    const queue: string[] = [parentId];
    const visited: Set<string> = new Set(); // To handle potential circular dependencies if data is bad

    while (queue.length > 0) {
      const currentParentId = queue.shift()!;
      if (visited.has(currentParentId) && currentParentId !== parentId) continue; // Avoid re-processing for non-root, already visited
      visited.add(currentParentId);

      const children = await this.getChildren(currentParentId);
      for (const child of children) {
        results.push(child);
        queue.push(child.id);
      }
    }
    return results;
  }
}

export const mockCurriculumService = new MockCurriculumServiceImpl();
export default mockCurriculumService;
