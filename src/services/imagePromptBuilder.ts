// src/services/imagePromptBuilder.ts
export type StyleKey = "kidbook-gouache" | "cinematic-3d";

const STYLE_PACK: Record<StyleKey, string> = {
  "kidbook-gouache":
    "children's storybook illustration, soft gouache texture, clean shapes, gentle outlines, subtle shading, high detail, professional artstation quality",
  "cinematic-3d":
    "stylized 3D render, pixar-like, soft subsurface scattering, physically based rendering, crisp rim light, filmic tone"
};

export function buildImagePrompt({
  style = "kidbook-gouache",
  subject,
  setting,
  camera = "wide establishing, 35mm, eye-level, rule-of-thirds, shallow depth of field on subject",
  light = "soft daylight, warm bounce, subtle rim",
  color = "warm peach, mint green, teal accents",
  mood = "hopeful, inviting",
  consistency = "NELIE-kidbook-gouache-01 default",
  notes = "age-appropriate, wholesome, no text overlay, no logos"
}: {
  style?: StyleKey;
  subject: string;
  setting: string;
  camera?: string;
  light?: string;
  color?: string;
  mood?: string;
  consistency?: string;
  notes?: string;
}) {
  const styleTags = STYLE_PACK[style];
  return `${styleTags} — ${subject} — ${setting} — ${camera} — ${light} — ${color} — ${mood} — ${notes} — CONSISTENCY_TAG: ${consistency}`;
}

export const NEGATIVE_PROMPT =
  "text, watermark, logo, low-res, blurry, extra fingers, deformed hands, gore, hyperreal skin, sexualized, noisy background, posterized, oversaturated";

export function seedFromId(id: string, salt = 0) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < id.length; i++) { 
    h ^= id.charCodeAt(i); 
    h = Math.imul(h, 16777619); 
  }
  return (h + salt) >>> 0;
}

export function buildAdventureImagePrompt(
  adventureId: string,
  title: string,
  phaseIndex: number,
  phaseType: "cover" | "math" | "language" | "science" | "exit",
  subject?: string
): { prompt: string; negativePrompt: string; seed: number } {
  const consistency = `NELIE-kidbook-gouache-01 ${adventureId.replace(/[^a-z0-9]/gi, '-')}`;
  const seed = seedFromId(adventureId, phaseIndex);

  const phasePrompts = {
    cover: {
      subject: `a cheerful student starting an adventure with ${title.toLowerCase()}, establishing shot showing the main setting and key props`,
      setting: "wide establishing scene, schoolyard or community setting, bunting flags, tables, key adventure elements visible",
      camera: "wide establishing, 35mm, eye-level, rule-of-thirds, shallow depth of field on the student and main elements",
      light: "soft golden hour light, warm bounce, subtle rim light",
      color: "warm peach, mint green, teal accents",
      mood: "hopeful, adventurous, inviting"
    },
    math: {
      subject: `the student working with mathematical concepts like calculations, prices, measurements, or data related to ${title.toLowerCase()}`,
      setting: "clear mathematical cues: calculator, price tags, charts, measuring tools, chalkboard with numbers (no readable text)",
      camera: "medium-wide, 35mm, slight top-down angle, subject centered, shallow DOF on student and math tools",
      light: "soft daylight shade, gentle ambient occlusion",
      color: "mint green, warm beige, tomato red accents",
      mood: "focused, analytical, optimistic"
    },
    language: {
      subject: `the student practicing communication, writing, or presentation skills for ${title.toLowerCase()}`,
      setting: "presentation setup with blank poster boards (no text), speaking to classmates, communication props",
      camera: "medium shot, eye-level, 50mm look, shallow DOF on student",
      light: "soft indoor daylight or canopy shade",
      color: "peach, soft teal, sunflower yellow",
      mood: "confident, playful, expressive"
    },
    science: {
      subject: `the student applying scientific principles, conducting experiments, or making observations related to ${title.toLowerCase()}`,
      setting: "lab tools, safety equipment, observation charts, measurement devices, clean scientific backdrop",
      camera: "medium-wide, 35mm, slightly low angle, clear focal point on scientific equipment",
      light: "cool indoor light with soft highlights",
      color: "cool blue, mint, stainless steel grey",
      mood: "responsible, careful, curious"
    },
    exit: {
      subject: `the student completing or presenting their ${title.toLowerCase()} project, showing accomplishment`,
      setting: "final presentation or completion scene, organized workspace, proud display of work",
      camera: "wide, 28–35mm, eye-level, slight vignette to focus on achievement",
      light: "warm afternoon light, gentle rim, soft shadows",
      color: "warm peach, mint, teal",
      mood: "proud, accomplished, satisfied"
    }
  };

  const config = phasePrompts[phaseType];
  
  const prompt = buildImagePrompt({
    style: "kidbook-gouache",
    subject: config.subject,
    setting: config.setting,
    camera: config.camera,
    light: config.light,
    color: config.color,
    mood: config.mood,
    consistency,
    notes: "age-appropriate, wholesome, no text overlay, no logos"
  });

  return {
    prompt,
    negativePrompt: NEGATIVE_PROMPT,
    seed
  };
}