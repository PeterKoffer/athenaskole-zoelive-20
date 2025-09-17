export type StylePack = {
  id: string;
  base: string[];      // faste stilord
  accents: string[];   // små variationer
  safety: string[];    // skole- og UI-sikkerhed
};

// Brand-profiler: behold kidbook som fallback, tilføj cinematic
export const STYLE_PACKS: StylePack[] = [
  {
    id: "kidbook-gouache",
    base: [
      "children's storybook illustration", "soft gouache texture", "clean shapes",
      "gentle outlines", "subtle shading", "age-appropriate", "wholesome"
    ],
    accents: [
      "hand-painted paper grain", "pastel chalk accents", "watercolor edge blooms",
      "paper cutout feel", "soft vignette"
    ],
    safety: ["no text overlay", "no logos", "no watermark"]
  },
  {
    id: "cinematic-stylized-realism",
    base: [
      "cinematic stylized realism", "high-end animation film aesthetic",
      "soft PBR materials", "natural micro-texture", "filmic tone-mapping",
      "depth-of-field bokeh", "physically-plausible lighting"
    ],
    accents: [
      "volumetric god rays", "subtle film grain", "gentle bloom highlights",
      "rim light on key subjects", "wide dynamic range", "s-curve contrast"
    ],
    safety: [
      "age-appropriate", "wholesome", "no gore", "no horror",
      "no text overlay", "no brand logos", "no watermark"
    ]
  }
];