
export interface CurriculumGame {
  id: string;
  title: string;
  description: string;
  subject: string;
  gradeLevel: number[];
  skillAreas: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  timeEstimate: string;
  learningObjectives: string[];
  gameType: 'simulation' | 'puzzle' | 'strategy' | 'adventure' | 'creativity' | 'quiz';
  emoji: string;
  rewards: {
    coins: number;
    badges: string[];
  };
  curriculumStandards: string[];
  status: 'available' | 'coming-soon' | 'beta';
  interactive: boolean;
}

export const curriculumGames: CurriculumGame[] = [
  // Mathematics Games
  {
    id: "viking-castle-geometry",
    title: "Viking Castle Builder",
    description: "Learn geometry, measurements, and area calculations by designing and building a Viking fortress!",
    subject: "Mathematics",
    gradeLevel: [4, 5, 6, 7],
    skillAreas: ["geometry", "measurement", "area_perimeter", "problem_solving"],
    difficulty: "intermediate",
    timeEstimate: "20-25 min",
    learningObjectives: [
      "Calculate area and perimeter of geometric shapes",
      "Apply geometric principles to real-world problems",
      "Understand scale and proportion"
    ],
    gameType: "simulation",
    emoji: "🏰",
    rewards: { coins: 60, badges: ["Math Viking", "Geometry Master"] },
    curriculumStandards: ["CCSS.MATH.4.MD", "CCSS.MATH.5.MD", "CCSS.MATH.6.G"],
    status: "available",
    interactive: true
  },
  {
    id: "fraction-bakery",
    title: "Viking Bakery Fractions",
    description: "Master fractions by baking bread and splitting meals for Viking warriors!",
    subject: "Mathematics",
    gradeLevel: [3, 4, 5],
    skillAreas: ["fractions", "division", "problem_solving"],
    difficulty: "beginner",
    timeEstimate: "15-20 min",
    learningObjectives: [
      "Understand fraction concepts",
      "Add and subtract fractions",
      "Apply fractions to real-world scenarios"
    ],
    gameType: "simulation",
    emoji: "🍞",
    rewards: { coins: 40, badges: ["Fraction Chef", "Viking Baker"] },
    curriculumStandards: ["CCSS.MATH.3.NF", "CCSS.MATH.4.NF"],
    status: "available",
    interactive: true
  },

  // English Language Arts Games
  {
    id: "word-hunt-ar",
    title: "AR Word Quest",
    description: "Use your device camera to find objects and build vocabulary with augmented reality!",
    subject: "English",
    gradeLevel: [2, 3, 4, 5],
    skillAreas: ["vocabulary", "spelling", "reading_comprehension"],
    difficulty: "beginner",
    timeEstimate: "10-15 min",
    learningObjectives: [
      "Expand vocabulary through visual association",
      "Practice spelling and word recognition",
      "Connect words to real-world objects"
    ],
    gameType: "adventure",
    emoji: "🔍",
    rewards: { coins: 35, badges: ["Word Hunter", "Vocabulary Explorer"] },
    curriculumStandards: ["CCSS.ELA-LITERACY.L.3.4", "CCSS.ELA-LITERACY.RF.4.3"],
    status: "available",
    interactive: true
  },
  {
    id: "story-builder",
    title: "Viking Saga Creator",
    description: "Write and illustrate your own Viking adventures while learning story structure!",
    subject: "English",
    gradeLevel: [4, 5, 6, 7],
    skillAreas: ["creative_writing", "story_structure", "grammar"],
    difficulty: "intermediate",
    timeEstimate: "25-30 min",
    learningObjectives: [
      "Understand story elements (plot, character, setting)",
      "Practice narrative writing skills",
      "Apply grammar and punctuation rules"
    ],
    gameType: "creativity",
    emoji: "📚",
    rewards: { coins: 55, badges: ["Story Teller", "Viking Scribe"] },
    curriculumStandards: ["CCSS.ELA-LITERACY.W.5.3", "CCSS.ELA-LITERACY.W.6.3"],
    status: "available",
    interactive: true
  },

  // Science Games
  {
    id: "windmill-engineer",
    title: "Renewable Energy Engineer",
    description: "Design and build windmills while learning about renewable energy and physics!",
    subject: "Science",
    gradeLevel: [5, 6, 7, 8],
    skillAreas: ["renewable_energy", "physics", "engineering_design"],
    difficulty: "advanced",
    timeEstimate: "30-35 min",
    learningObjectives: [
      "Understand principles of renewable energy",
      "Apply engineering design process",
      "Learn about force, motion, and energy transfer"
    ],
    gameType: "simulation",
    emoji: "🌪️",
    rewards: { coins: 80, badges: ["Green Engineer", "Wind Master"] },
    curriculumStandards: ["NGSS.5-ESS3-1", "NGSS.MS-ETS1-2"],
    status: "available",
    interactive: true
  },
  {
    id: "ecosystem-builder",
    title: "Viking Ecosystem Explorer",
    description: "Create balanced ecosystems and learn about food chains in Viking-era environments!",
    subject: "Science",
    gradeLevel: [4, 5, 6],
    skillAreas: ["ecosystems", "food_chains", "biodiversity"],
    difficulty: "intermediate",
    timeEstimate: "20-25 min",
    learningObjectives: [
      "Understand ecosystem relationships",
      "Learn about food chains and energy flow",
      "Explore biodiversity concepts"
    ],
    gameType: "simulation",
    emoji: "🌿",
    rewards: { coins: 50, badges: ["Ecosystem Guardian", "Nature Explorer"] },
    curriculumStandards: ["NGSS.5-LS2-1", "NGSS.MS-LS2-1"],
    status: "coming-soon",
    interactive: true
  },

  // Programming/Computer Science Games
  {
    id: "sandwich-coding",
    title: "Algorithm Sandwich Shop",
    description: "Learn programming logic and algorithms by creating step-by-step sandwich recipes!",
    subject: "Computer Science",
    gradeLevel: [3, 4, 5, 6],
    skillAreas: ["algorithms", "sequencing", "logical_thinking"],
    difficulty: "intermediate",
    timeEstimate: "20-25 min",
    learningObjectives: [
      "Understand algorithm and sequence concepts",
      "Practice logical step-by-step thinking",
      "Introduction to programming concepts"
    ],
    gameType: "puzzle",
    emoji: "🥪",
    rewards: { coins: 60, badges: ["Code Master", "Algorithm Chef"] },
    curriculumStandards: ["CSTA.1A-AP-10", "CSTA.1A-AP-11"],
    status: "available",
    interactive: true
  },

  // History Games
  {
    id: "viking-time-travel",
    title: "Viking Age Adventure",
    description: "Travel through time and help Harald Bluetooth solve historical challenges!",
    subject: "History",
    gradeLevel: [4, 5, 6, 7],
    skillAreas: ["viking_history", "problem_solving", "cultural_studies"],
    difficulty: "intermediate",
    timeEstimate: "25-30 min",
    learningObjectives: [
      "Learn about Viking culture and society",
      "Understand historical cause and effect",
      "Explore medieval European history"
    ],
    gameType: "adventure",
    emoji: "⚔️",
    rewards: { coins: 45, badges: ["Time Traveler", "Viking Scholar"] },
    curriculumStandards: ["NCSS.2", "NCSS.3"],
    status: "available",
    interactive: true
  },

  // Music Games
  {
    id: "carl-nielsen-composer",
    title: "Compose with Carl Nielsen",
    description: "Create beautiful melodies and learn music theory with Denmark's famous composer!",
    subject: "Music",
    gradeLevel: [3, 4, 5, 6, 7],
    skillAreas: ["music_theory", "composition", "rhythm"],
    difficulty: "intermediate",
    timeEstimate: "20-25 min",
    learningObjectives: [
      "Understand basic music theory concepts",
      "Practice rhythm and melody creation",
      "Learn about Danish musical heritage"
    ],
    gameType: "creativity",
    emoji: "🎵",
    rewards: { coins: 50, badges: ["Composer", "Music Theory Master"] },
    curriculumStandards: ["NAfME.MU:Cr1.1.5a", "NAfME.MU:Cr2.1.5a"],
    status: "available",
    interactive: true
  }
];

export const getGamesBySubject = (subject: string): CurriculumGame[] => {
  return curriculumGames.filter(game => 
    game.subject.toLowerCase() === subject.toLowerCase()
  );
};

export const getGamesByGradeLevel = (gradeLevel: number): CurriculumGame[] => {
  return curriculumGames.filter(game => 
    game.gradeLevel.includes(gradeLevel)
  );
};

export const getGamesBySkillArea = (skillArea: string): CurriculumGame[] => {
  return curriculumGames.filter(game => 
    game.skillAreas.some(skill => 
      skill.toLowerCase().includes(skillArea.toLowerCase())
    )
  );
};
