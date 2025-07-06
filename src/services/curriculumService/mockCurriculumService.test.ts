
import { describe, it, expect, beforeEach } from 'vitest';
import { mockCurriculumService } from './mockCurriculumService';
import { mockCurriculumData } from '@/data/mockCurriculumData';
import { CurriculumNode } from '@/types/curriculumIndex';

describe('MockCurriculumService', () => {
  beforeEach(() => {
    // Ensure a clean state for each test if needed, though our mock service re-reads on init.
    // For more complex scenarios, we might want to reset or provide specific mock data sets per test.
  });

  it('should retrieve a node by its ID', async () => {
    const node = await mockCurriculumService.getNodeById('g4-math-oa-A-1');
    expect(node).toBeDefined();
    expect(node?.id).toBe('g4-math-oa-A-1');
    expect(node?.name).toBe('Interpret a multiplication equation as a comparison.');
  });

  it('should return undefined for a non-existent ID', async () => {
    const node = await mockCurriculumService.getNodeById('non-existent-id');
    expect(node).toBeUndefined();
  });

  it('should retrieve child nodes using parentId', async () => {
    const children = await mockCurriculumService.getChildren('g4-math-oa-A');
    expect(children.length).toBe(3); // Expecting 3 learning objectives under this topic
    expect(children.some(node => node.id === 'g4-math-oa-A-1')).toBe(true);
    expect(children.some(node => node.id === 'g4-math-oa-A-2')).toBe(true);
    expect(children.some(node => node.id === 'g4-math-oa-A-3')).toBe(true);
  });

  it('should retrieve KCs using parentId (children of a learning objective)', async () => {
    const kcs = await mockCurriculumService.getChildren('g4-math-oa-A-1');
    expect(kcs.length).toBe(2);
    expect(kcs.every(kc => kc.nodeType === 'kc')).toBe(true);
    expect(kcs.some(kc => kc.id === 'g4-math-oa-A-1-kc1')).toBe(true);
  });

  it('should retrieve nodes by educationalLevel and subjectName', async () => {
    const nodes = await mockCurriculumService.getNodes({
      educationalLevel: '4',
      subjectName: 'Mathematics',
      nodeType: 'domain',
    });
    expect(nodes.length).toBe(2); // Expecting 2 domains in Grade 4 Math
    expect(nodes.every(node => node.educationalLevel === '4' && node.subjectName === 'Mathematics' && node.nodeType === 'domain')).toBe(true);
  });

  it('should retrieve all nodes of a specific type, e.g., all KCs', async () => {
    const kcs = await mockCurriculumService.getNodes({ nodeType: 'kc' });
    // We added 2 KCs for g4-math-oa-A-1 and 3 KCs for g4-math-oa-A-2
    expect(kcs.length).toBe(5);
    expect(kcs.every(kc => kc.nodeType === 'kc')).toBe(true);
  });

  it('should retrieve all nodes when no filters are provided', async () => {
    const allNodes = await mockCurriculumService.getNodes();
    expect(allNodes.length).toBe(mockCurriculumData.length);
  });

  it('should filter by nameContains (case-insensitive)', async () => {
    const nodes = await mockCurriculumService.getNodes({ nameContains: 'multiplication equation' });
    expect(nodes.length).toBe(1);
    expect(nodes[0].id).toBe('g4-math-oa-A-1');
  });

  it('should retrieve descendants of a node', async () => {
    // Get descendants of the 'Operations and Algebraic Thinking' domain
    const descendants = await mockCurriculumService.getDescendants('g4-math-oa');
    // Expected: 1 topic ('g4-math-oa-A')
    //           3 learning objectives under that topic
    //           2 KCs under g4-math-oa-A-1
    //           3 KCs under g4-math-oa-A-2
    // Total = 1 + 3 + 2 + 3 = 9
    expect(descendants.length).toBe(9);
    expect(descendants.some(d => d.id === 'g4-math-oa-A')).toBe(true); // topic
    expect(descendants.some(d => d.id === 'g4-math-oa-A-1')).toBe(true); // learning objective
    expect(descendants.some(d => d.id === 'g4-math-oa-A-1-kc1')).toBe(true); // kc
  });

  it('should return an empty array for descendants of a leaf node', async () => {
    const descendants = await mockCurriculumService.getDescendants('g4-math-oa-A-1-kc1'); // A KC node
    expect(descendants.length).toBe(0);
  });

  it('should retrieve an empty array for children of a leaf node', async () => {
    const children = await mockCurriculumService.getChildren('g4-math-oa-A-1-kc1'); // A KC node
    expect(children.length).toBe(0);
  });

  it('should filter by multiple nodeTypes', async () => {
    const nodes = await mockCurriculumService.getNodes({ nodeType: ['topic', 'kc'], parentId: 'g4-math-oa-A-1' });
    // Only KCs are direct children of g4-math-oa-A-1
    expect(nodes.filter(n => n.nodeType === 'kc').length).toBe(2);
    expect(nodes.filter(n => n.nodeType === 'topic').length).toBe(0);
    expect(nodes.length).toBe(2);

    const nodes2 = await mockCurriculumService.getNodes({ nodeType: ['domain', 'subject'] });
    expect(nodes2.filter(n => n.nodeType === 'domain').length).toBe(2); // g4-math-oa, g4-math-nbt
    expect(nodes2.filter(n => n.nodeType === 'subject').length).toBe(1); // g4-math
    expect(nodes2.length).toBe(3);
  });

});
