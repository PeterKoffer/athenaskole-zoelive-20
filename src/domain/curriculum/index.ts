import { z } from 'zod';
import type { SubjectId } from '../subjects';
import { GradeSchema } from '../spec/adaptation';

export const OutcomeSchema = z.object({
  id: z.string(),
  code: z.string().optional(),
  title: z.string(),
  description: z.string().optional(),
});

export const CurriculumUnitSchema = z.object({
  id: z.string(),
  subjectId: z.custom<SubjectId>(),
  grade: GradeSchema,
  outcomes: z.array(OutcomeSchema),
  links: z.array(z.string()).optional(),
});

export type CurriculumUnit = z.infer<typeof CurriculumUnitSchema>;
export type Outcome = z.infer<typeof OutcomeSchema>;
