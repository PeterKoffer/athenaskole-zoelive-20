import { z } from 'zod';
import type { SubjectId } from '../subjects';

// TS type for Grade (use explicit union for strong typing)
export type Grade = 'K' | 1|2|3|4|5|6|7|8|9|10 | 'HS';

// Zod schema for runtime validation
export const GradeSchema = z.union([
  z.literal('K'),
  z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5),
  z.literal(6), z.literal(7), z.literal(8), z.literal(9), z.literal(10),
  z.literal('HS'),
]);

export const AdaptationParamsSchema = z.object({
  mode: z.enum(['daily-program', 'training-ground']),
  locale: z.string().default('en-US'),
  subjectId: z.custom<SubjectId>(),
  grade: GradeSchema,
  curriculumId: z.string().optional(),
  schoolPerspective: z.enum(['traditional', 'project', 'competency', 'mixed']).default('mixed'),

  lessonDurations: z.record(z.string(), z.number().int().positive()).default({}),
  subjectWeights: z.record(z.string(), z.number().min(0)).default({}),

  calendar: z.object({
    keywords: z.array(z.string()).default([]),
    windowMinutes: z.number().int().positive().optional(),
  }).default({ keywords: [] }),

  abilities: z.object({
    accuracy: z.number().min(0).max(1).optional(),
    pace: z.number().min(0).max(1).optional(),
    readingLevel: z.string().optional(),
    numeracyLevel: z.string().optional(),
  }).partial().optional(),

  learningStyle: z.enum(['visual','auditory','kinesthetic','reading-writing']).optional(),
  interests: z.array(z.string()).optional(),

  featureFlags: z.array(z.string()).optional(),
});

export type AdaptationParams = z.infer<typeof AdaptationParamsSchema>;
