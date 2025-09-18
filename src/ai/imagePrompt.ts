export type ShotType = "establishing" | "action" | "character" | "group" | "closeup";
export type AspectKey = "cover16x9" | "card3x2" | "portrait3x4";

const ASPECT: Record<AspectKey, { size: string; phrase: string }> = {
  cover16x9:  { size: "1792x1024", phrase: "landscape 1792x1024, centered, full body visible, 12% negative space on right for UI, proper headroom and footroom" },
  card3x2:    { size: "1536x1024", phrase: "landscape 1536x1024, rule-of-thirds, safe margins" },
  portrait3x4:{ size: "1344x1792", phrase: "portrait 1344x1792, full body or medium shot, nothing cropped" },
};

const STYLE_SUFFIX =
  "NELIE Cinemagic v1.1 — cinematic toy-photorealistic 3D render, soft dreamy magical atmosphere, warm golden-hour lighting with gentle rim light, shallow depth of field, creamy bokeh, subtle volumetric light rays and dust motes, PBR materials with fine micro-roughness and subsurface scattering, pastel filmic color grading, slight bloom and vignette, professional composition, subject tack-sharp / background softly blurred, clean Pixar/Laika-inspired look, ultra-detailed textures, no text or watermark — NELIE Cinemagic v1.1.";

const HUMANS_ONLY =
  "All human subjects are school-age children or teenagers (6–16), age-appropriate clothing and proportions, inclusive and diverse mix of races and cultures, friendly and safe tone. No adults unless explicitly specified. No anthropomorphic animals, no mascots, no dolls or puppets.";

export const NEGATIVE =
  "blurry, noisy, low-res, harsh shadows, oversaturated, fisheye, extreme wide-angle distortion, motion blur, horror, gore, violence, creepy, sexualized, text, logo, watermark, cluttered background, jpeg artifacts, extra fingers/limbs, deformed hands, adults (unless specified), anthropomorphic animals, mascots, furries, dolls, puppets";

function lensFor(shot: ShotType) {
  switch (shot) {
    case "establishing": return "Camera: 35mm look without distortion, f/2.8, layered depth.";
    case "action":       return "Camera: 50mm, f/2.0, dynamic but subject sharp.";
    case "character":    return "Camera: 85mm prime, f/1.8, shallow depth, creamy bokeh.";
    case "group":        return "Camera: 50mm, f/2.8, multiple faces sharp, soft background.";
    case "closeup":      return "Camera: 100mm macro look, f/2.8, crisp textures.";
  }
}

export type AdventureImageParams = {
  adventureTitle: string;      // "Ost-Saturn missionen"
  sceneSummary?: string;       // valgfri 1-2 linjer
  shotType: ShotType;
  aspect: AspectKey;
  setting: string;             // miljø/location
  activity: string;            // hvad gør eleverne?
  mood?: string[];             // ["awe","cozy","playful"]
  uiSide?: "left" | "right" | "none";
  palette?: string[];          // ["warm wheat","forest green","pastel red"]
  characters?: string[];       // fx "two 10-year-old girls (Black & East Asian), one 12-year-old boy (Arab)"
  seedNote?: string;           // fx "series seed 12345"
};

export function buildAdventureImagePrompt(p: AdventureImageParams) {
  const a = ASPECT[p.aspect];
  const ui = p.uiSide && p.uiSide !== "none"
    ? `Clean negative space on ${p.uiSide} for UI,`
    : "Balanced framing,";

  const mood = p.mood?.length ? `Mood: ${p.mood.join(", ")}.` : "Mood: warm, safe, wonder.";
  const palette = p.palette?.length ? `Color palette: ${p.palette.join(", ")}.` : "";

  const cast = p.characters?.length
    ? p.characters.join("; ")
    : "A naturally diverse group of students (ages 6–16)";

  const core = [
    `${p.shotType} shot of ${cast}`,
    `doing ${p.activity} in ${p.setting}`,
    `for the adventure "${p.adventureTitle}".`,
  ].join(", ");

  const camera = lensFor(p.shotType);

  const prompt =
    `${core} ${mood} ${ui} ${camera} ` +
    `${a.phrase} ${palette} ` +
    `Lighting: warm golden hour key, soft rim light, gentle volumetric rays, soft contact shadows. ` +
    `${HUMANS_ONLY} ${STYLE_SUFFIX}`.trim();

  return { prompt, negative: NEGATIVE, meta: { size: a.size } };
}

// Legacy compatibility function for existing code
export function buildLegacyAdventurePrompt(title: string): string {
  const result = buildAdventureImagePrompt({
    adventureTitle: title,
    shotType: "establishing",
    aspect: "cover16x9",
    setting: "a professional real-world environment relevant to the adventure",
    activity: "working together exploring and learning",
    mood: ["awe", "wonder", "safe"],
    uiSide: "right"
  });
  return result.prompt;
}