// @ts-nocheck

import { CurriculumNode, CurriculumNodeFilters } from '@/types/curriculum/index';

export interface ICurriculumService {
  /**
   * Retrieves a curriculum node by its unique identifier.
   * @param id The unique ID of the curriculum node.
   * @returns A promise that resolves to the CurriculumNode if found, otherwise undefined.
   */
  getNodeById(id: string): Promise<CurriculumNode | undefined>;

  /**
   * Retrieves curriculum nodes that match the provided filters.
   * @param filters An object containing filter criteria.
   * @returns A promise that resolves to an array of matching CurriculumNodes.
   */
  getNodes(filters: CurriculumNodeFilters): Promise<CurriculumNode[]>;

  /**
   * Retrieves all direct children of a given curriculum node.
   * @param parentId The unique ID of the parent curriculum node.
   * @returns A promise that resolves to an array of child CurriculumNodes.
   */
  getChildren(parentId: string): Promise<CurriculumNode[]>;

  /**
   * Retrieves all direct children of a given curriculum node.
   * @param parentId The unique ID of the parent curriculum node.
   * @returns A promise that resolves to an array of child CurriculumNodes.
   */
  getChildrenOfNode(parentId: string): Promise<CurriculumNode[]>;

  /**
   * Retrieves all descendants of a given curriculum node.
   * @param parentId The unique ID of the parent curriculum node.
   * @returns A promise that resolves to an array of descendant CurriculumNodes.
   */
  getDescendants(parentId: string): Promise<CurriculumNode[]>;

  /**
   * Generates AI context for a specific curriculum node.
   * @param nodeId The unique ID of the curriculum node.
   * @returns A promise that resolves to a string containing AI context.
   */
  generateAIContextForNode(nodeId: string): Promise<string>;
}
