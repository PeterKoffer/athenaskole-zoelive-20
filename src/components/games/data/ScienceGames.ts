
import { CurriculumGame } from '../types/GameTypes';

export const scienceGames: CurriculumGame[] = [
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
  }
];
