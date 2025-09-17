export type Domain = "food-truck" | "vertical-farm" | "negotiation" | "water-rocket" | "toy-design" | "constitution";

export function domainProps(domain: Domain): string[] {
  switch (domain) {
    case "food-truck":
      return [
        "retro van with serving window", "griddle and prep counter", "condiment rack",
        "service bell", "festival bunting", "menu board blank",
        "fridge and sink unit", "LED string lights"
      ];
    case "vertical-farm":
      return [
        "stacked hydroponic towers", "LED grow panels", "nutrient reservoir",
        "pH meter", "water pumps", "seedling trays", "mist nozzles",
        "harvest crates"
      ];
    case "negotiation":
      return [
        "round meeting table", "glass wall reflections", "neutral backdrop",
        "notepads (blank)", "coffee cups", "soft acoustic panels", "tablet devices"
      ];
    case "water-rocket":
      return [
        "PVC launch rig", "hand pump", "parachute chute", "safety cones",
        "stopwatch", "clipboard (blank)", "open field with launch markers",
        "spectators at safe distance"
      ];
    case "toy-design":
      return [
        "design studio workspace", "colorful toy prototypes", "sketch pads", "craft materials",
        "3D printer", "modeling clay", "design tools", "creative supplies"
      ];
    case "constitution":
      return [
        "colonial meeting hall", "wooden podium", "historical documents", "quill pens",
        "period furniture", "democratic assembly", "voting box", "colonial architecture"
      ];
  }
}

export function getDomainFromTitle(title: string): Domain {
  const titleLower = title.toLowerCase();
  
  if (titleLower.includes('vertical farm') || titleLower.includes('hydroponic')) {
    return 'vertical-farm';
  }
  if (titleLower.includes('negotiation') || titleLower.includes('business')) {
    return 'negotiation';
  }
  if (titleLower.includes('toy') || titleLower.includes('design')) {
    return 'toy-design';
  }
  if (titleLower.includes('rocket') || titleLower.includes('launch')) {
    return 'water-rocket';
  }
  if (titleLower.includes('constitution') || titleLower.includes('democratic')) {
    return 'constitution';
  }
  if (titleLower.includes('food') || titleLower.includes('truck')) {
    return 'food-truck';
  }
  
  // Default fallback
  return 'vertical-farm';
}