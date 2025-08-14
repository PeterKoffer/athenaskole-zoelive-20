// JSON Schema for enforcing lesson structure
export interface LessonActivity {
  id: string;
  kind: 'visual_hook' | 'make_something' | 'investigate' | 'practice' | 'apply' | 'reflect' | 'present' | 'simulate';
  title: string;
  minutes: number;
  description: string;
  props: string[];
  deliverables: string[];
  tags: string[];
}

export interface LessonHero {
  title: string;
  subtitle: string;
  subject: string;
  gradeBand: string;
  minutes: number;
}

export interface AgeVariants {
  'K-2': string;
  '3-5': string;
  '6-8': string;
  '9-10': string;
  '11-12': string;
}

export interface StructuredLesson {
  universeName: string;
  universeCategory: string;
  gradeRange: string;
  durationMinutes: number;
  summary: string;
  imagePrompt: string;
  hero: LessonHero;
  activities: LessonActivity[];
  ageVariants: AgeVariants;
}

// JSON Schema for validation
export const LESSON_SCHEMA = {
  type: "object",
  properties: {
    universeName: { 
      type: "string",
      minLength: 1
    },
    universeCategory: { 
      type: "string",
      minLength: 1
    },
    gradeRange: { 
      type: "string",
      pattern: "^(K-2|3-5|6-8|9-10|11-12)$"
    },
    durationMinutes: { 
      type: "integer",
      minimum: 30,
      maximum: 300
    },
    summary: { 
      type: "string",
      minLength: 50,
      maxLength: 500
    },
    imagePrompt: { 
      type: "string",
      minLength: 20
    },
    hero: {
      type: "object",
      properties: {
        title: { type: "string", minLength: 1 },
        subtitle: { type: "string", minLength: 1 },
        subject: { type: "string", minLength: 1 },
        gradeBand: { type: "string", minLength: 1 },
        minutes: { type: "integer", minimum: 1 }
      },
      required: ["title", "subtitle", "subject", "gradeBand", "minutes"]
    },
    activities: {
      type: "array",
      minItems: 3,
      maxItems: 8,
      items: {
        type: "object",
        properties: {
          id: { type: "string", minLength: 1 },
          kind: { 
            type: "string",
            enum: ["visual_hook", "make_something", "investigate", "practice", "apply", "reflect", "present", "simulate"]
          },
          title: { type: "string", minLength: 1 },
          minutes: { type: "integer", minimum: 5, maximum: 60 },
          description: { type: "string", minLength: 10 },
          props: { 
            type: "array",
            items: { type: "string" },
            minItems: 1
          },
          deliverables: { 
            type: "array",
            items: { type: "string" },
            minItems: 1
          },
          tags: { 
            type: "array",
            items: { type: "string" },
            minItems: 1
          }
        },
        required: ["id", "kind", "title", "minutes", "description", "props", "deliverables", "tags"]
      }
    },
    ageVariants: {
      type: "object",
      properties: {
        "K-2": { type: "string", minLength: 10 },
        "3-5": { type: "string", minLength: 10 },
        "6-8": { type: "string", minLength: 10 },
        "9-10": { type: "string", minLength: 10 },
        "11-12": { type: "string", minLength: 10 }
      },
      required: ["K-2", "3-5", "6-8", "9-10", "11-12"]
    }
  },
  required: ["universeName", "universeCategory", "gradeRange", "durationMinutes", "summary", "imagePrompt", "hero", "activities", "ageVariants"]
};

// Universe validation - must match catalog
import { Prime100 } from '@/content/universe.catalog';

export function validateUniverseName(universeName: string): boolean {
  return Prime100.some(universe => universe.title === universeName);
}

export function validateLessonStructure(lesson: any): lesson is StructuredLesson {
  // Basic structure validation
  if (!lesson || typeof lesson !== 'object') return false;
  
  // Check required fields
  const requiredFields = ['universeName', 'universeCategory', 'gradeRange', 'durationMinutes', 'summary', 'imagePrompt', 'hero', 'activities', 'ageVariants'];
  for (const field of requiredFields) {
    if (!(field in lesson)) return false;
  }

  // Validate universe name exists in catalog
  if (!validateUniverseName(lesson.universeName)) {
    console.error(`Invalid universe name: ${lesson.universeName}. Must match Prime 100 catalog.`);
    return false;
  }

  // Validate activities structure
  if (!Array.isArray(lesson.activities) || lesson.activities.length < 3) {
    return false;
  }

  // Validate image prompt exists
  if (!lesson.imagePrompt || lesson.imagePrompt.length < 20) {
    return false;
  }

  return true;
}