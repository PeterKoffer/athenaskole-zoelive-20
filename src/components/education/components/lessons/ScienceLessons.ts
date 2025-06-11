
import { LessonActivity } from '../types/LessonTypes';
import { createStandardLesson, StandardLessonConfig } from '../utils/StandardLessonTemplate';

const scienceLessonConfig: StandardLessonConfig = {
  subject: 'science',
  skillArea: 'Living Things and Their Environment',
  learningObjectives: [
    'Understand how animals depend on their habitats',
    'Identify what plants need to grow and survive',
    'Explain the basic water cycle process',
    'Apply scientific observation skills',
    'Connect living things to their environment'
  ],
  prerequisites: [
    'Basic understanding of living vs. non-living things',
    'Simple observation skills'
  ],
  
  // Phase 1: Introduction (2-3 min)
  hook: "Science is all around us! From the air we breathe to the stars in the sky, everything follows amazing patterns and rules that we can discover and understand through observation and experimentation.",
  realWorldExample: "Every time you wonder why the sky is blue, how plants grow, or what makes your heart beat, you're thinking like a scientist - asking questions about the incredible world around us!",
  thoughtQuestion: "What if I told you that understanding science could help you solve everyday mysteries and maybe even make discoveries that could change the world?",
  
  // Phase 2: Content Delivery (5-7 min, split into segments)
  contentSegments: [
    {
      concept: "Animal Habitats: Finding the Perfect Home",
      explanation: "A habitat is where an animal lives and finds everything it needs - food, water, shelter, and space. Different animals need different types of homes! Think of it like your bedroom - you have everything you need there!",
      checkQuestion: {
        question: "Where would you most likely find a polar bear living?",
        options: ['Hot desert', 'Arctic ice and snow', 'Tropical rainforest', 'Deep ocean'],
        correctAnswer: 1,
        explanation: 'Fantastic! Polar bears live in the Arctic where there is lots of ice and snow. Their thick fur keeps them warm in the freezing cold!'
      }
    },
    {
      concept: "What Plants Need to Thrive",
      explanation: "Plants are living things just like us! They need four important things to grow: sunlight for energy, water to drink, air to breathe, and nutrients from soil to stay healthy. Just like you need food, water, and air!",
      checkQuestion: {
        question: "What do plants need to grow healthy and strong?",
        options: ['Only water', 'Only sunlight', 'Sunlight, water, air, and nutrients', 'Only soil'],
        correctAnswer: 2,
        explanation: 'Perfect! Plants need sunlight, water, air, and nutrients from soil - just like how you need food, water, and air to grow big and strong!'
      }
    },
    {
      concept: "The Amazing Water Cycle",
      explanation: "Water goes on an amazing journey! The sun heats up water in oceans and lakes, turning it into invisible water vapor that rises up. When it gets high and cold, it turns back into water droplets that make clouds. Then it falls as rain and starts the journey all over again!",
      checkQuestion: {
        question: "What happens when the sun heats up water in the ocean?",
        options: ['It turns to ice', 'It becomes water vapor and rises up', 'It stays the same', 'It becomes heavier'],
        correctAnswer: 1,
        explanation: 'Amazing! When the sun heats water, it evaporates and becomes invisible water vapor that floats up into the sky. This is how clouds are made!'
      }
    }
  ],
  
  // Phase 3: Interactive Game (4-5 min)
  gameType: 'matching',
  gameInstructions: "You're a Wildlife Explorer! Help match each animal to its perfect habitat and discover amazing adaptations.",
  gameQuestion: "Match the animal to its habitat! Which animal has special adaptations that help it survive in the desert?",
  gameOptions: ['Penguin with waterproof feathers', 'Camel with water-storing humps', 'Frog with moist skin', 'Fish with gills'],
  gameCorrectAnswer: 1,
  gameExplanation: 'Excellent! Camels have amazing adaptations for desert life - their humps store fat (not water) for energy, and they can go long periods without drinking water!',
  
  // Phase 4: Application (3-4 min)
  applicationScenario: "You want to create a small garden in your backyard to grow vegetables for your family. You need to plan where to plant different types of plants.",
  problemSteps: [
    {
      step: "Choose the best location for sun-loving plants like tomatoes",
      hint: "Think about where the sun shines most during the day",
      solution: "Plant tomatoes in a spot that gets 6-8 hours of direct sunlight daily, usually facing south"
    },
    {
      step: "Plan a watering schedule for your plants",
      hint: "Consider how much water different plants need and when they need it most",
      solution: "Water early morning or evening to reduce evaporation, and check soil moisture daily"
    },
    {
      step: "Predict what might happen if you don't water your plants for a week",
      hint: "Remember what plants need to survive",
      solution: "Plants would wilt and possibly die because they need regular water to transport nutrients and stay healthy"
    }
  ],
  
  // Phase 5: Creative Exploration (2-3 min)
  creativePrompt: "If you could design an animal that could live in two different habitats (like both water and land), what special features would it need?",
  whatIfScenario: "What if plants could walk around like animals? How would this change the way they get what they need to survive?",
  explorationTask: "Look around your home or school and identify three examples of the water cycle in action. Where do you see water changing from one form to another?",
  
  // Phase 6: Summary (1-2 min)
  keyTakeaways: [
    "Animals live in habitats that provide food, water, shelter, and space",
    "Plants need sunlight, water, air, and nutrients to grow",
    "The water cycle moves water between oceans, sky, and land",
    "Living things have special adaptations for their environment",
    "Scientists learn by observing the natural world carefully"
  ],
  selfAssessment: {
    question: "What would happen to a fish if you took it out of water?",
    options: [
      "It would learn to breathe air",
      "It would be fine for a long time",
      "It would quickly die because it can't get oxygen from air",
      "It would grow legs and walk around"
    ],
    correctAnswer: 2,
    explanation: "Correct! Fish have gills that are specially designed to extract oxygen from water, not air. Out of water, they cannot breathe and would quickly die."
  },
  nextTopicSuggestion: "Next, we'll explore the human body and discover how your heart, lungs, and brain work together to keep you healthy and active!"
};

export const createScienceLesson = (): LessonActivity[] => {
  const standardLesson = createStandardLesson(scienceLessonConfig);
  return standardLesson.phases;
};
