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
  },

  // NEW KHAN ACADEMY-STYLE GAMES FOR K-12

  // Elementary Mathematics (Grades 1-5)
  {
    id: "counting-kingdom",
    title: "Counting Kingdom",
    description: "Learn to count, add, and subtract in this magical number kingdom adventure!",
    emoji: "👑",
    subject: "Mathematics",
    gradeLevel: [1, 2],
    difficulty: "beginner",
    interactionType: "click-sequence",
    timeEstimate: "15-20 min",
    skillAreas: ["counting", "basic_addition", "basic_subtraction", "number_recognition"],
    learningObjectives: [
      "Count objects from 1-100",
      "Understand number order",
      "Basic addition within 20"
    ],
    status: "available",
    rewards: {
      coins: 120,
      badges: ["Count Master", "Number Explorer"]
    }
  },
  {
    id: "multiplication-mission",
    title: "Multiplication Mission",
    description: "Master multiplication tables through exciting space missions and alien encounters!",
    emoji: "🚀",
    subject: "Mathematics",
    gradeLevel: [3, 4, 5],
    difficulty: "intermediate",
    interactionType: "multiple-choice",
    timeEstimate: "20-25 min",
    skillAreas: ["multiplication", "times_tables", "problem_solving"],
    learningObjectives: [
      "Memorize multiplication tables 1-12",
      "Understand multiplication as repeated addition",
      "Apply multiplication to word problems"
    ],
    status: "available",
    rewards: {
      coins: 180,
      badges: ["Multiplication Hero", "Space Explorer"]
    }
  },
  {
    id: "fraction-pizza-party",
    title: "Fraction Pizza Party",
    description: "Learn fractions by sharing pizzas at the ultimate fraction party!",
    emoji: "🍕",
    subject: "Mathematics",
    gradeLevel: [3, 4, 5, 6],
    difficulty: "intermediate",
    interactionType: "drag-drop",
    timeEstimate: "25-30 min",
    skillAreas: ["fractions", "equivalent_fractions", "fraction_operations"],
    learningObjectives: [
      "Understand fraction notation",
      "Compare and order fractions",
      "Add and subtract fractions"
    ],
    status: "available",
    rewards: {
      coins: 200,
      badges: ["Fraction Master", "Pizza Chef"]
    }
  },
  {
    id: "decimal-treasure-hunt",
    title: "Decimal Treasure Hunt",
    description: "Navigate through decimal challenges to find hidden treasures on mysterious islands!",
    emoji: "🏴‍☠️",
    subject: "Mathematics",
    gradeLevel: [4, 5, 6],
    difficulty: "intermediate",
    interactionType: "puzzle",
    timeEstimate: "20-25 min",
    skillAreas: ["decimals", "place_value", "decimal_operations"],
    learningObjectives: [
      "Understand decimal place value",
      "Compare and order decimals",
      "Add and subtract decimals"
    ],
    status: "available",
    rewards: {
      coins: 190,
      badges: ["Decimal Detective", "Treasure Hunter"]
    }
  },

  // Middle School Mathematics (Grades 6-8)
  {
    id: "algebra-adventure",
    title: "Algebra Adventure",
    description: "Solve algebraic equations to unlock ancient mysteries and save the kingdom!",
    emoji: "🗝️",
    subject: "Mathematics",
    gradeLevel: [6, 7, 8],
    difficulty: "intermediate",
    interactionType: "typing",
    timeEstimate: "30-35 min",
    skillAreas: ["algebra", "equations", "variables", "linear_expressions"],
    learningObjectives: [
      "Solve one-step equations",
      "Understand variables and expressions",
      "Graph linear equations"
    ],
    status: "available",
    rewards: {
      coins: 280,
      badges: ["Algebra Hero", "Equation Solver"]
    }
  },
  {
    id: "geometry-architect",
    title: "Geometry Architect",
    description: "Design and build structures while mastering angles, areas, and geometric theorems!",
    emoji: "🏗️",
    subject: "Mathematics",
    gradeLevel: [6, 7, 8],
    difficulty: "intermediate",
    interactionType: "drawing",
    timeEstimate: "35-40 min",
    skillAreas: ["geometry", "angles", "area", "perimeter", "volume"],
    learningObjectives: [
      "Calculate area and perimeter",
      "Understand angle relationships",
      "Apply Pythagorean theorem"
    ],
    status: "available",
    rewards: {
      coins: 300,
      badges: ["Geometry Architect", "Shape Builder"]
    }
  },
  {
    id: "statistics-sports-analyzer",
    title: "Statistics Sports Analyzer",
    description: "Analyze sports data and learn statistics while predicting game outcomes!",
    emoji: "⚽",
    subject: "Mathematics",
    gradeLevel: [6, 7, 8],
    difficulty: "intermediate",
    interactionType: "multiple-choice",
    timeEstimate: "25-30 min",
    skillAreas: ["statistics", "data_analysis", "probability", "graphs"],
    learningObjectives: [
      "Calculate mean, median, mode",
      "Interpret graphs and charts",
      "Understand basic probability"
    ],
    status: "available",
    rewards: {
      coins: 250,
      badges: ["Data Analyst", "Sports Statistician"]
    }
  },

  // High School Mathematics (Grades 9-12)
  {
    id: "calculus-rollercoaster",
    title: "Calculus Rollercoaster",
    description: "Design thrilling rollercoasters using calculus concepts of derivatives and integrals!",
    emoji: "🎢",
    subject: "Mathematics",
    gradeLevel: [11, 12],
    difficulty: "advanced",
    interactionType: "simulation",
    timeEstimate: "40-45 min",
    skillAreas: ["calculus", "derivatives", "integrals", "optimization"],
    learningObjectives: [
      "Understand derivative concepts",
      "Apply integration techniques",
      "Solve optimization problems"
    ],
    status: "available",
    rewards: {
      coins: 400,
      badges: ["Calculus Master", "Coaster Engineer"]
    }
  },
  {
    id: "trigonometry-tower",
    title: "Trigonometry Tower",
    description: "Scale the trigonometry tower using sine, cosine, and tangent to reach new heights!",
    emoji: "🗼",
    subject: "Mathematics",
    gradeLevel: [9, 10, 11],
    difficulty: "advanced",
    interactionType: "puzzle",
    timeEstimate: "35-40 min",
    skillAreas: ["trigonometry", "sine", "cosine", "tangent", "unit_circle"],
    learningObjectives: [
      "Master trigonometric ratios",
      "Understand the unit circle",
      "Solve trigonometric equations"
    ],
    status: "available",
    rewards: {
      coins: 350,
      badges: ["Trig Master", "Tower Climber"]
    }
  },

  // English Language Arts (Grades 1-12)
  {
    id: "phonics-playground",
    title: "Phonics Playground",
    description: "Learn letter sounds and build reading skills in this interactive phonics adventure!",
    emoji: "🔤",
    subject: "English",
    gradeLevel: [1, 2],
    difficulty: "beginner",
    interactionType: "click-sequence",
    timeEstimate: "15-20 min",
    skillAreas: ["phonics", "letter_sounds", "reading_basics", "decoding"],
    learningObjectives: [
      "Recognize letter sounds",
      "Blend sounds to make words",
      "Decode simple words"
    ],
    status: "available",
    rewards: {
      coins: 130,
      badges: ["Phonics Hero", "Sound Master"]
    }
  },
  {
    id: "vocabulary-village",
    title: "Vocabulary Village",
    description: "Explore a charming village while learning new words and their meanings!",
    emoji: "🏘️",
    subject: "English",
    gradeLevel: [2, 3, 4, 5],
    difficulty: "beginner",
    interactionType: "multiple-choice",
    timeEstimate: "20-25 min",
    skillAreas: ["vocabulary", "word_meanings", "context_clues", "synonyms"],
    learningObjectives: [
      "Learn grade-appropriate vocabulary",
      "Use context clues",
      "Identify synonyms and antonyms"
    ],
    status: "available",
    rewards: {
      coins: 170,
      badges: ["Word Explorer", "Village Guide"]
    }
  },
  {
    id: "grammar-galaxy",
    title: "Grammar Galaxy",
    description: "Journey through space while mastering grammar rules and sentence structure!",
    emoji: "🌌",
    subject: "English",
    gradeLevel: [3, 4, 5, 6],
    difficulty: "intermediate",
    interactionType: "drag-drop",
    timeEstimate: "25-30 min",
    skillAreas: ["grammar", "parts_of_speech", "sentence_structure", "punctuation"],
    learningObjectives: [
      "Identify parts of speech",
      "Build proper sentences",
      "Use correct punctuation"
    ],
    status: "available",
    rewards: {
      coins: 210,
      badges: ["Grammar Guardian", "Space Explorer"]
    }
  },
  {
    id: "literature-legends",
    title: "Literature Legends",
    description: "Meet famous authors and analyze classic literature in this immersive literary journey!",
    emoji: "📖",
    subject: "English",
    gradeLevel: [6, 7, 8, 9],
    difficulty: "intermediate",
    interactionType: "multiple-choice",
    timeEstimate: "35-40 min",
    skillAreas: ["literature", "reading_comprehension", "literary_analysis", "themes"],
    learningObjectives: [
      "Analyze literary themes",
      "Understand character development",
      "Interpret symbolism"
    ],
    status: "available",
    rewards: {
      coins: 320,
      badges: ["Literature Scholar", "Story Analyst"]
    }
  },
  {
    id: "essay-excellence",
    title: "Essay Excellence Academy",
    description: "Master the art of persuasive writing and essay composition in this writing workshop!",
    emoji: "✍️",
    subject: "English",
    gradeLevel: [8, 9, 10, 11, 12],
    difficulty: "advanced",
    interactionType: "typing",
    timeEstimate: "40-45 min",
    skillAreas: ["writing", "essay_structure", "persuasive_writing", "citations"],
    learningObjectives: [
      "Structure persuasive essays",
      "Use evidence effectively",
      "Master MLA citations"
    ],
    status: "available",
    rewards: {
      coins: 380,
      badges: ["Essay Expert", "Writing Master"]
    }
  },

  // Science (Grades 1-12)
  {
    id: "animal-habitat-explorer",
    title: "Animal Habitat Explorer",
    description: "Discover different animals and their habitats in this nature exploration game!",
    emoji: "🦁",
    subject: "Science",
    gradeLevel: [1, 2, 3],
    difficulty: "beginner",
    interactionType: "click-sequence",
    timeEstimate: "20-25 min",
    skillAreas: ["life_science", "animals", "habitats", "ecosystems"],
    learningObjectives: [
      "Identify animal habitats",
      "Understand basic ecosystems",
      "Learn animal characteristics"
    ],
    status: "available",
    rewards: {
      coins: 160,
      badges: ["Animal Expert", "Habitat Hero"]
    }
  },
  {
    id: "chemistry-lab-master",
    title: "Chemistry Lab Master",
    description: "Conduct safe virtual chemistry experiments and learn about elements and compounds!",
    emoji: "⚗️",
    subject: "Science",
    gradeLevel: [7, 8, 9, 10],
    difficulty: "intermediate",
    interactionType: "simulation",
    timeEstimate: "35-40 min",
    skillAreas: ["chemistry", "elements", "compounds", "chemical_reactions"],
    learningObjectives: [
      "Understand periodic table",
      "Balance chemical equations",
      "Predict reaction products"
    ],
    status: "available",
    rewards: {
      coins: 330,
      badges: ["Chemistry Expert", "Lab Master"]
    }
  },
  {
    id: "physics-force-academy",
    title: "Physics Force Academy",
    description: "Master forces, motion, and energy through interactive physics simulations!",
    emoji: "⚡",
    subject: "Science",
    gradeLevel: [8, 9, 10, 11, 12],
    difficulty: "advanced",
    interactionType: "simulation",
    timeEstimate: "40-45 min",
    skillAreas: ["physics", "forces", "motion", "energy", "waves"],
    learningObjectives: [
      "Understand Newton's laws",
      "Calculate velocity and acceleration",
      "Apply conservation of energy"
    ],
    status: "available",
    rewards: {
      coins: 390,
      badges: ["Physics Master", "Force Commander"]
    }
  },
  {
    id: "biology-cell-city",
    title: "Biology Cell City",
    description: "Explore the microscopic world of cells and learn about cellular structures and functions!",
    emoji: "🔬",
    subject: "Science",
    gradeLevel: [6, 7, 8, 9],
    difficulty: "intermediate",
    interactionType: "puzzle",
    timeEstimate: "30-35 min",
    skillAreas: ["biology", "cell_structure", "organelles", "cell_processes"],
    learningObjectives: [
      "Identify cell organelles",
      "Understand cell functions",
      "Compare plant and animal cells"
    ],
    status: "available",
    rewards: {
      coins: 270,
      badges: ["Cell Biologist", "Microscope Master"]
    }
  },

  // Social Studies & History (Grades 1-12)
  {
    id: "american-revolution-simulator",
    title: "American Revolution Simulator",
    description: "Experience key events of the American Revolution and understand the path to independence!",
    emoji: "🇺🇸",
    subject: "History",
    gradeLevel: [5, 6, 7, 8],
    difficulty: "intermediate",
    interactionType: "strategy",
    timeEstimate: "35-40 min",
    skillAreas: ["american_history", "revolution", "colonial_america", "independence"],
    learningObjectives: [
      "Understand causes of revolution",
      "Learn key historical figures",
      "Analyze historical consequences"
    ],
    status: "available",
    rewards: {
      coins: 310,
      badges: ["History Scholar", "Patriot"]
    }
  },
  {
    id: "world-geography-quest",
    title: "World Geography Quest",
    description: "Travel the globe and learn about countries, capitals, and geographic features!",
    emoji: "🌍",
    subject: "Geography",
    gradeLevel: [3, 4, 5, 6, 7],
    difficulty: "intermediate",
    interactionType: "multiple-choice",
    timeEstimate: "25-30 min",
    skillAreas: ["geography", "countries", "capitals", "continents", "landmarks"],
    learningObjectives: [
      "Identify world countries",
      "Locate major geographic features",
      "Understand cultural diversity"
    ],
    status: "available",
    rewards: {
      coins: 230,
      badges: ["Geography Expert", "World Explorer"]
    }
  },
  {
    id: "economics-marketplace",
    title: "Economics Marketplace",
    description: "Learn supply and demand, budgeting, and economic principles through market simulations!",
    emoji: "💰",
    subject: "Social Studies",
    gradeLevel: [8, 9, 10, 11, 12],
    difficulty: "intermediate",
    interactionType: "strategy",
    timeEstimate: "35-40 min",
    skillAreas: ["economics", "supply_demand", "budgeting", "market_economy"],
    learningObjectives: [
      "Understand supply and demand",
      "Learn budgeting skills",
      "Analyze market trends"
    ],
    status: "available",
    rewards: {
      coins: 340,
      badges: ["Economics Expert", "Market Master"]
    }
  },

  // Advanced Computer Science (Grades 9-12)
  {
    id: "python-programming-lab",
    title: "Python Programming Lab",
    description: "Learn Python programming through coding challenges and real-world projects!",
    emoji: "🐍",
    subject: "Computer Science",
    gradeLevel: [9, 10, 11, 12],
    difficulty: "advanced",
    interactionType: "typing",
    timeEstimate: "45-50 min",
    skillAreas: ["python", "programming", "loops", "functions", "data_structures"],
    learningObjectives: [
      "Master Python syntax",
      "Write functions and loops",
      "Solve programming challenges"
    ],
    status: "available",
    rewards: {
      coins: 420,
      badges: ["Python Master", "Code Ninja"]
    }
  },
  {
    id: "database-design-workshop",
    title: "Database Design Workshop",
    description: "Design and query databases while learning SQL and data management principles!",
    emoji: "🗄️",
    subject: "Computer Science",
    gradeLevel: [10, 11, 12],
    difficulty: "advanced",
    interactionType: "typing",
    timeEstimate: "40-45 min",
    skillAreas: ["databases", "sql", "data_modeling", "queries"],
    learningObjectives: [
      "Design database schemas",
      "Write SQL queries",
      "Understand data relationships"
    ],
    status: "available",
    rewards: {
      coins: 390,
      badges: ["Database Architect", "SQL Expert"]
    }
  },

  // Foreign Languages
  {
    id: "spanish-fiesta",
    title: "Spanish Fiesta",
    description: "Learn Spanish vocabulary and basic conversation through cultural celebrations!",
    emoji: "🎉",
    subject: "Spanish",
    gradeLevel: [4, 5, 6, 7, 8, 9],
    difficulty: "beginner",
    interactionType: "multiple-choice",
    timeEstimate: "25-30 min",
    skillAreas: ["spanish_vocabulary", "basic_conversation", "culture", "pronunciation"],
    learningObjectives: [
      "Learn basic Spanish vocabulary",
      "Practice pronunciation",
      "Understand Hispanic culture"
    ],
    status: "available",
    rewards: {
      coins: 240,
      badges: ["Spanish Speaker", "Culture Explorer"]
    }
  },
  {
    id: "french-cafe-conversations",
    title: "French Café Conversations",
    description: "Practice French in a charming café setting while learning everyday phrases!",
    emoji: "☕",
    subject: "French",
    gradeLevel: [6, 7, 8, 9, 10],
    difficulty: "beginner",
    interactionType: "multiple-choice",
    timeEstimate: "30-35 min",
    skillAreas: ["french_vocabulary", "conversation", "grammar", "culture"],
    learningObjectives: [
      "Master basic French phrases",
      "Understand French grammar",
      "Learn about French culture"
    ],
    status: "available",
    rewards: {
      coins: 260,
      badges: ["French Speaker", "Café Linguist"]
    }
  }
];
