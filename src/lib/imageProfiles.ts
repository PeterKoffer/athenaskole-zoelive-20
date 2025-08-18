// lib/imageProfiles.ts
type GradeBand = 'K-2' | '3-5' | '6-8' | '9-10' | '11-12';

export function gradeToBand(grade?: number): GradeBand {
  if (grade == null) return '6-8';
  if (grade <= 2) return 'K-2';
  if (grade <= 5) return '3-5';
  if (grade <= 8) return '6-8';
  if (grade <= 10) return '9-10';
  return '11-12';
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
    .replace(/&/g,'and')
    .replace(/\s+/g,'-');
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
  const sKey = normalizeSubject(opts.subject);
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

// Stable key so you can dedupe/cache by band without touching content generation.
export function imageCacheKey(universeSlug: string, subject: string, scene: string, grade?: number, styleVersion = 'v1') {
  const band = gradeToBand(grade);
  return `${universeSlug}::${normalizeSubject(subject)}::${band}::${scene}::${styleVersion}`;
}