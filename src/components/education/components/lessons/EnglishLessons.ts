
import { LessonActivity } from '../types/LessonTypes';
import { createStandardLesson, StandardLessonConfig } from '../utils/StandardLessonTemplate';

const englishLessonConfig: StandardLessonConfig = {
  subject: 'english',
  skillArea: 'Creative Writing and Grammar',
  learningObjectives: [
    'Master descriptive writing techniques',
    'Use vivid adjectives and strong verbs effectively',
    'Create engaging stories with clear structure',
    'Develop vocabulary through context and usage'
  ],
  prerequisites: [
    'Basic sentence structure understanding',
    'Familiarity with parts of speech'
  ],
  
  // Phase 1: Introduction (2-3 min)
  hook: "Welcome to your English adventure! Today, we're going to unlock the magic of words and learn how to paint beautiful pictures with language. Are you ready to become a word wizard?",
  realWorldExample: "Every time you tell a story, write a text message, or describe your day, you're using the powerful tools of language that we'll explore together!",
  thoughtQuestion: "What if I told you that the right words can make someone laugh, cry, or feel excited just by reading what you wrote?",
  
  // Phase 2: Content Delivery (5-7 min, split into segments)
  contentSegments: [
    {
      concept: "Adjectives: The Color Paintbrush of Language",
      explanation: "Adjectives are like magic paintbrushes that add color and life to our writing! Instead of saying 'dog,' we can say 'fluffy, energetic, golden dog' and suddenly everyone can picture exactly what we mean!",
      checkQuestion: {
        question: "In the sentence 'The mysterious, ancient castle stood on the misty hill,' how many adjectives can you find?",
        options: ["1", "2", "3", "4"],
        correctAnswer: 2,
        explanation: "Fantastic! 'Mysterious,' 'ancient,' and 'misty' are all adjectives - that's 3 descriptive words that help us imagine this spooky castle!"
      }
    },
    {
      concept: "Strong Verbs: The Action Heroes",
      explanation: "Verbs are the heartbeat of every sentence! But some verbs are stronger than others. Instead of 'walked quickly,' we can say 'sprinted' or 'dashed.' Strong verbs make your writing come alive!",
      checkQuestion: {
        question: "Which verb makes this sentence more exciting: 'The cat _____ across the room to catch the mouse'?",
        options: ["went", "moved", "pounced", "was"],
        correctAnswer: 2,
        explanation: "Perfect choice! 'Pounced' is a strong, specific verb that shows exactly how a cat moves when hunting. It's much more exciting than 'went' or 'moved'!"
      }
    },
    {
      concept: "Show Don't Tell: The Secret of Great Writing",
      explanation: "Instead of telling readers 'Sarah was nervous,' great writers show it: 'Sarah's hands trembled as she twisted her hair around her finger.' This lets readers feel the nervousness themselves!",
      checkQuestion: {
        question: "Which sentence shows that Tom is happy instead of just telling us?",
        options: ["Tom was happy", "Tom felt good", "Tom's face lit up with a huge grin", "Tom was in a good mood"],
        correctAnswer: 2,
        explanation: "Excellent! 'Tom's face lit up with a huge grin' shows us his happiness through his actions and expression. We can actually picture his joy!"
      }
    }
  ],
  
  // Phase 3: Interactive Game (4-5 min)
  gameType: 'matching',
  gameInstructions: "You're a story detective! Help solve the mystery by choosing the most vivid and exciting words to complete this adventure story.",
  gameQuestion: "Complete this exciting story: 'The brave explorer _____ through the dark jungle when suddenly, a _____ creature _____ from behind the ancient tree!' Choose the combination that creates the most thrilling scene:",
  gameOptions: [
    "walked, big, came",
    "crept, mysterious, emerged", 
    "went, nice, appeared",
    "moved, small, jumped"
  ],
  gameCorrectAnswer: 1,
  gameExplanation: "Incredible choice! 'Crept, mysterious, emerged' creates suspense and excitement. These words help us feel the tension and wonder what's going to happen next!",
  
  // Phase 4: Application (3-4 min)
  applicationScenario: "Your best friend moved to another country and you want to write them a letter that makes them feel like they're right there with you, experiencing your day.",
  problemSteps: [
    {
      step: "Choose a memorable moment from your day to describe",
      hint: "Think about something that made you laugh, surprised you, or made you feel proud",
      solution: "Pick a specific moment with clear details - like 'lunch break when my sandwich fell apart' rather than 'school was okay'"
    },
    {
      step: "Use your senses to make the scene come alive",
      hint: "What did you see, hear, smell, feel, or taste?",
      solution: "Add sensory details like 'the crispy leaves crunched under my feet' or 'the warm chocolate chip cookies smelled amazing'"
    },
    {
      step: "Replace boring words with exciting ones",
      hint: "Change 'walked' to 'strolled,' 'big' to 'enormous,' 'said' to 'whispered'",
      solution: "Transform 'I was happy' into 'I couldn't stop grinning' or 'My heart felt like it was dancing'"
    }
  ],
  
  // Phase 5: Creative Exploration (2-3 min)
  creativePrompt: "Imagine you could interview your favorite book character. What three questions would you ask them, and how do you think they would answer in their own unique voice?",
  whatIfScenario: "What if you had to describe your bedroom to an alien who has never seen Earth? What details would help them understand what it's like?",
  explorationTask: "Think about your favorite place in the world. Write one sentence that would make someone who's never been there feel like they're standing right beside you.",
  
  // Phase 6: Summary (1-2 min)
  keyTakeaways: [
    "Adjectives add color and detail to make writing vivid",
    "Strong verbs create action and excitement in stories",
    "Showing instead of telling helps readers feel emotions",
    "Using all five senses makes writing come alive",
    "Specific details create clearer mental pictures"
  ],
  selfAssessment: {
    question: "What makes writing most engaging for readers?",
    options: [
      "Using the biggest words possible",
      "Writing as much as possible",
      "Creating vivid images with specific, sensory details",
      "Never using simple words"
    ],
    correctAnswer: 2,
    explanation: "Perfect! Engaging writing uses specific, sensory details that help readers see, feel, and experience what you're describing. It's about creating a movie in their mind!"
  },
  nextTopicSuggestion: "Next time, we'll explore dialogue writing and learn how to make characters sound real and unique when they speak!"
};

export const createEnglishLesson = (): LessonActivity[] => {
  const standardLesson = createStandardLesson(englishLessonConfig);
  
  // Add the Writing Strategies activity similar to Mental Math Strategies
  const enhancedActivities: LessonActivity[] = [
    ...standardLesson.phases.slice(0, 1), // Introduction
    {
      id: 'english-writing-strategies',
      title: 'English Writing Strategies',
      type: 'content-delivery',
      phase: 'content-delivery',
      duration: 360,
      phaseDescription: 'Learn key writing strategies and techniques',
      content: {
        text: 'Master essential writing strategies that will make your stories and essays come alive!'
      }
    },
    ...standardLesson.phases.slice(1, 2), // Content delivery
    {
      id: 'english-word-choice-1',
      title: 'Word Choice Challenge',
      type: 'interactive-game',
      phase: 'interactive-game',
      duration: 240,
      phaseDescription: 'Practice choosing the most vivid words',
      content: {
        question: 'Which word makes this sentence more exciting: "The thunder _____ across the dark sky"?',
        options: ['went', 'moved', 'rumbled', 'was'],
        correctAnswer: 2,
        explanation: 'Excellent! "Rumbled" is a specific, powerful verb that helps us hear and feel the thunder!'
      }
    },
    ...standardLesson.phases.slice(2, 4),
    {
      id: 'english-sensory-writing-1',
      title: 'Sensory Description Game',
      type: 'interactive-game', 
      phase: 'interactive-game',
      duration: 300,
      phaseDescription: 'Use all five senses to describe scenes',
      content: {
        question: 'You\'re describing a bakery to someone. Which description uses the most senses?',
        options: [
          'The bakery was nice and had good food',
          'Warm cinnamon scent filled the air as golden bread crackled in the oven, and flour dusted the wooden counter',
          'The bakery sold bread and pastries',
          'It was a place where they made food'
        ],
        correctAnswer: 1,
        explanation: 'Perfect! This description lets us smell the cinnamon, see the golden bread, hear it crackling, and feel the texture of flour-dusted wood!'
      }
    },
    ...standardLesson.phases.slice(4)
  ];
  
  return enhancedActivities;
};
