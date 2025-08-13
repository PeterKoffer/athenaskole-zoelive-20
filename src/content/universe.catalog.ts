// src/content/universe.catalog.ts
import { UniversePack, UniverseCategory, CanonicalSubject, BeatBlueprint, GradeBand, BeatKind } from "./types";

// -------------------------------
// 200 TITLES (your list)
// -------------------------------

const C1_Entrepreneurship: string[] = [
  "Launch a Food Truck",
  "Open a Themed Cafe",
  "Manage a Professional Sports Team",
  "Run a Record Label",
  "Start a Clothing Brand",
  "Develop a Video Game Studio",
  "Run a Pet Adoption Agency",
  "Launch a Tech Startup",
  "Manage a Movie Theater",
  "Create a Subscription Box Service",
  "Run an Eco-Tourism Agency",
  "Design and Sell a Toy Line",
  "Manage a Farm or Ranch",
  "Start a Tech Repair Shop",
  "Become a Real Estate Developer",
  "Launch a Graphic Design Agency",
  "Run a Landscaping Business",
  "Open a Bookstore",
  "Create a Board Game",
  "Manage a Hotel",
  "Start a Podcast Network",
  "Run a Car Customization Shop",
  "Launch a Courier Service",
  "Create a Custom Sneaker Brand",
  "Manage an Art Gallery",
  "Start a Tutoring Center",
  "Run an Antique Shop",
  "Open a Bakery",
  "Create a Mobile App for a Social Cause",
  "Plan and Execute a Major Music Festival",
];

const C2_Science: string[] = [
  "Mission to Mars",
  "Deep Sea Submarine Expedition",
  "Dinosaur Safari Park",
  "Volcano Response Team",
  "Build a Lunar Base",
  "Storm Chasers",
  "Amazon Rainforest Research Outpost",
  "Solve a Medical Mystery",
  "Journey to the Center of the Earth",
  "Design a Satellite Network",
  "Antarctic Ice Core Mission",
  "The Human Body Voyage",
  "Genetic Engineering Lab",
  "Asteroid Mining Operation",
  "Run a Natural History Museum",
  "Forensic Science Investigation",
  "Build a Particle Accelerator",
  "Explore an Alien World",
  "Manage a National Park",
  "The Weather Machine",
  "Bio-Dome Designer",
  "Time-Travel Safari",
  "The Search for Planet X",
  "Run a Seismology Lab",
  "The Coral Reef Restoration Project",
  "Mastering the Elements",
  "The Physics of Superheroes",
  "Build a Fusion Reactor",
  "The Beekeeper's Challenge",
  "The Archaeologist's Quest",
  "Space Telescope Operator",
  "The Water Cycle Adventure",
  "Animal Migration Trackers",
  "The Sound Lab",
  "Light and Optics Puzzles",
  "The Renewable Energy Challenge",
  "The Invasive Species Task Force",
  "The Planetary Geologist",
  "The Human Genome Project",
  "The Terraforming Project",
];

const C3_Arts: string[] = [
  "Direct a Short Animated Film",
  "Produce a Podcast Series",
  "Create a Comic Book or Graphic Novel",
  "Launch a Virtual Band",
  "Design a Video Game Level",
  "Become a Photojournalist",
  "Write and Illustrate a Children's Book",
  "Build a World for a Fantasy Novel",
  "Host a TV Cooking Show",
  "Design a Broadway Show",
  "Create a Viral Social Media Challenge",
  "Become a Digital Architect",
  "Launch a Fashion Magazine",
  "Compose a Film Score",
  "Create a Stop-Motion Animation",
  "Design a Brand Identity",
  "Curate a Digital Art Exhibition",
  "Become a VJ (Video Jockey)",
  "Write a \"Choose Your Own Adventure\" Story",
  "The Mural Project",
  "The Poetry Slam",
  "The Documentary Crew",
  "The Ad Agency",
  "The Foley Artist",
  "The Typeface Designer",
  "The Interior Designer",
  "The Puppet Master",
  "The Infographic Animator",
  "The Album Art Creator",
  "The Theatrical Lighting Designer",
];

const C4_Civics: string[] = [
  "Run for Mayor of a Virtual City",
  "Design a New Law",
  "Launch a Non-Profit Organization",
  "Organize a Community Service Project",
  "The Mock Trial",
  "The Diplomat",
  "Build an Accessible Community Park",
  "The Investigative Journalist",
  "Create a Public Health Campaign",
  "The Community Garden Project",
  "Mediate a Conflict",
  "The Historical Preservation Society",
  "Design a Memorial or Monument",
  "The Ethical AI Committee",
  "Run a Polling and Data Analytics Firm",
  "The Disaster Relief Coordinator",
  "Create a \"Good Trouble\" Social Movement",
  "The City Planner",
  "The National Budget Challenge",
  "The Constitutional Convention",
  "The Animal Rights Advocate",
  "The Digital Citizenship Ambassador",
  "The Cultural Exchange Program",
  "The Fair Trade Marketplace",
  "The Public Transportation Redesign",
  "The Oral History Project",
  "The Voter Registration Drive",
  "The Free Library Initiative",
  "The Anti-Bullying Campaign",
  "The Global Peace Summit",
];

const C5_Engineering: string[] = [
  "Design and Build a Rollercoaster",
  "The Rube Goldberg Machine Challenge",
  "The Bridge Builder",
  "Robotics Competition",
  "The Skyscraper Challenge",
  "Create a \"Smart Home\"",
  "The Egg Drop Experiment",
  "Build a Custom Computer",
  "The Shipwreck Survivor",
  "Design a Water Park",
  "The Trebuchet Challenge",
  "Automate a Factory",
  "The Wind-Powered Car",
  "The Soundproof Room",
  "The Mars Rover Design",
  "The Prosthetic Limb Project",
  "The Vertical Farm",
  "The Escape Room Designer",
  "The Drone Delivery System",
  "The Green Building Challenge",
  "The Submersible Design",
  "The Hovercraft Race",
  "The Automated Mini-Golf Course",
  "The Kinetic Sculpture",
  "The Water Rocket Competition",
  "The Earthquake Simulator",
  "The Solar-Powered Oven",
  "The Hydraulic Crane",
  "The Maglev Train",
  "The Wearable Tech Project",
  "The Amphibious Vehicle",
  "The Codebreaker's Machine",
  "The Domino Topple",
  "The Paper Airplane Challenge",
  "The Self-Driving Car AI",
  "The Miniature City",
  "The Musical Instrument Maker",
  "The Personal Flight Device",
  "The Automated Greenhouse",
  "The Recycled Art Bot",
];

const C6_LifeSkills: string[] = [
  "The First Car Purchase",
  "The College Application Journey",
  "The Personal Budget Challenge",
  "Plan a Trip Around the World",
  "The Healthy Habits Challenge",
  "The Home Renovation Project",
  "The Stock Market Game",
  "The Mindful Life",
  "The Career Explorer",
  "The Apartment Hunt",
  "The DIY Project",
  "The Meal Planning Master",
  "The Public Speaking Challenge",
  "The Digital Detox",
  "The First Aid Simulator",
  "The Time Management Expert",
  "The Credit Score Simulator",
  "The Job Interview",
  "The \"Adulting\" Simulation",
  "The Philanthropist",
  "The Taxpayer",
  "The Home Chef",
  "The Car Maintenance Basics",
  "The Retirement Planner",
  "The Negotiation Game",
  "The Digital Portfolio",
  "The Event Planner",
  "The Critical Thinker's Gauntlet",
  "The Language of Leadership",
  "The Lifelong Learner",
];

// -------------------------------
// Helpers: subject inference, tags, props, image prompt
// -------------------------------

const catToSubject: Record<UniverseCategory, CanonicalSubject> = {
  "Entrepreneurship & Business": "Life Skills",
  "Science & Exploration": "Science",
  "Creative Arts & Media Production": "Arts",
  "Civics, Community & Social Good": "Civics",
  "Engineering & Hands-On Design": "Technology",
  "Personal Growth & Life Skills": "Life Skills",
};

const crossByCategory: Record<UniverseCategory, CanonicalSubject[]> = {
  "Entrepreneurship & Business": ["Mathematics", "English", "Technology"],
  "Science & Exploration": ["Mathematics", "Technology", "English"],
  "Creative Arts & Media Production": ["English", "Technology", "Music"],
  "Civics, Community & Social Good": ["English", "Social Studies", "Technology"],
  "Engineering & Hands-On Design": ["Mathematics", "Science", "Computer Science"],
  "Personal Growth & Life Skills": ["Mathematics", "English", "Technology"],
};

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function defaultPropsFor(_title: string, category: UniverseCategory): string[] {
  switch (category) {
    case "Entrepreneurship & Business":
      return ["budget sheet", "price list", "customer queue", "poster", "POS receipt"];
    case "Science & Exploration":
      return ["field log", "map grid", "sensor readout", "specimen tray", "lab notebook"];
    case "Creative Arts & Media Production":
      return ["storyboard", "style guide", "shot list", "audio track", "mood board"];
    case "Civics, Community & Social Good":
      return ["council agenda", "petition", "map overlay", "survey chart", "press release"];
    case "Engineering & Hands-On Design":
      return ["blueprint", "parts list", "test rig", "force diagram", "build checklist"];
    case "Personal Growth & Life Skills":
      return ["planner", "budget", "habit tracker", "checklist", "goal sheet"];
  }
}

function defaultTags(title: string, category: UniverseCategory): string[] {
  const t = title.toLowerCase();
  const base = ["daily-life", "hands-on"];
  if (t.includes("food") || t.includes("cafe") || t.includes("bakery")) base.push("cooking");
  if (t.includes("sports")) base.push("sports");
  if (t.includes("robot") || t.includes("ai")) base.push("robots");
  if (t.includes("music") || t.includes("band")) base.push("music");
  if (t.includes("car") || t.includes("vehicle") || t.includes("hovercraft")) base.push("cars");
  if (category === "Science & Exploration") base.push("science");
  if (category === "Engineering & Hands-On Design") base.push("engineering");
  if (category === "Civics, Community & Social Good") base.push("civics");
  if (category === "Creative Arts & Media Production") base.push("art");
  return base;
}

function imagePromptFor(title: string, category: UniverseCategory) {
  return `Child-safe, text-free illustration for "${title}" in category ${category}. Bright, educational, tangible props, realistic daily-life setting.`;
}

// minutes per beat by grade (we'll auto-scale to fit lesson duration later)
const M: Record<GradeBand, number[]> = {
  "K-2":    [8, 10, 8, 7, 10, 5, 5],     // ~53 min baseline
  "3-5":    [10, 12, 10, 9, 12, 7, 8],   // ~68
  "6-8":    [12, 14, 12, 10, 14, 8, 10], // ~80
  "9-10":   [12, 16, 14, 12, 16, 10, 10],// ~90
  "11-12":  [12, 18, 16, 12, 18, 10, 12] // ~98
};

const BEAT_ORDER: BeatKind[] = [
  "visual_hook", "make_something", "investigate", "practice", "apply", "reflect", "present"
];

function beatsFor(category: UniverseCategory, title: string): Record<GradeBand, BeatBlueprint[]> {
  const props = defaultPropsFor(title, category);
  const tags = defaultTags(title, category);

  const subjectBias = catToSubject[category];
  const gameMaybe = title.toLowerCase().includes("math") || category === "Engineering & Hands-On Design";

  const makeBeats = (_gb: GradeBand): BeatBlueprint[] =>
    BEAT_ORDER.map((kind, i) => ({
      id: `${kind}-${i+1}`,
      kind,
      title:
        kind === "visual_hook" ? `Kickoff: Visualize "${title}"` :
        kind === "make_something" ? `Make: a concrete asset for "${title}"` :
        kind === "investigate" ? `Investigate: data or constraints in "${title}"` :
        kind === "practice" ? `Practice: quick checks related to "${title}"` :
        kind === "apply" ? `Apply: solve a real constraint in "${title}"` :
        kind === "reflect" ? `Reflect: what worked in "${title}"` :
        `Present: share your outcome for "${title}"`,
      minutes: {
        "K-2":   M["K-2"][i],
        "3-5":   M["3-5"][i],
        "6-8":   M["6-8"][i],
        "9-10":  M["9-10"][i],
        "11-12": M["11-12"][i],
      },
      tags,
      props,
      subjectBias,
      ...(kind === "practice" && gameMaybe ? { gameId: "fast-facts", gameParams: { seconds: 90 } } : {})
    }));

  return {
    "K-2":   makeBeats("K-2"),
    "3-5":   makeBeats("3-5"),
    "6-8":   makeBeats("6-8"),
    "9-10":  makeBeats("9-10"),
    "11-12": makeBeats("11-12"),
  };
}

// -------------------------------
// Scaffolder
// -------------------------------

function scaffoldOne(title: string, category: UniverseCategory): UniversePack {
  return {
    id: slugify(title),
    title,
    category,
    subjectHint: catToSubject[category],
    crossSubjects: crossByCategory[category],
    tags: defaultTags(title, category),
    imagePrompt: imagePromptFor(title, category),
    beats: beatsFor(category, title),
  };
}

export const UniversePacks: UniversePack[] = [
  ...C1_Entrepreneurship.map(t => scaffoldOne(t, "Entrepreneurship & Business")),
  ...C2_Science.map(t => scaffoldOne(t, "Science & Exploration")),
  ...C3_Arts.map(t => scaffoldOne(t, "Creative Arts & Media Production")),
  ...C4_Civics.map(t => scaffoldOne(t, "Civics, Community & Social Good")),
  ...C5_Engineering.map(t => scaffoldOne(t, "Engineering & Hands-On Design")),
  ...C6_LifeSkills.map(t => scaffoldOne(t, "Personal Growth & Life Skills")),
];

// Pick a solid "Prime 100" (simple heuristic: variety across categories)
export const Prime100: UniversePack[] = (() => {
  const byCat: Record<UniverseCategory, UniversePack[]> = {
    "Entrepreneurship & Business": [],
    "Science & Exploration": [],
    "Creative Arts & Media Production": [],
    "Civics, Community & Social Good": [],
    "Engineering & Hands-On Design": [],
    "Personal Growth & Life Skills": [],
  };
  for (const p of UniversePacks) byCat[p.category].push(p);

  // proportional take (30/40/30/30/40/30 → scale to 100)
  const picks: UniversePack[] = [];
  const target: Record<UniverseCategory, number> = {
    "Entrepreneurship & Business": 15,
    "Science & Exploration": 20,
    "Creative Arts & Media Production": 15,
    "Civics, Community & Social Good": 15,
    "Engineering & Hands-On Design": 20,
    "Personal Growth & Life Skills": 15,
  };
  (Object.keys(byCat) as UniverseCategory[]).forEach(cat => {
    const arr = byCat[cat];
    for (let i = 0; i < target[cat] && i < arr.length; i++) picks.push(arr[i]);
  });
  return picks;
})();

export const Fallback100: UniversePack[] = UniversePacks.filter(p => !Prime100.find(q => q.id === p.id));