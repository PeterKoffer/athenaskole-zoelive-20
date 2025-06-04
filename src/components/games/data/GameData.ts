
import { CurriculumGame } from '../types/GameTypes';

export const curriculumGames: CurriculumGame[] = [
  {
    id: "math-addition-castle",
    title: "Addition Castle Quest",
    description: "Help the brave knight solve addition problems to unlock castle doors and rescue the princess!",
    emoji: "🏰",
    subject: "Mathematics",
    gradeLevel: [1, 2, 3],
    difficulty: "beginner",
    interactionType: "click-sequence",
    timeEstimate: "15-20 min",
    skillAreas: ["basic_addition", "number_recognition", "problem_solving"],
    learningObjectives: [
      "Master single-digit addition",
      "Understand number relationships",
      "Apply addition in story contexts"
    ],
    status: "available",
    rewards: {
      coins: 150,
      badges: ["Math Explorer", "Castle Defender"]
    }
  },
  {
    id: "reading-adventure-forest",
    title: "Reading Adventure Forest",
    description: "Journey through an enchanted forest by reading comprehension passages and solving word puzzles!",
    emoji: "📚",
    subject: "English",
    gradeLevel: [2, 3, 4],
    difficulty: "beginner",
    interactionType: "multiple-choice",
    timeEstimate: "20-25 min",
    skillAreas: ["reading_comprehension", "vocabulary", "inference"],
    learningObjectives: [
      "Improve reading fluency",
      "Build vocabulary knowledge", 
      "Practice comprehension strategies"
    ],
    status: "available",
    rewards: {
      coins: 200,
      badges: ["Book Worm", "Forest Explorer"]
    }
  },
  {
    id: "coding-robot-challenge",
    title: "Robot Programming Challenge",
    description: "Program your robot companion to navigate mazes and solve puzzles using basic coding concepts!",
    emoji: "🤖",
    subject: "Computer Science",
    gradeLevel: [3, 4, 5, 6],
    difficulty: "intermediate",
    interactionType: "drag-drop",
    timeEstimate: "25-30 min",
    skillAreas: ["basic_programming", "logical_thinking", "sequencing"],
    learningObjectives: [
      "Understand programming sequences",
      "Practice logical problem solving",
      "Learn basic coding concepts"
    ],
    status: "available",
    rewards: {
      coins: 250,
      badges: ["Code Master", "Robot Engineer"]
    }
  },
  {
    id: "algorithm-puzzle-palace",
    title: "Algorithm Puzzle Palace",
    description: "Solve algorithmic puzzles and optimize solutions in this strategy-based computer science adventure!",
    emoji: "🧩",
    subject: "Computer Science",
    gradeLevel: [5, 6, 7, 8],
    difficulty: "intermediate",
    interactionType: "strategy",
    timeEstimate: "30-35 min",
    skillAreas: ["algorithms", "optimization", "problem_solving"],
    learningObjectives: [
      "Understand algorithm efficiency",
      "Practice problem decomposition",
      "Learn optimization strategies"
    ],
    status: "available",
    rewards: {
      coins: 280,
      badges: ["Algorithm Master", "Puzzle Solver"]
    }
  },
  {
    id: "binary-adventure-quest",
    title: "Binary Adventure Quest",
    description: "Explore the digital world by converting between binary and decimal in this interactive journey!",
    emoji: "0️⃣1️⃣",
    subject: "Computer Science",
    gradeLevel: [4, 5, 6, 7],
    difficulty: "beginner",
    interactionType: "puzzle",
    timeEstimate: "20-25 min",
    skillAreas: ["binary_systems", "number_conversion", "digital_literacy"],
    learningObjectives: [
      "Understand binary number system",
      "Convert between binary and decimal",
      "Explore digital representation"
    ],
    status: "available",
    rewards: {
      coins: 200,
      badges: ["Binary Explorer", "Digital Pioneer"]
    }
  },
  {
    id: "data-structure-builder",
    title: "Data Structure Builder",
    description: "Build and manipulate data structures like arrays, stacks, and queues through visual challenges!",
    emoji: "📊",
    subject: "Computer Science",
    gradeLevel: [6, 7, 8],
    difficulty: "intermediate",
    interactionType: "drag-drop",
    timeEstimate: "25-30 min",
    skillAreas: ["data_structures", "arrays", "stacks", "queues"],
    learningObjectives: [
      "Understand basic data structures",
      "Practice data organization",
      "Learn structure operations"
    ],
    status: "available",
    rewards: {
      coins: 260,
      badges: ["Data Architect", "Structure Master"]
    }
  },
  {
    id: "ai-pattern-detective",
    title: "AI Pattern Detective",
    description: "Train AI models to recognize patterns and solve puzzles in this introduction to machine learning!",
    emoji: "🕵️",
    subject: "Computer Science",
    gradeLevel: [6, 7, 8],
    difficulty: "advanced",
    interactionType: "strategy",
    timeEstimate: "35-40 min",
    skillAreas: ["pattern_recognition", "machine_learning_basics", "data_analysis"],
    learningObjectives: [
      "Understand pattern recognition",
      "Learn basic ML concepts",
      "Practice data analysis"
    ],
    status: "beta",
    rewards: {
      coins: 350,
      badges: ["AI Detective", "Pattern Master"]
    }
  },
  {
    id: "cybersecurity-defender",
    title: "Cybersecurity Defender",
    description: "Protect digital systems from cyber threats while learning about online safety and security!",
    emoji: "🛡️",
    subject: "Computer Science",
    gradeLevel: [5, 6, 7, 8],
    difficulty: "intermediate",
    interactionType: "strategy",
    timeEstimate: "30-35 min",
    skillAreas: ["cybersecurity", "digital_safety", "encryption"],
    learningObjectives: [
      "Learn cybersecurity basics",
      "Understand digital threats",
      "Practice security measures"
    ],
    status: "available",
    rewards: {
      coins: 300,
      badges: ["Cyber Guardian", "Security Expert"]
    }
  },
  {
    id: "web-design-studio",
    title: "Web Design Studio",
    description: "Create and design websites using HTML, CSS, and basic web development principles!",
    emoji: "🎨",
    subject: "Computer Science",
    gradeLevel: [4, 5, 6, 7],
    difficulty: "beginner",
    interactionType: "drawing",
    timeEstimate: "25-30 min",
    skillAreas: ["web_development", "html", "css", "design"],
    learningObjectives: [
      "Learn basic HTML structure",
      "Understand CSS styling",
      "Practice web design principles"
    ],
    status: "available",
    rewards: {
      coins: 240,
      badges: ["Web Designer", "HTML Hero"]
    }
  },
  {
    id: "logic-gate-laboratory",
    title: "Logic Gate Laboratory",
    description: "Experiment with digital logic gates and circuits in this hands-on simulation experience!",
    emoji: "⚡",
    subject: "Computer Science",
    gradeLevel: [6, 7, 8],
    difficulty: "intermediate",
    interactionType: "simulation",
    timeEstimate: "30-35 min",
    skillAreas: ["logic_gates", "digital_circuits", "boolean_logic"],
    learningObjectives: [
      "Understand logic gates",
      "Practice circuit design",
      "Learn boolean operations"
    ],
    status: "available",
    rewards: {
      coins: 290,
      badges: ["Logic Master", "Circuit Designer"]
    }
  },
  {
    id: "science-lab-experiments",
    title: "Virtual Science Lab",
    description: "Conduct safe virtual experiments and learn about scientific methods and principles!",
    emoji: "🔬",
    subject: "Science",
    gradeLevel: [4, 5, 6],
    difficulty: "intermediate",
    interactionType: "simulation",
    timeEstimate: "30-35 min",
    skillAreas: ["scientific_method", "observation", "hypothesis_testing"],
    learningObjectives: [
      "Learn scientific method steps",
      "Practice making observations",
      "Test hypotheses safely"
    ],
    status: "beta",
    rewards: {
      coins: 300,
      badges: ["Young Scientist", "Lab Expert"]
    }
  },
  {
    id: "history-time-travel",
    title: "Time Travel Chronicles",
    description: "Travel through different historical periods and learn about important events and figures!",
    emoji: "⏰",
    subject: "History",
    gradeLevel: [5, 6, 7, 8],
    difficulty: "intermediate",
    interactionType: "multiple-choice",
    timeEstimate: "25-30 min",
    skillAreas: ["historical_knowledge", "chronological_thinking", "cause_and_effect"],
    learningObjectives: [
      "Understand historical chronology",
      "Learn about key historical figures",
      "Analyze cause and effect relationships"
    ],
    status: "available",
    rewards: {
      coins: 275,
      badges: ["Time Traveler", "History Scholar"]
    }
  },
  {
    id: "music-rhythm-maker",
    title: "Rhythm Maker Studio",
    description: "Create your own musical compositions while learning about rhythm, melody, and musical notation!",
    emoji: "🎵",
    subject: "Music",
    gradeLevel: [2, 3, 4, 5],
    difficulty: "beginner",
    interactionType: "drawing",
    timeEstimate: "20-25 min",
    skillAreas: ["rhythm_recognition", "musical_notation", "creativity"],
    learningObjectives: [
      "Understand basic rhythm patterns",
      "Learn musical notation basics",
      "Express creativity through music"
    ],
    status: "coming-soon",
    rewards: {
      coins: 180,
      badges: ["Music Maker", "Rhythm Master"]
    }
  },
  {
    id: "geometry-shape-builder",
    title: "Geometry Shape Builder",
    description: "Build and explore geometric shapes while learning about their properties and relationships!",
    emoji: "📐",
    subject: "Mathematics",
    gradeLevel: [4, 5, 6],
    difficulty: "intermediate",
    interactionType: "drag-drop",
    timeEstimate: "20-25 min",
    skillAreas: ["geometric_shapes", "spatial_reasoning", "measurement"],
    learningObjectives: [
      "Identify geometric shapes",
      "Understand shape properties",
      "Practice spatial reasoning"
    ],
    status: "available",
    rewards: {
      coins: 220,
      badges: ["Shape Master", "Geometry Expert"]
    }
  }
];
