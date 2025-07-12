import { describe, it, expect, beforeEach } from 'vitest';
import { CurriculumService } from './CurriculumService';
import { mockCurriculumData } from '@/data/mockCurriculumData';
import { CurriculumNodeFilters } from '@/types/curriculum/CurriculumFilters';

describe('CurriculumService', () => {
  let service: CurriculumService;

  beforeEach(() => {
    service = new CurriculumService();
  });

  describe('getNodeById', () => {
    it('should return a node if found', async () => {
      // Using an existing ID from usMathData.ts
      const node = await service.getNodeById('k-cc-1');
      expect(node).toBeDefined();
      expect(node!.id).toBe('k-cc-1');
      expect(node!.name).toBe('Count to 100 by ones and by tens (K.CC.A.1)');
    });

    it('should return undefined if node not found', async () => {
      const node = await service.getNodeById('non-existent-id');
      expect(node).toBeUndefined();
    });
  });

  describe('getChildren', () => {
    it('should return direct children of a parent node', async () => {
      // Using 'k-cc' (Kindergarten Counting & Cardinality domain) which has LOs as children
      const children = await service.getChildren('k-cc');
      expect(children.length).toBeGreaterThan(0); // Expecting at least one child LO
      expect(children.some(c => c.id === 'k-cc-1')).toBe(true);
      expect(children.some(c => c.id === 'k-cc-2')).toBe(true);
      expect(children.some(c => c.id === 'k-cc-3')).toBe(true);
    });

    it('should return empty array if parent has no children', async () => {
      // 'k-cc-1' is a learning_objective, likely has no children in current mock data
      const children = await service.getChildren('k-cc-1');
      expect(children).toHaveLength(0);
    });
  });

  describe('getDescendants', () => {
    it('should return all descendants of a parent node', async () => {
      // 'us-k-math' (Kindergarten Math course) has domains and LOs
      const descendants = await service.getDescendants('us-k-math');
      expect(descendants.length).toBeGreaterThan(2); // Expecting domains and LOs
      
      expect(descendants.some(d => d.nodeType === 'domain')).toBe(true);
      expect(descendants.some(d => d.nodeType === 'learning_objective')).toBe(true);
      // KCs are not currently in usMathData, so this check might fail or need adjustment
      // For now, let's assume no KCs for this test based on current data.
      // expect(descendants.some(d => d.nodeType === 'kc')).toBe(true);
    });
  });

  describe('getNodes with filters', () => {
    it('should return all nodes if no filters provided', async () => {
      const nodes = await service.getNodes();
      expect(nodes.length).toBe(mockCurriculumData.length);
    });

    it('should filter by nodeType', async () => {
      const filters: CurriculumNodeFilters = { nodeType: 'country' };
      const nodes = await service.getNodes(filters);
      expect(nodes.length).toBeGreaterThan(0);
      nodes.forEach(node => {
        expect(node.nodeType).toBe('country');
      });
    });

    it('should filter by array of nodeTypes', async () => {
      const filters: CurriculumNodeFilters = { nodeType: ['country', 'subject'] };
      const nodes = await service.getNodes(filters);
      expect(nodes.length).toBeGreaterThan(0);
      nodes.forEach(node => {
        expect(['country', 'subject']).toContain(node.nodeType);
      });
    });

    it('should filter by countryCode', async () => {
      const filters: CurriculumNodeFilters = { countryCode: 'US' };
      const nodes = await service.getNodes(filters);
      expect(nodes.length).toBeGreaterThan(0);
      nodes.forEach(node => {
        expect(node.countryCode).toBe('US');
      });
    });

    it('should filter by educationalLevel', async () => {
      // Using 'K' as we know Kindergarten data exists
      const filters: CurriculumNodeFilters = { educationalLevel: 'K' };
      const nodes = await service.getNodes(filters);
      expect(nodes.length).toBeGreaterThan(0);
      nodes.forEach(node => {
        expect(node.educationalLevel).toBe('K');
      });
    });

    it('should filter by subjectName', async () => {
      const filters: CurriculumNodeFilters = { subjectName: 'Mathematics' };
      const nodes = await service.getNodes(filters);
      expect(nodes.length).toBeGreaterThan(0);
      nodes.forEach(node => {
        expect(node.subjectName).toBe('Mathematics');
      });
    });

    it('should filter by parentId', async () => {
      // Using 'k-cc' (domain) as parent, expecting its LO children
      const filters: CurriculumNodeFilters = { parentId: 'k-cc' };
      const nodes = await service.getNodes(filters);
      expect(nodes.length).toBeGreaterThan(0);
      nodes.forEach(node => {
        expect(node.parentId).toBe('k-cc');
      });
    });

    it('should filter by nameContains (case-insensitive)', async () => {
      // 'Count' should find nodes in K-Math
      const filters: CurriculumNodeFilters = { nameContains: 'count' };
      const nodes = await service.getNodes(filters);
      expect(nodes.length).toBeGreaterThan(0);
      nodes.forEach(node => {
        expect(node.name.toLowerCase()).toContain('count');
      });
    });

    it('should filter by tags', async () => {
      // Using 'foundational' tag present in K-Math and G1-Math
      const filters: CurriculumNodeFilters = { tags: ['foundational'] };
      const nodes = await service.getNodes(filters);
      expect(nodes.length).toBeGreaterThan(0);
      nodes.forEach(node => {
        expect(node.tags).toContain('foundational');
      });
    });

    it('should filter by multiple criteria', async () => {
      const filters: CurriculumNodeFilters = {
        countryCode: 'US',
        nodeType: 'learning_objective',
        educationalLevel: 'K' // Changed from '3' to 'K'
      };
      const nodes = await service.getNodes(filters);
      expect(nodes.length).toBeGreaterThan(0);
      nodes.forEach(node => {
        expect(node.countryCode).toBe('US');
        expect(node.nodeType).toBe('learning_objective');
        expect(node.educationalLevel).toBe('K');
      });
    });

    it('should return empty array if no nodes match filters', async () => {
      const filters: CurriculumNodeFilters = { countryCode: 'NON_EXISTENT' };
      const nodes = await service.getNodes(filters);
      expect(nodes).toHaveLength(0);
    });
  });

  describe('generateAIContextForNode', () => {
    it('should generate context for a node', async () => {
      // Using 'k-oa-1' (K Math LO)
      const context = await service.generateAIContextForNode('k-oa-1');
      expect(context).toContain('LEARNING_OBJECTIVE'); // Type is string literal now
      expect(context).toContain('Represent addition and subtraction'); // Name of k-oa-1
      expect(context).toContain('Grade Level: K'); // Educational level of k-oa-1
      expect(context).toContain('Subject: Mathematics'); // SubjectName of k-oa-1
    });

    it('should return error message for non-existent node', async () => {
      const context = await service.generateAIContextForNode('non-existent');
      expect(context).toContain('not found');
    });
  });

  describe('getNodePath', () => {
    it('should return path from root to node', async () => {
      // Using 'k-cc-1' (K Math LO)
      const path = await service.getNodePath('k-cc-1');
      expect(path.length).toBeGreaterThan(2); // Path: us (country) -> us-math (subject) -> us-k-math (course) -> k-cc (domain) -> k-cc-1 (LO)
      expect(path[0].nodeType).toBe('country');
      expect(path[path.length - 1].nodeType).toBe('learning_objective');
      expect(path[path.length - 1].id).toBe('k-cc-1');
    });
  });

  describe('getStats', () => {
    it('should return curriculum statistics', async () => {
      const stats = await service.getStats();
      expect(stats.totalNodes).toBe(mockCurriculumData.length);
      expect(stats.nodesByType).toBeDefined();
      expect(stats.nodesByCountry).toBeDefined();
      expect(stats.nodesBySubject).toBeDefined();
      expect(stats.nodesByType.country).toBeGreaterThan(0);
      expect(stats.nodesByCountry.US).toBeGreaterThan(0);
    });
  });
});
