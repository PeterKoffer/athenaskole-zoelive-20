// lib/imageProfiles.ts
import { gradeToBand } from '@/lib/grade';

// New age group definitions for different visual styles
export type AgeGroup = 'child' | 'teen' | 'adult';
type GradeBand = 'K-2' | '3-5' | '6-8' | '9-10' | '11-12';

// Map grades to age groups for image generation
export function gradeToAgeGroup(grade?: number): AgeGroup {
  if (grade == null || grade <= 4) return 'child';  // 0-4 grade
  if (grade <= 8) return 'teen';   // 5-8 grade
  return 'adult';  // 9+ grade (high school, HF, gymnasium)
}

// ---- Subject presets for your 12 classes (visual motifs only, no text overlays) ----
const subjectTokens: Record<string, string> = {
  'native-language': 'reading and writing workspace, books, notebook, pencils, cozy desk lighting',
  'mathematics': 'clean geometric shapes, graphs and grids, abstract equation motifs (no legible text)',
  'language-lab': 'conversation scenes, cultural motifs, minimal flags, speech icons (no text)',
  'science': 'lab equipment, microscopes, safe glassware, specimen trays, clean backdrops',
  'history-religion': 'period-accurate props, archival textures subtle, respectful composition',
  'geography': 'maps and globes, landscapes, terrain models, compass motifs',
  'computer-and-technology': 'modern devices, UI panels abstracted (no legible UI text), code motifs',
  'creative-arts': 'studio setting, easels, colorful paints, sketch tools',
  'music-discovery': 'instruments, studio mics, waveforms abstract, stage lighting',
  'physical-education': 'dynamic motion, gym or field, safety gear visible',
  'mental-wellness': 'calming nature, soft lighting, cozy interior, mindful posture',
  'life-essentials': 'everyday real-life scenes: kitchen, bank counter, transit, stores',
};

// ---- Age group specific visual styles for different developmental stages ----
const styleByAgeGroup: Record<AgeGroup, { positive: string; negative: string; ar: '1:1' | '16:9'; size: `${number}x${number}` }> = {
  'child': {
    positive: 'bright saturated colors, cartoon style, simple rounded shapes, thick outlines, smiling characters, playful elements, high contrast, child-friendly illustration, fantasy elements welcome',
    negative: 'no scary elements, no violence, no dark themes, no realistic weapons, no complex details, no tiny text, no adult themes',
    ar: '1:1', size: '1024x1024'
  },
  'teen': {
    positive: 'vibrant but balanced colors, stylized realistic illustration, moderate detail level, dynamic compositions, relatable characters, modern aesthetic, engaging visual elements',
    negative: 'no overly childish cartoon style, no adult content, no graphic violence, avoid overly simplistic imagery',
    ar: '16:9', size: '1280x720'
  },
  'adult': {
    positive: 'sophisticated color palette, photorealistic or cinematic illustration, professional quality, detailed compositions, mature themes acceptable, documentary style, technical accuracy',
    negative: 'no cartoonish elements, no toy-like appearance, no overly bright colors, avoid childish aesthetics',
    ar: '16:9', size: '1600x900'
  },
};

// ---- Grade-band visual styles ----
const styleByBand: Record<GradeBand, { positive: string; negative: string; ar: '1:1' | '16:9'; size: `${number}x${number}` }> = {
  'K-2': {
    positive: 'bright colors, rounded shapes, thick outlines, flat shading, friendly expressions, minimal background, high contrast',
    negative: 'no realism, no gore, no scary imagery, no tiny text, no clutter',
    ar: '1:1', size: '1024x1024'
  },
  '3-5': {
    positive: 'vibrant stylized illustration, soft shading, moderate simplicity, playful but neat composition',
    negative: 'no babyish crayon textures, no gore, no grim tones',
    ar: '1:1', size: '1024x1024'
  },
  '6-8': {
    positive: 'semi-realistic illustration, clear forms, moderate detail, clean diagram cues',
    negative: 'no toddler/cartoon look',
    ar: '16:9', size: '1280x720'
  },
  '9-10': {
    positive: 'realistic to photorealistic, subdued palette, professional tone, technical diagram overlays ok',
    negative: 'no childish/kawaii/chibi style, no toy props',
    ar: '16:9', size: '1280x720'
  },
  '11-12': {
    positive: 'cinematic photorealism, documentary feel, technical overlays/annotations when helpful',
    negative: 'no cartoon aesthetics, no toy props',
    ar: '16:9', size: '1600x900'
  },
};

function normalizeSubject(subject: string): string {
  return subject.trim().toLowerCase()
    .replace(/[._]/g, ' ')
    .replace(/\s*&\s*/g, ' & ')
    .replace(/\s+/g, ' ')
}

const subjectKeyAliases: Record<string, string> = {
  'native language': 'native-language',
  'native-language': 'native-language',

  'mathematics': 'mathematics',

  'language lab': 'language-lab',
  'language-lab': 'language-lab',

  'science': 'science',

  'history & religion': 'history-religion',
  'history and religion': 'history-religion',
  'history-religion': 'history-religion',

  'geography': 'geography',

  'computer and technology': 'computer-and-technology',
  'computer & technology': 'computer-and-technology',
  'computer-and-technology': 'computer-and-technology',

  'creative arts': 'creative-arts',
  'creative-arts': 'creative-arts',

  'music': 'music-discovery',
  'music discovery': 'music-discovery',
  'music-discovery': 'music-discovery',

  'physical education': 'physical-education',
  'pe': 'physical-education',
  'physical-education': 'physical-education',

  'mental wellness': 'mental-wellness',
  'mental-wellness': 'mental-wellness',

  'life essentials': 'life-essentials',
  'life-essentials': 'life-essentials',
};

function resolveSubjectKey(subject: string): string {
  const norm = normalizeSubject(subject);
  return subjectKeyAliases[norm] ?? norm.replace(/\s+/g, '-');
}

export type ImagePromptSpec = {
  prompt: string;
  negative_prompt: string;
  size: string;          // map to your provider
  aspect_ratio: string;  // if your provider prefers ar
};

// Core builder: call this anywhere you need an image for a lesson/scene.
export function buildImagePrompt(opts: {
  universeTitle: string;
  subject: string;         // one of your 12
  scene: string;           // e.g., "students testing wind tunnel prototype"
  grade?: number;          // student grade; we'll derive the band
  extraStyle?: string;     // optional per-universe seasoning
}): ImagePromptSpec {
  const band = gradeToBand(opts.grade);
  const sKey = resolveSubjectKey(opts.subject);
  const subjectCue = subjectTokens[sKey] ?? '';
  const style = styleByBand[band];

  const base = [
    `Illustrate: ${opts.scene}`,
    `Universe: ${opts.universeTitle}`,
    `Subject cues: ${subjectCue}`,
    `Audience: grade band ${band}`,
    `Style: ${style.positive}`,
    opts.extraStyle ? `Extra: ${opts.extraStyle}` : null
  ].filter(Boolean).join(' — ');

  const negative = [
    style.negative,
    'blurry, watermark, signature, text overlay, misspelled labels, extra fingers, deformed anatomy'
  ].join(', ');

  return {
    prompt: base,
    negative_prompt: negative,
    size: style.size,
    aspect_ratio: style.ar
  };
}

// New age-group specific image prompt builder
export function buildAgeGroupImagePrompt(opts: {
  universeTitle: string;
  subject: string;
  scene: string;
  ageGroup: AgeGroup;
  extraStyle?: string;
}): ImagePromptSpec {
  const sKey = resolveSubjectKey(opts.subject);
  const subjectCue = subjectTokens[sKey] ?? '';
  const style = styleByAgeGroup[opts.ageGroup];

  const base = [
    `Illustrate: ${opts.scene}`,
    `Universe: ${opts.universeTitle}`,
    `Subject cues: ${subjectCue}`,
    `Age group: ${opts.ageGroup}`,
    `Style: ${style.positive}`,
    opts.extraStyle ? `Extra: ${opts.extraStyle}` : null
  ].filter(Boolean).join(' — ');

  const negative = [
    style.negative,
    'blurry, watermark, signature, text overlay, misspelled labels, extra fingers, deformed anatomy'
  ].join(', ');

  return {
    prompt: base,
    negative_prompt: negative,
    size: style.size,
    aspect_ratio: style.ar
  };
}

// Generate all three age variants for an adventure
export function buildAllAgeVariants(opts: {
  universeTitle: string;
  subject: string;
  scene: string;
  extraStyle?: string;
}): Record<AgeGroup, ImagePromptSpec> {
  return {
    child: buildAgeGroupImagePrompt({ ...opts, ageGroup: 'child' }),
    teen: buildAgeGroupImagePrompt({ ...opts, ageGroup: 'teen' }),
    adult: buildAgeGroupImagePrompt({ ...opts, ageGroup: 'adult' })
  };
}

// Stable key so you can dedupe/cache by band without touching content generation.
export function imageCacheKey(universeSlug: string, subject: string, scene: string, grade?: number, styleVersion = 'v1') {
  const band = gradeToBand(grade);
  return `${universeSlug}::${resolveSubjectKey(subject)}::${band}::${scene}::${styleVersion}`;
}

// New cache key for age groups
export function ageGroupCacheKey(universeSlug: string, subject: string, scene: string, ageGroup: AgeGroup, styleVersion = 'v1') {
  return `${universeSlug}::${resolveSubjectKey(subject)}::${ageGroup}::${scene}::${styleVersion}`;
}