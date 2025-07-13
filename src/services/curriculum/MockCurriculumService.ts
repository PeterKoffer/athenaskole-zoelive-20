
import { CurriculumNode, CurriculumNodeFilters } from '@/types/curriculum/index';
import { ICurriculumService } from './types';
import { mockCurriculumData } from '@/data/mockCurriculumData';

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

  async getChildren(parentId: string): Promise<CurriculumNode[]> {
    return this.data.filter(node => node.parentId === parentId);
  }

  async getChildrenOfNode(parentId: string): Promise<CurriculumNode[]> {
    return this.getChildren(parentId);
  }

  async getDescendants(parentId: string): Promise<CurriculumNode[]> {
    const results: CurriculumNode[] = [];
    const queue: string[] = [parentId];
    const visited: Set<string> = new Set();

    while (queue.length > 0) {
      const currentParentId = queue.shift()!;
      
      if (visited.has(currentParentId) && currentParentId !== parentId) {
        continue;
      }
      visited.add(currentParentId);

      const children = await this.getChildren(currentParentId);
      for (const child of children) {
        results.push(child);
        queue.push(child.id);
      }
    }

    return results;
  }

  async generateAIContextForNode(nodeId: string): Promise<string> {
    const node = await this.getNodeById(nodeId);
    if (!node) {
      return `Node with ID ${nodeId} not found.`;
    }

    let context = `**${node.nodeType.toUpperCase()}: ${node.name}**\n`;
    
    if (node.description) {
      context += `Description: ${node.description}\n`;
    }

    if (node.countryCode) {
      context += `Country: ${node.countryCode}\n`;
    }

    if (node.educationalLevel) {
      context += `Grade Level: ${node.educationalLevel}\n`;
    }

    if (node.subjectName) {
      context += `Subject: ${node.subjectName}\n`;
    }

    return context.trim();
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
      if (filters.subject) {
        const subjectsToFilter = Array.isArray(filters.subject) ? filters.subject : [filters.subject];
        if (!node.subject || !subjectsToFilter.includes(node.subject)) {
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

      return match;
    });
  }
}
