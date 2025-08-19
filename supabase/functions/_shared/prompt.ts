// Deno-compatible, no Node imports

export type GradeBand = 'K-2' | '3-5' | '6-8' | '9-10' | '11-12';

export function gradeToBand(grade?: number): GradeBand {
  if (grade == null) return '6-8';
  if (grade <= 2) return 'K-2';
  if (grade <= 5) return '3-5';
  if (grade <= 8) return '6-8';
  if (grade <= 10) return '9-10';
  return '11-12';
}

const subjectKeyAliases: Record<string, string> = {
  'native language':'native-language','native-language':'native-language',
  'mathematics':'mathematics',
  'language lab':'language-lab','language-lab':'language-lab',
  'science':'science',
  'history & religion':'history-religion','history and religion':'history-religion','history-religion':'history-religion',
  'geography':'geography',
  'computer and technology':'computer-and-technology','computer & technology':'computer-and-technology','computer-and-technology':'computer-and-technology',
  'creative arts':'creative-arts','creative-arts':'creative-arts',
  'music':'music-discovery','music discovery':'music-discovery','music-discovery':'music-discovery',
  'physical education':'physical-education','pe':'physical-education','physical-education':'physical-education',
  'mental wellness':'mental-wellness','mental-wellness':'mental-wellness',
  'life essentials':'life-essentials','life-essentials':'life-essentials',
};

function resolveSubjectKey(subject: string) {
  const norm = subject.trim().toLowerCase().replace(/[._]/g,' ').replace(/\s+/g,' ');
  return subjectKeyAliases[norm] ?? norm.replace(/\s+/g,'-');
}

const subjectTokens: Record<string,string> = {
  'native-language': 'reading/writing workspace, books, notebook, pencils',
  'mathematics': 'geometric shapes, graphs, grids, abstract equations (no legible text)',
  'language-lab': 'conversation scene, cultural motifs, speech bubbles (no text)',
  'science': 'lab tools, microscopes, safe glassware, clean backdrop',
  'history-religion': 'period props, archival textures, respectful composition',
  'geography': 'maps, globes, landscapes, terrain models, compass motifs',
  'computer-and-technology': 'modern devices, abstract UI panels, code motifs',
  'creative-arts': 'studio, easel, paints, sketch tools',
  'music-discovery': 'instruments, studio mic, abstract waveforms',
  'physical-education': 'dynamic motion, gym/field, safety gear',
  'mental-wellness': 'calming nature, soft lighting, cozy interior',
  'life-essentials': 'real-life scenes: kitchen, bank, transit, stores',
};

const styleByBand: Record<GradeBand, { pos: string; neg: string; size: `${number}x${number}`; ar: '1:1'|'16:9'}> = {
  'K-2':   { pos:'bright colors, rounded shapes, thick outlines, flat shading, minimal background', neg:'no realism, no text, no clutter', size:'1024x1024', ar:'1:1' },
  '3-5':   { pos:'vibrant stylized illustration, soft shading, playful but neat composition',       neg:'no babyish style',              size:'1024x1024', ar:'1:1' },
  '6-8':   { pos:'semi-realistic illustration, moderate detail, clean diagram cues',                neg:'no toddler/cartoon look',       size:'1280x720',  ar:'16:9' },
  '9-10':  { pos:'realistic to photorealistic, professional tone',                                  neg:'no childish/kawaii style',       size:'1280x720',  ar:'16:9' },
  '11-12': { pos:'cinematic photorealism, documentary feel, technical overlays ok',                 neg:'no cartoon aesthetics',          size:'1600x900',  ar:'16:9' },
};

export function buildPrompt(opts: {
  universeTitle: string;
  subject: string;
  scene: string;      // e.g., "cover: lab teamwork"
  grade?: number;
  extraStyle?: string;
}) {
  const band = gradeToBand(opts.grade);
  const sKey = resolveSubjectKey(opts.subject);
  const subjectCue = subjectTokens[sKey] ?? '';
  const style = styleByBand[band];

  const prompt = [
    `Illustrate: ${opts.scene}`,
    `Universe: ${opts.universeTitle}`,
    `Subject cues: ${subjectCue}`,
    `Audience: grade band ${band}`,
    `Style: ${style.pos}`,
    opts.extraStyle ? `Extra: ${opts.extraStyle}` : null
  ].filter(Boolean).join(' — ');

  const negative = `${style.neg}, blurry, watermark, signature, text overlay`;

  return { prompt, negative, size: style.size, aspect_ratio: style.ar, band, subjectKey: sKey };
}