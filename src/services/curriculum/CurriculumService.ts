
import { CurriculumNode, CurriculumNodeFilters } from '@/types/curriculum/index';
import { mockCurriculumData } from '@/data/mockCurriculumData';

export interface ICurriculumService {
  /**
   * Retrieves a curriculum node by its unique identifier.
   */
  getNodeById(id: string): Promise<CurriculumNode | undefined>;

  /**
   * Retrieves curriculum nodes that match the provided filters.
   */
  getNodes(filters?: CurriculumNodeFilters): Promise<CurriculumNode[]>;

  /**
   * Retrieves all direct children of a given curriculum node.
   */
  getChildren(parentId: string): Promise<CurriculumNode[]>;

  /**
   * Retrieves all descendants of a given curriculum node.
   */
  getDescendants(parentId: string): Promise<CurriculumNode[]>;

  /**
   * Generates AI context for a specific curriculum node.
   */
  generateAIContextForNode(nodeId: string): Promise<string>;
}

export class CurriculumService implements ICurriculumService {
  private data: CurriculumNode[];

  constructor() {
    // Deep clone to prevent accidental modification of source data
    this.data = JSON.parse(JSON.stringify(mockCurriculumData));
  }

  async getNodeById(id: string): Promise<CurriculumNode | undefined> {
    return this.data.find(node => node.id === id);
  }

  async getNodes(filters?: CurriculumNodeFilters): Promise<CurriculumNode[]> {
    if (!filters || Object.keys(filters).length === 0) {
      return [...this.data];
    }

    return this.data.filter(node => {
      let match = true;

      // Handle parentId filter (including null for root nodes)
      if (filters.parentId !== undefined) {
        match = match && node.parentId === filters.parentId;
      }

      // Handle nodeType filter (single or array)
      if (filters.nodeType) {
        const types = Array.isArray(filters.nodeType) ? filters.nodeType : [filters.nodeType];
        match = match && types.includes(node.nodeType);
      }

      // Handle country/region/language filters
      if (filters.countryCode) {
        match = match && node.countryCode === filters.countryCode;
      }
      if (filters.languageCode) {
        match = match && node.languageCode === filters.languageCode;
      }
      if (filters.regionCode) {
        match = match && node.regionCode === filters.regionCode;
      }

      // Handle educational level filter (single or array)
      if (filters.educationalLevel) {
        const levels = Array.isArray(filters.educationalLevel) ? filters.educationalLevel : [filters.educationalLevel];
        match = match && node.educationalLevel !== undefined && levels.includes(node.educationalLevel);
      }

      // Handle subject name filter (single or array)
      if (filters.subjectName) {
        const subjects = Array.isArray(filters.subjectName) ? filters.subjectName : [filters.subjectName];
        match = match && node.subjectName !== undefined && subjects.includes(node.subjectName);
      }

      // Handle tags filter (match any)
      if (filters.tags && filters.tags.length > 0) {
        match = match && node.tags && filters.tags.some(tag => node.tags!.includes(tag));
      }

      // Handle name contains filter (case-insensitive)
      if (filters.nameContains) {
        match = match && node.name && node.name.toLowerCase().includes(filters.nameContains.toLowerCase());
      }

      // Handle subject-specific filters
      if (filters.subjectSpecificFilters && node.subjectSpecific) {
        for (const [key, value] of Object.entries(filters.subjectSpecificFilters)) {
          const nodeValue = node.subjectSpecific[key as keyof typeof node.subjectSpecific];
          if (nodeValue !== value) {
            match = false;
            break;
          }
        }
      }

      // Handle accessibility filters
      if (filters.hasAccessibilitySupport && filters.hasAccessibilitySupport.length > 0) {
        match = match && node.accessibilityConsiderations && 
          filters.hasAccessibilitySupport.some(support => 
            node.accessibilityConsiderations!.includes(support)
          );
      }

      // Handle assessment type filter
      if (filters.assessmentType) {
        match = match && node.assessmentTypes && 
          node.assessmentTypes.includes(filters.assessmentType as any);
      }

      // Handle max duration filter
      if (filters.maxDuration && node.estimatedDuration) {
        match = match && node.estimatedDuration <= filters.maxDuration;
      }

      // Handle teaching method filter
      if (filters.teachingMethod) {
        match = match && node.preferredTeachingMethods && 
          node.preferredTeachingMethods.includes(filters.teachingMethod);
      }

      return match;
    });
  }

  async getChildren(parentId: string): Promise<CurriculumNode[]> {
    return this.data.filter(node => node.parentId === parentId);
  }

  async getDescendants(parentId: string): Promise<CurriculumNode[]> {
    const results: CurriculumNode[] = [];
    const queue: string[] = [parentId];
    const visited: Set<string> = new Set();

    while (queue.length > 0) {
      const currentParentId = queue.shift()!;
      
      // Avoid infinite loops with circular dependencies
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

    // Get parent context
    const parent = node.parentId ? await this.getNodeById(node.parentId) : null;
    const children = await this.getChildren(nodeId);

    let context = `**${node.nodeType.toUpperCase()}: ${node.name}**\n`;
    
    if (node.description) {
      context += `Description: ${node.description}\n`;
    }

    if (parent) {
      context += `Parent: ${parent.name} (${parent.nodeType})\n`;
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

    if (node.estimatedDuration) {
      context += `Estimated Duration: ${node.estimatedDuration} minutes\n`;
    }

    if (node.tags && node.tags.length > 0) {
      context += `Tags: ${node.tags.join(', ')}\n`;
    }

    if (node.prerequisites && node.prerequisites.length > 0) {
      context += `Prerequisites: ${node.prerequisites.join(', ')}\n`;
    }

    if (children.length > 0) {
      context += `Children: ${children.map(c => c.name).join(', ')}\n`;
    }

    if (node.subjectSpecific) {
      context += `Subject-Specific Details: ${JSON.stringify(node.subjectSpecific, null, 2)}\n`;
    }

    return context.trim();
  }

  /**
   * Get the full path from root to a specific node
   */
  async getNodePath(nodeId: string): Promise<CurriculumNode[]> {
    const path: CurriculumNode[] = [];
    let currentNode = await this.getNodeById(nodeId);

    while (currentNode) {
      path.unshift(currentNode);
      currentNode = currentNode.parentId ? await this.getNodeById(currentNode.parentId) : null;
    }

    return path;
  }

  /**
   * Get curriculum statistics
   */
  async getStats(): Promise<{
    totalNodes: number;
    nodesByType: Record<string, number>;
    nodesByCountry: Record<string, number>;
    nodesBySubject: Record<string, number>;
  }> {
    const nodesByType: Record<string, number> = {};
    const nodesByCountry: Record<string, number> = {};
    const nodesBySubject: Record<string, number> = {};

    for (const node of this.data) {
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
      totalNodes: this.data.length,
      nodesByType,
      nodesByCountry,
      nodesBySubject
    };
  }
}

// Export singleton instance
export const curriculumService = new CurriculumService();
export default curriculumService;
