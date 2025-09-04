import { z } from 'zod';

export const NodeOption = z.object({
  id: z.string(),
  label: z.record(z.string(), z.string()),
  to: z.string().nullable(),
  effects: z.array(z.object({
    type: z.enum(['resource', 'flag', 'score']),
    key: z.string(),
    op: z.enum(['set','inc','dec']),
    value: z.number().optional(),
  })).default([]),
});

export const SimNode = z.object({
  id: z.string(),
  kind: z.enum(['text','decision','event']),
  content: z.record(z.string(), z.string()),
  checks: z.array(z.object({
    type: z.enum(['grade','ability','flag','resource']),
    key: z.string(),
    cmp: z.enum(['>=','<=','==','!=','>','<']).optional(),
    value: z.union([z.string(), z.number(), z.boolean()]).optional(),
  })).optional(),
  options: z.array(NodeOption).optional(),
});

export const Simulation = z.object({
  id: z.string(),
  title: z.record(z.string(), z.string()),
  objectives: z.array(z.string()),
  subjectMix: z.array(z.object({ subjectId: z.string(), weight: z.number().min(0) })).min(1),
  resources: z.record(z.string(), z.number()).default({}),
  nodes: z.array(SimNode).min(1),
  start: z.string(),
});

export type Simulation = z.infer<typeof Simulation>;
export type SimNode = z.infer<typeof SimNode>;
