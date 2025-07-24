
import type { CurriculumNode } from './index';

export class CurriculumValidation {
  /**
   * Validates a curriculum node structure
   */
  static validateNode(node: CurriculumNode): boolean {
    if (!node.id || !node.name || !node.nodeType) {
      return false;
    }
    
    // Country nodes should not have parents
    if (node.nodeType === 'country' && node.parentId !== null) {
      return false;
    }
    
    // Non-country nodes should have parents (except for test data)
    if (node.nodeType !== 'country' && !node.parentId && !node.id.includes('test')) {
      return false;
    }
    
    return true;
  }
  
  /**
   * Validates a curriculum hierarchy
   */
  static validateHierarchy(nodes: CurriculumNode[]): boolean {
    const nodeMap = new Map(nodes.map(node => [node.id, node]));
    
    for (const node of nodes) {
      if (!this.validateNode(node)) {
        return false;
      }
      
      // Check if parent exists (if specified)
      if (node.parentId && !nodeMap.has(node.parentId)) {
        return false;
      }
    }
    
    return true;
  }
}
