
import { LessonActivity } from '../types/LessonTypes';
import { createStandardLesson, StandardLessonConfig } from '../utils/StandardLessonTemplate';

const englishLessonConfig: StandardLessonConfig = {
  subject: 'english',
  skillArea: 'Grammar and Word Usage',
  learningObjectives: [
    'Identify and use nouns, verbs, and adjectives correctly',
    'Build descriptive sentences with specific word choices',
    'Adapt language style for different audiences',
    'Apply grammar knowledge to improve communication'
  ],
  prerequisites: [
    'Basic reading comprehension',
    'Understanding of simple sentences'
  ],
  
  // Phase 1: Introduction (2-3 min)
  hook: "Every day, you use thousands of words to share your thoughts, feelings, and ideas. But have you ever wondered how these words work together like a perfectly choreographed dance?",
  realWorldExample: "When you text your friends, write a story, or even order your favorite food, you're using the building blocks of language that we'll explore today!",
  thoughtQuestion: "What if I told you that understanding how words work could make you a more powerful communicator and help you express exactly what you're thinking?",
  
  // Phase 2: Content Delivery (5-7 min, split into segments)
  contentSegments: [
    {
      concept: "Nouns: The Naming Stars",
      explanation: "Nouns are the naming champions of language! They tell us about people (teacher, friend), places (school, park), things (book, computer), and even ideas (happiness, courage).",
      checkQuestion: {
        question: "In this sentence: 'The excited dog ran through the beautiful garden,' which word is a noun?",
        options: ["excited", "dog", "ran", "beautiful"],
        correctAnswer: 1,
        explanation: "Perfect! 'Dog' is a noun because it names an animal. Nouns are the foundation of every sentence!"
      }
    },
    {
      concept: "Verbs: The Action Heroes",
      explanation: "Verbs are the action stars that tell us what's happening! They show actions (run, jump, think) or states of being (is, was, feel). Without verbs, sentences would just be lists of things!",
      checkQuestion: {
        question: "Which word is the verb in: 'Sarah carefully painted a colorful masterpiece'?",
        options: ["Sarah", "carefully", "painted", "colorful"],
        correctAnswer: 2,
        explanation: "Excellent! 'Painted' is the verb showing the action Sarah performed. Verbs bring sentences to life!"
      }
    },
    {
      concept: "Adjectives: The Detail Artists",
      explanation: "Adjectives are like artists who paint pictures with words! They describe and give us more information about nouns. Instead of just 'cat,' we can have a 'fluffy, orange, playful cat.'",
      checkQuestion: {
        question: "In 'The clever detective solved the mysterious case,' which word is an adjective describing the detective?",
        options: ["clever", "detective", "solved", "mysterious"],
        correctAnswer: 0,
        explanation: "Brilliant! 'Clever' is an adjective that describes what kind of detective. Adjectives make our writing colorful and specific!"
      }
    }
  ],
  
  // Phase 3: Interactive Game (4-5 min)
  gameType: 'matching',
  gameInstructions: "You're a Word Architect! Help build the most exciting sentence by choosing the best words for each category.",
  gameQuestion: "Build an amazing sentence! Start with this framework: 'The [adjective] [noun] [verb] [adverb] through the [adjective] [noun].' Which combination creates the most vivid image?",
  gameOptions: [
    "The big cat walked slowly through the nice yard.",
    "The majestic tiger prowled silently through the moonlit jungle.",
    "The small animal moved quickly through the green place.",
    "The good pet ran fast through the big area."
  ],
  gameCorrectAnswer: 1,
  gameExplanation: "Incredible word architecture! 'The majestic tiger prowled silently through the moonlit jungle' uses specific, powerful words that help us see, hear, and feel the scene!",
  
  // Phase 4: Application (3-4 min)
  applicationScenario: "You want to convince your family to adopt a pet from the local animal shelter. You need to write a persuasive message that will help them understand why this is important to you.",
  problemSteps: [
    {
      step: "Choose powerful nouns to describe the pet and the situation",
      hint: "Think about specific types of animals and emotional words",
      solution: "Use specific nouns like 'golden retriever puppy' instead of just 'dog,' and 'companion' instead of 'pet'"
    },
    {
      step: "Select action verbs that show the positive impact",
      hint: "What actions show how a pet improves life?",
      solution: "Use strong verbs like 'brighten,' 'comfort,' 'teach,' and 'enrich' instead of weak verbs like 'be' or 'have'"
    },
    {
      step: "Add descriptive adjectives that appeal to emotions",
      hint: "What adjectives make readers care about your cause?",
      solution: "Use emotional adjectives like 'lovable,' 'loyal,' 'gentle,' and 'deserving' to create connection"
    }
  ],
  
  // Phase 5: Creative Exploration (2-3 min)
  creativePrompt: "Imagine you could create a new word that doesn't exist in English yet. What would it mean, and how would you use it in a sentence?",
  whatIfScenario: "What if you could only use 10 words to describe your perfect day? Which words would you choose and why?",
  explorationTask: "Think about how the same message might sound different when texting a friend, writing to a teacher, or talking to a grandparent. How does your word choice change based on your audience?",
  
  // Phase 6: Summary (1-2 min)
  keyTakeaways: [
    "Nouns name people, places, things, and ideas",
    "Verbs show actions and bring sentences to life",
    "Adjectives add color and detail to our descriptions",
    "Specific word choices create clearer communication",
    "Different audiences require different language styles"
  ],
  selfAssessment: {
    question: "What makes communication most effective?",
    options: [
      "Using the biggest words possible",
      "Choosing specific, appropriate words for your audience and purpose",
      "Writing as much as possible",
      "Using only simple words"
    ],
    correctAnswer: 1
  },
  nextTopicSuggestion: "Next, we'll explore how sentences connect to form paragraphs and discover the power of storytelling structure!"
};

export const createEnglishLesson = (): LessonActivity[] => {
  const standardLesson = createStandardLesson(englishLessonConfig);
  return standardLesson.phases;
};
