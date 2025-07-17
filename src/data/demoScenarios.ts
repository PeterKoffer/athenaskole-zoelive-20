import { ScenarioDefinition } from '@/types/scenario';

export const demoScenarios: ScenarioDefinition[] = [
  {
    id: 'math-adventure-1',
    title: 'The Lost Treasure of Fraction Island',
    description: 'A thrilling adventure to find a hidden treasure by solving fraction-based puzzles.',
    educational: {
      subject: 'Mathematics',
      gradeLevel: 4,
      difficulty: 5,
      estimatedDuration: 15,
      learningOutcomes: [
        'Understand fraction equivalence and comparison.',
        'Add and subtract fractions with like denominators.',
        'Solve word problems involving fractions.',
      ],
      prerequisites: ['Basic understanding of fractions.'],
    },
    nodes: [],
    entryNodeId: 'start',
    exitNodeIds: ['end'],
    config: {
      allowRevisit: true,
      autoSave: true,
    },
    metadata: {
      author: 'Lovable Learning',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
      version: '1.0.0',
      status: 'published',
      tags: ['math', 'fractions', 'adventure'],
    },
  },
];
