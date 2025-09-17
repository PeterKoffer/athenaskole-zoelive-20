import { mulberry32, pick, pickMany, hashString } from "@/utils/rand";
import { STYLE_PACKS } from "@/config/imageStylePacks";
import { CAMERA_PRESETS, LIGHTING_PRESETS, COLOR_PRESETS, MOOD_PRESETS } from "@/config/imageCameras";
import { domainProps, Domain, getDomainFromTitle } from "@/config/propsBanks";
import { isTooSimilar } from "@/services/imagePromptDeduper";

export type SceneRole = "cover" | "phase" | "detail" | "action";

const PHOTO_REALISM_TERMS = [
  "cinematic CG film still", "stylized realism", "soft PBR materials",
  "realistic surface microtexture", "subtle film grain",
  "natural specular highlights", "depth-of-field bokeh",
  "filmic color grading", "production-quality lighting"
];

function clamp01(x: number) { return Math.max(0, Math.min(1, x)); }

export interface ImagePromptOptions {
  adventureId: string;
  phaseId?: string;
  domain?: Domain;                 // styrer props
  title?: string;                  // adventure title
  subjectLine: string;             // 1 linje om motivet
  stylePackId?: string;            // kidbook-gouache | cinematic-stylized-realism
  consistencyTag?: string;         // fx "NELIE-cin-real-01 food-truck"
  avoid?: string[];                // ord vi vil undgå
  recentPrompts?: string[];        // til dedupe
  variantSalt?: number;            // 0,1,2…
  realismBlend?: number;           // 0..1 (0 = ren kidbook, 1 = cinematic-realism)
}

function chooseStylePack(stylePackId?: string) {
  if (stylePackId) return STYLE_PACKS.find(s => s.id === stylePackId);
  // default: cinematic som ny standard
  return STYLE_PACKS.find(s => s.id === "cinematic-stylized-realism");
}

function buildCameraBlock(rnd: () => number, role: SceneRole) {
  let cands = CAMERA_PRESETS;
  if (role === "cover") cands = CAMERA_PRESETS.filter(c => c.includes("establishing") || c.includes("bird") || c.includes("wide"));
  if (role === "detail") cands = CAMERA_PRESETS.filter(c => c.includes("close-up") || c.includes("overhead") || c.includes("macro"));
  if (role === "action") cands = CAMERA_PRESETS.filter(c => c.includes("low-angle") || c.includes("POV") || c.includes("isometric"));
  return pick(rnd, cands.length ? cands : CAMERA_PRESETS);
}

function negatives(avoid?: string[]) {
  const base = [
    "uncanny valley", "waxy skin", "gore", "horror", "disturbing",
    "realistic brand logos", "text, watermark, caption", "oversharpened halos",
    "moiré patterns", "banding", "readable text", "grade signs"
  ];
  return [...base, ...(avoid ?? [])].join(", ");
}

/**
 * Bygger 2–3 varianter pr. scene. RealismBlend blander "kidbook" og "cinematic".
 * 0 = ren kidbook, 0.5 = mellemzone, 1 = mest filmisk realism.
 */
export function buildImagePrompts(role: SceneRole, opts: ImagePromptOptions) {
  const realism = clamp01(opts.realismBlend ?? 0.85); // standard: ret filmisk
  const seedBase = hashString(`${opts.adventureId}:${opts.phaseId ?? "cover"}:${opts.variantSalt ?? 0}`);
  const rnd = mulberry32(seedBase);

  const stylePack = chooseStylePack(opts.stylePackId);
  const kidbook = STYLE_PACKS.find(s => s.id === "kidbook-gouache");
  
  if (!stylePack) {
    throw new Error(`Style pack not found: ${opts.stylePackId}`);
  }

  const domain = opts.domain || (opts.title ? getDomainFromTitle(opts.title) : 'vertical-farm');
  const camera = buildCameraBlock(rnd, role);
  const light = pick(rnd, LIGHTING_PRESETS);
  const color = pick(rnd, COLOR_PRESETS);
  const mood = pick(rnd, MOOD_PRESETS);
  const props = pickMany(rnd, domainProps(domain), role === "cover" ? 4 : 2);

  // Blend: jo højere realism, jo mere PHOTO_REALISM_TERMS og stylePack (cinematic), jo mindre kidbook-ord
  const baseStyle = (realism < 0.5 && kidbook) ? kidbook.base : stylePack.base;
  const blendAccents = [
    ...pickMany(rnd, stylePack.accents, realism >= 0.5 ? 2 : 1),
    ...(realism >= 0.7 ? pickMany(rnd, PHOTO_REALISM_TERMS, 2) : [])
  ];

  const consistencyTag = opts.consistencyTag || `NELIE-cin-real-01 ${domain}`;

  const common = [
    ...baseStyle,
    ...blendAccents,
    opts.subjectLine,
    props.join(", "),
    camera,
    light,
    color,
    mood,
    "age-appropriate",
    ...(stylePack.safety || []),
    `CONSISTENCY_TAG: ${consistencyTag}`
  ].join(" — ");

  const v1 = common;
  const v2 = common
    .replace(camera, buildCameraBlock(mulberry32(seedBase + 101), role))
    .replace(light, pick(mulberry32(seedBase + 202), LIGHTING_PRESETS));
  const v3 = common.replace(color, pick(mulberry32(seedBase + 303), COLOR_PRESETS));

  const variants = [v1, v2, v3];
  const filtered = opts.recentPrompts?.length
    ? variants.filter(v => !isTooSimilar(v, opts.recentPrompts!, 0.72))
    : variants;

  return (filtered.length ? filtered : variants).map((v, i) => ({
    prompt: v,
    negative: negatives(opts.avoid),
    seed: String(seedBase + i),
    stylePack: stylePack.id,
    realism,
    domain
  }));
}

/**
 * Convenience function for building a single adventure-specific prompt
 */
export function buildAdventurePrompt(adventureId: string, title: string, phaseType: "cover" | "math" | "language" | "science" | "exit" = "cover"): string {
  const domain = getDomainFromTitle(title);
  
  // Create adventure-specific subject lines
  let subjectLine = "";
  switch (domain) {
    case "vertical-farm":
      subjectLine = "students exploring modern vertical farming facility with stacked growing towers and LED grow lights";
      break;
    case "negotiation":
      subjectLine = "students learning negotiation skills in professional meeting room environment";
      break;
    case "toy-design":
      subjectLine = "students designing and creating colorful toy prototypes in creative workshop";
      break;
    case "water-rocket":
      subjectLine = "students building and launching water rockets in outdoor competition field";
      break;
    case "constitution":
      subjectLine = "students experiencing colonial-era democratic assembly and constitution writing";
      break;
    case "food-truck":
    default:
      subjectLine = "students refurbishing retro van into modern food truck with festival atmosphere";
      break;
  }

  const prompts = buildImagePrompts("cover", {
    adventureId,
    domain,
    title,
    subjectLine,
    stylePackId: "cinematic-stylized-realism",
    realismBlend: 0.85,
    consistencyTag: `NELIE-cin-real-01 ${domain}`,
    avoid: ["classroom", "readable text", "grade signs", "brand logos"]
  });

  return prompts[0].prompt;
}