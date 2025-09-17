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
  // Use the new cinematic prompt engine
  try {
    const { buildImagePrompts } = require('./imagePromptEngine');
    const { getDomainFromTitle } = require('../config/propsBanks');
    
    const domain = getDomainFromTitle(title);
    const role = phaseType === "cover" ? "cover" : "phase";
    
    // Create phase-specific subject lines
    let subjectLine = subject;
    if (!subjectLine) {
      const configs: Record<string, string> = {
        math: `students solving mathematical challenges in ${title} adventure context`,
        language: `students engaging in storytelling and communication during ${title} activities`,
        science: `students conducting scientific experiments related to ${title}`,
        exit: `students celebrating successful completion of ${title} adventure`,
        cover: `students beginning their exciting ${title} learning adventure`
      };
      subjectLine = configs[phaseType] || configs.cover;
    }
    
    const prompts = buildImagePrompts(role, {
      adventureId,
      phaseId: `${phaseType}_${phaseIndex}`,
      domain,
      title,
      subjectLine,
      stylePackId: "cinematic-stylized-realism",
      realismBlend: 0.85,
      consistencyTag: `NELIE-cin-real-01 ${domain}`,
      avoid: ["classroom", "readable text", "grade signs", "brand logos"],
      variantSalt: phaseIndex
    });
    
    return {
      prompt: prompts[0].prompt,
      negativePrompt: prompts[0].negative,
      seed: parseInt(prompts[0].seed)
    };
    
  } catch (error) {
    console.warn('Falling back to legacy prompt system:', error);
    
    // Fallback to enhanced legacy system with cinematic elements
    const adventureContext = getAdventureContext(title, adventureId);
    const consistency = `NELIE-cin-real-01 ${adventureId.replace(/[^a-z0-9]/gi, '-')}`;
    const seed = seedFromId(adventureId, phaseIndex);
    
    const cinematicPhasePrompts = {
      cover: {
        subject: `cinematic establishing shot of ${adventureContext.setting}, showing ${adventureContext.keyElements}`,
        setting: `${adventureContext.environment}, ${adventureContext.props}`,
        camera: "wide establishing, 35mm anamorphic, eye-level, gentle parallax",
        light: "golden hour backlight, soft rim, warm bounce",
        color: "teal & warm amber cinematic grade",
        mood: "hopeful, inviting, educational"
      },
      math: {
        subject: `cinematic shot of students working with mathematical concepts in ${adventureContext.setting}, ${adventureContext.mathElements}`,
        setting: `${adventureContext.environment} with mathematical tools and ${adventureContext.props}`,
        camera: "midshot, 50mm, slight 3/4 angle, portrait depth",
        light: "bright overcast, giant softbox feel, clean color",
        color: "butter yellow, forest green, sky blue",
        mood: "focused, analytical, confident"
      },
      language: {
        subject: `cinematic shot of students practicing communication in ${adventureContext.setting}, ${adventureContext.communicationElements}`,
        setting: `${adventureContext.environment} with presentation setup and ${adventureContext.props}`,
        camera: "over-the-shoulder learner POV, 50mm, shallow depth of field",
        light: "indoor practicals + soft fill, gentle roll-off",
        color: "coral, seafoam, lilac accents",
        mood: "expressive, communicative, creative"
      },
      science: {
        subject: `cinematic shot of students conducting scientific activities in ${adventureContext.setting}, ${adventureContext.scienceElements}`,
        setting: `${adventureContext.environment} with scientific equipment: ${adventureContext.scienceTools}, ${adventureContext.props}`,
        camera: "close-up macro on hands/tools, creamy bokeh",
        light: "cool daylight through windows, volumetric shafts",
        color: "terracotta, sage, powder blue",
        mood: "curious, investigative, discovery-focused"
      },
      exit: {
        subject: `cinematic shot of students presenting completed ${adventureContext.setting} project, showing ${adventureContext.outcomes}`,
        setting: `${adventureContext.environment} with final presentations and completed projects`,
        camera: "low-angle hero shot, 28mm, subtle perspective stretch",
        light: "even diffuse light, studio-like, controlled speculars",
        color: "deep navy, saffron, mint highlights",
        mood: "accomplished, proud, successful"
      }
    };

    const config = cinematicPhasePrompts[phaseType];
    
    // Build cinematic prompt manually
    const cinematicPrompt = [
      "cinematic stylized realism",
      "high-end animation film aesthetic",
      "soft PBR materials",
      "depth-of-field bokeh",
      config.subject,
      config.setting,
      config.camera,
      config.light,
      config.color,
      config.mood,
      "age-appropriate, wholesome",
      "no text overlay, no brand logos",
      `CONSISTENCY_TAG: ${consistency}`
    ].join(" — ");
    
    return {
      prompt: cinematicPrompt,
      negativePrompt: NEGATIVE_PROMPT,
      seed
    };
  }
}