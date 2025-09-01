import { z } from "zod";

export const ContentRequest = z.object({
  subject: z.string(),
  grade: z.union([z.string(), z.number()]),
  curriculum: z.string(),
  ability: z.string().optional(),
  learningStyle: z.string().optional(),
  interests: z.array(z.string()).default([]),
});
export type ContentRequest = z.infer<typeof ContentRequest>;

export const Activity = z.object({
  type: z.string(),
  durationMin: z.number(),
  instructions: z.string(),
});

export const ContentResponse = z.object({
  ok: z.literal(true),
  data: z.object({
    title: z.string(),
    outline: z.array(z.string()).default([]),
    activities: z.array(Activity).default([]),
  })
}).or(z.object({ ok: z.literal(false), error: z.string() }));
export type ContentResponse = z.infer<typeof ContentResponse>;