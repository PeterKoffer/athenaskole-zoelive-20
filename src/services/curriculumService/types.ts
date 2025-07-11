
import { CurriculumNode, CurriculumNodeFilters } from '@/types/curriculum/index';

export interface ICurriculumService { // Renamed to ICurriculumService
  /**
   * Retrieves curriculum nodes based on the provided filters.
   * @param filters - Optional filters to apply.
   * @returns A promise that resolves to an array of matching curriculum nodes.
   */
  getNodes(filters?: CurriculumNodeFilters): Promise<CurriculumNode[]>;

  /**
   * Retrieves a specific curriculum node by its unique ID.
   * @param id - The unique ID of the curriculum node.
   * @returns A promise that resolves to the curriculum node if found, otherwise undefined.
   */
  getNodeById(id: string): Promise<CurriculumNode | undefined>;

  /**
   * Retrieves all children of a given parent node.
   * @param parentId - The ID of the parent node.
   * @returns A promise that resolves to an array of child curriculum nodes.
   */
  getChildren(parentId: string): Promise<CurriculumNode[]>;

  /**
   * Retrieves all descendants of a given parent node.
   * @param parentId - The ID of the parent node.
   * @returns A promise that resolves to an array of all descendant curriculum nodes.
   */
  getDescendants(parentId: string): Promise<CurriculumNode[]>;

  /**
   * Generates a string context for a given curriculum node, intended for AI prompt enrichment.
   * @param nodeId The unique ID of the curriculum node.
   * @returns A promise that resolves to a string containing AI context, or null if node not found.
   */
  generateAIContextForNode(nodeId: string): Promise<string | null>;
}
