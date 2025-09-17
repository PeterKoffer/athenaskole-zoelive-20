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

interface AdventureContext {
  setting: string;
  environment: string;
  keyElements: string;
  props: string;
  mathElements: string;
  communicationElements: string;
  scienceElements: string;
  scienceTools: string;
  outcomes: string;
}

function getAdventureContext(title: string, adventureId: string): AdventureContext {
  const titleLower = title.toLowerCase();
  const idLower = adventureId.toLowerCase();

  // Map specific adventures to contextual elements
  if (titleLower.includes('vertical farm') || idLower.includes('vertical-farm')) {
    return {
      setting: 'a modern vertical farming facility',
      environment: 'indoor hydroponic tower garden with LED grow lights',
      keyElements: 'stacked growing towers, LED panels, nutrient systems, fresh vegetables',
      props: 'hydroponic towers, grow lights, water pumps, pH meters, harvest baskets',
      mathElements: 'calculating nutrient ratios, measuring growth rates, computing crop yields',
      communicationElements: 'presenting farming techniques, explaining sustainable agriculture',
      scienceElements: 'monitoring plant growth, testing water pH, measuring light spectrums',
      scienceTools: 'pH meters, measuring cups, growth charts, LED light panels',
      outcomes: 'thriving vegetable towers, harvest displays, sustainability presentations'
    };
  }

  if (titleLower.includes('negotiation') || idLower.includes('negotiation')) {
    return {
      setting: 'a business negotiation workshop',
      environment: 'professional meeting room or classroom setup',
      keyElements: 'meeting tables, presentation boards, handshake moments, business materials',
      props: 'meeting tables, chairs, notebooks, presentation materials, name tags',
      mathElements: 'calculating deals, analyzing costs and benefits, working with percentages',
      communicationElements: 'practicing negotiation techniques, role-playing scenarios',
      scienceElements: 'studying behavioral patterns, analyzing decision-making processes',
      scienceTools: 'survey forms, analysis charts, observation sheets',
      outcomes: 'successful agreements, confident presentations, collaboration displays'
    };
  }

  if (titleLower.includes('toy line') || idLower.includes('toy') || titleLower.includes('design')) {
    return {
      setting: 'a toy design and manufacturing workshop',
      environment: 'creative design studio with prototyping materials',
      keyElements: 'toy prototypes, design sketches, colorful materials, craft supplies',
      props: 'craft materials, design tools, toy prototypes, sketch pads, markers',
      mathElements: 'calculating production costs, measuring dimensions, analyzing sales data',
      communicationElements: 'pitching toy concepts, creating marketing presentations',
      scienceElements: 'testing toy safety, studying materials, analyzing user feedback',
      scienceTools: 'measuring tools, safety equipment, testing materials',
      outcomes: 'finished toy prototypes, marketing displays, successful presentations'
    };
  }

  if (titleLower.includes('water rocket') || idLower.includes('rocket')) {
    return {
      setting: 'a rocket launch competition area',
      environment: 'outdoor launch field with safety equipment and measuring tools',
      keyElements: 'water rockets, launch pads, trajectory paths, measuring equipment',
      props: 'water rockets, launch pads, safety goggles, measuring tapes, water bottles',
      mathElements: 'calculating trajectory angles, measuring distances, analyzing flight data',
      communicationElements: 'explaining rocket designs, presenting flight results',
      scienceElements: 'studying aerodynamics, testing rocket designs, measuring flight performance',
      scienceTools: 'measuring tapes, stopwatches, angle finders, safety equipment',
      outcomes: 'successful rocket launches, flight data charts, winning designs'
    };
  }

  if (titleLower.includes('constitutional') || idLower.includes('constitution')) {
    return {
      setting: 'a historical constitutional convention',
      environment: 'colonial-style meeting hall with period furniture',
      keyElements: 'colonial architecture, founding documents, quill pens, historical furniture',
      props: 'wooden desks, quill pens, parchment, candles, colonial chairs',
      mathElements: 'analyzing voting systems, calculating representation, studying demographics',
      communicationElements: 'delivering speeches, debating issues, writing documents',
      scienceElements: 'studying historical methods, analyzing document preservation',
      scienceTools: 'magnifying glasses, historical documents, research materials',
      outcomes: 'completed documents, historical presentations, democratic agreements'
    };
  }

  // Default context for unknown adventures
  return {
    setting: `a learning adventure focused on ${title}`,
    environment: 'modern educational classroom or learning space',
    keyElements: 'educational materials, learning tools, collaborative workspace',
    props: 'learning materials, books, tools, presentation boards',
    mathElements: 'working with numbers, calculations, data analysis',
    communicationElements: 'presenting ideas, group discussions, collaborative work',
    scienceElements: 'conducting experiments, making observations, testing hypotheses',
    scienceTools: 'basic lab equipment, observation sheets, measuring tools',
    outcomes: 'completed projects, learning achievements, successful presentations'
  };
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

  // Generate adventure-specific context based on title and adventureId
  const adventureContext = getAdventureContext(title, adventureId);

  const phasePrompts = {
    cover: {
      subject: `${adventureContext.setting}, showing ${adventureContext.keyElements}`,
      setting: `${adventureContext.environment}, ${adventureContext.props}`,
      camera: "wide establishing, 35mm, eye-level, rule-of-thirds, shallow depth of field",
      light: "soft daylight, warm bounce, subtle rim light",
      color: "warm peach, mint green, teal accents",
      mood: "hopeful, inviting, educational"
    },
    math: {
      subject: `students working with mathematical concepts in ${adventureContext.setting}, ${adventureContext.mathElements}`,
      setting: `${adventureContext.environment} with mathematical tools: calculators, charts, measuring devices, ${adventureContext.props}`,
      camera: "medium-wide, 35mm, slight top-down angle, shallow DOF on math tools",
      light: "soft daylight shade, gentle ambient occlusion",
      color: "mint green, warm beige, tomato red accents",
      mood: "focused, analytical, optimistic"
    },
    language: {
      subject: `students practicing communication skills related to ${adventureContext.setting}, ${adventureContext.communicationElements}`,
      setting: `${adventureContext.environment} with presentation setup: blank poster boards, speaking area, ${adventureContext.props}`,
      camera: "medium shot, eye-level, 50mm look, shallow DOF on students",
      light: "soft indoor daylight or canopy shade",
      color: "peach, soft teal, sunflower yellow",
      mood: "confident, expressive, collaborative"
    },
    science: {
      subject: `students conducting scientific activities in ${adventureContext.setting}, ${adventureContext.scienceElements}`,
      setting: `${adventureContext.environment} with scientific equipment: ${adventureContext.scienceTools}, observation charts, ${adventureContext.props}`,
      camera: "medium-wide, 35mm, slightly low angle, clear focal point on scientific equipment",
      light: "cool indoor light with soft highlights",
      color: "cool blue, mint, stainless steel grey",
      mood: "curious, methodical, discovery-focused"
    },
    exit: {
      subject: `students presenting their completed ${adventureContext.setting} project, showing ${adventureContext.outcomes}`,
      setting: `${adventureContext.environment} with final presentations, completed projects, proud displays`,
      camera: "wide, 28–35mm, eye-level, slight vignette to focus on achievement",
      light: "warm afternoon light, gentle rim, soft shadows",
      color: "warm peach, mint, teal",
      mood: "proud, accomplished, successful"
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