// @ts-nocheck

import { CurriculumNode } from '@/types/curriculum/index';

export abstract class CurriculumServiceBase {
  protected data: CurriculumNode[];

  constructor(data: CurriculumNode[]) {
    // Deep clone to prevent accidental modification of source data
    this.data = JSON.parse(JSON.stringify(data));
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
}
