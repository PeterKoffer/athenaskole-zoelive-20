
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
  }
];
