import { CurriculumNode, CurriculumNodeFilters } from '../../types/curriculum'; // Adjusted path

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
  getChildrenOfNode(parentId: string): Promise<CurriculumNode[]>;

  /**
   * Retrieves all descendants of a given curriculum node up to a certain depth or matching specific criteria.
   * (Optional for initial implementation, can be added later)
   * @param parentId The unique ID of the parent curriculum node.
   * @param maxDepth The maximum depth of descendants to retrieve.
   * @param filters Optional filters to apply to descendants.
   * @returns A promise that resolves to an array of descendant CurriculumNodes.
   */
  // getDescendantsOfNode?(parentId: string, maxDepth?: number, filters?: CurriculumNodeFilters): Promise<CurriculumNode[]>;

  /**
   * Retrieves the path from a curriculum node up to the root (or a specified ancestor).
   * (Optional for initial implementation, can be added later)
   * @param nodeId The unique ID of the curriculum node.
   * @returns A promise that resolves to an array of CurriculumNodes representing the path.
   */
  // getNodePath?(nodeId: string): Promise<CurriculumNode[]>;
}
