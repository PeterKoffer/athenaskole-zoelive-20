// src/services/images/promptBuilder.ts
export const STYLE_PACK =
  "cinematic hybrid photoreal + pixar-like, high dynamic range, volumetric light, shallow depth of field, ultra-detailed, filmic color grade, no text overlay, no watermark, no logos";

export const NEGATIVE =
  "NO classroom, NO school interior, NO desks, NO chalkboard, NO whiteboard, NO children, NO teacher, NO clipart, NO flat icon style, NO 3D word art, NO school supplies, NO academic setting";

type Scene = { scene: string; props: string };

const SCENE_MAP: Record<string, Scene> = {
  "graphic-agency": {
    scene: "modern graphic design studio, large monitors with design software, drawing tablets, moodboards, color swatch walls",
    props: "sketchpads, pens, logo drafts, light from big windows, indoor plants",
  },
  "dinosaur-park": {
    scene: "prehistoric safari outpost, jungle foliage, electric fence vista, paleontology field station",
    props: "field kits, binoculars, bone casts, muddy tracks, research tent",
  },
  farm: {
    scene: "pastoral farm landscape, barn and tractor, crop fields, morning haze",
    props: "hay bales, irrigation lines, wooden fence, distant hills",
  },
  newsroom: {
    scene: "busy newsroom / podcast studio, microphones, mixer, cameras, light panels",
    props: "sound-absorbing panels, laptop with waveforms, on-air lamp",
  },
  "autonomous-lab": {
    scene: "self-driving car lab, lidar rigs, test vehicle in garage bay, engineering benches",
    props: "sensor arrays, monitors with perception models, cones on test track",
  },
  "interior-studio": {
    scene: "interior design atelier, drafting table, fabric samples, material boards",
    props: "floor plans, color swatches, pendant lights, cozy ambience",
  },
  construction: {
    scene: "skyscraper construction site, tower cranes, scaffolding, rebar, concrete forms",
    props: "blueprints on table, hard hats, sunrise backlight dust motes",
  },
  "game-dev": {
    scene: "game development studio, multi-monitor setups, controllers, whiteboard with level map",
    props: "concept art prints, motion capture markers, dev notes",
  },
  "acoustics-lab": {
    scene: "acoustics / soundproof lab, anechoic wedges, microphones and SPL meters",
    props: "signal generator screen with waveforms, tripod stands",
  },
  "toy-studio": {
    scene: "toy design workshop, prototyping bench, 3D printer, paints and miniature parts",
    props: "sketches on wall, injection mold samples, safety cutting mats",
  },
  "planetary-lab": {
    scene: "planetary geology lab, rock core samples, microscope, Mars regolith simulant",
    props: "orbital maps, rover wheel track sample, warm lab lighting",
  },
  "sports-team": {
    scene: "professional sports management office, team tactics board, performance analytics screens",
    props: "team jerseys, strategy charts, fitness data, stadium model",
  },
  "generic-professional": {
    scene: "real-world professional environment relevant to the topic",
    props: "authentic tools and materials, subtle depth haze, natural light",
  },
};

export function inferKey(title: string): string {
  const t = title.toLowerCase();
  if (/(graphic|design|branding|logo|agency)/.test(t)) return "graphic-agency";
  if (/(dinosaur|safari|paleo|jurassic|prehistoric)/.test(t)) return "dinosaur-park";
  if (/(farm|ranch|agric|tractor|vertical farm)/.test(t)) return "farm";
  if (/(journal|news|investig|podcast|broadcast)/.test(t)) return "newsroom";
  if (/(self[-\s]?driving|autonom|vehicle|lidar|car)/.test(t)) return "autonomous-lab";
  if (/(interior|decor|furniture|architect)/.test(t)) return "interior-studio";
  if (/(skyscraper|construction|bridge|tower|build)/.test(t)) return "construction";
  if (/(game|studio|developer|gamedev)/.test(t)) return "game-dev";
  if (/(soundproof|acoustic|anechoic|audio lab)/.test(t)) return "acoustics-lab";
  if (/(toy|lego|playset|miniature)/.test(t)) return "toy-studio";
  if (/(planetary|geolog|mars|lunar|moon|asteroid)/.test(t)) return "planetary-lab";
  if (/(sports|team|manage|professional sports)/.test(t)) return "sports-team";
  return "generic-professional";
}

export function buildCinematicPrompt(title: string): string {
  const key = inferKey(title);
  const scene = SCENE_MAP[key] ?? SCENE_MAP["generic-professional"];
  return `${STYLE_PACK} — ${scene.scene} — ${scene.props} — mood: adventurous, inspiring — ${NEGATIVE}`;
}