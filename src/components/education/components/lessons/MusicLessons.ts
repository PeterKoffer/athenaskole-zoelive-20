
import { LessonActivity } from '../types/LessonTypes';
import { createStandardLesson, StandardLessonConfig } from '../utils/StandardLessonTemplate';

const musicLessonConfig: StandardLessonConfig = {
  subject: 'music',
  skillArea: 'Rhythm, Melody, and Musical Expression',
  learningObjectives: [
    'Understand rhythm as the heartbeat of music',
    'Recognize different types of musical instruments',
    'Identify how music expresses emotions and moods',
    'Apply rhythm patterns in creative activities',
    'Connect music to mathematical patterns and real-world experiences'
  ],
  prerequisites: [
    'Basic listening skills',
    'Ability to clap hands and move to rhythm'
  ],

  // Phase 1: Introduction (2-3 min)
  hook: "Music is all around us! From the rhythm of your heartbeat to the melody of your favorite song, music connects us to emotions and memories in amazing ways.",
  realWorldExample: "Every time you clap along to a beat, hum a tune, or dance to music, you're experiencing the mathematical patterns and emotional power of musical expression!",
  thoughtQuestion: "Have you ever noticed how different types of music can make you feel happy, excited, calm, or energized? That's the magic we'll explore today!",

  // Phase 2: Content Delivery (5-7 min, split into segments)
  contentSegments: [
    {
      concept: "Rhythm: The Heartbeat of Music",
      explanation: "Rhythm is like a musical heartbeat that keeps music organized. It's the pattern of beats that helps us know when to clap, dance, or play instruments. Every song has its own special rhythm pattern!",
      checkQuestion: {
        question: "When you clap along to your favorite song, what are you following?",
        options: ["The melody", "The rhythm", "The words", "The volume"],
        correctAnswer: 1,
        explanation: "Perfect! You're following the rhythm - the steady beat that gives music its pulse and energy!"
      }
    },
    {
      concept: "Musical Instruments and Their Families",
      explanation: "Musical instruments are like different voices in a conversation! We group them into families: percussion (drums you hit), strings (guitar you pluck), winds (flute you blow), and keyboards (piano you press). Each family has its own special way of making sound!",
      checkQuestion: {
        question: "Which instrument family includes the violin and guitar?",
        options: ["Percussion", "String", "Wind", "Electronic"],
        correctAnswer: 1,
        explanation: "Great! Both violin and guitar are string instruments because they make sound when you vibrate their strings!"
      }
    },
    {
      concept: "Music and Emotions",
      explanation: "Music is like a language for feelings! Fast music with major scales often sounds happy and energetic, while slow music with minor scales might sound sad or peaceful. Composers use these musical 'colors' to paint emotional pictures!",
      checkQuestion: {
        question: "What type of music would you choose for a celebration party?",
        options: ["Very slow and quiet", "Fast and upbeat", "Only instrumental", "Only singing"],
        correctAnswer: 1,
        explanation: "Excellent choice! Fast and upbeat music matches the energy and excitement of a celebration!"
      }
    }
  ],

  // Phase 3: Interactive Game (4-5 min)
  gameType: 'matching',
  gameInstructions: "You're a Musical Detective! Listen carefully to different instruments and match them to how they make their sounds.",
  gameQuestion: "Which instrument makes sound by vibrating strings that you pluck or strum?",
  gameOptions: ['Piano (keys you press)', 'Guitar (strings you strum)', 'Trumpet (air you blow)', 'Drums (surface you hit)'],
  gameCorrectAnswer: 1,
  gameExplanation: 'Amazing! A guitar makes beautiful sounds when you pluck or strum its strings, causing them to vibrate and create musical notes!',

  // Phase 4: Application (3-4 min)
  applicationScenario: "You're creating a soundtrack for a short movie about a day at the beach. You need to choose music that matches different scenes and emotions.",
  problemSteps: [
    {
      step: "Choose music for the opening scene: children running excitedly toward the ocean",
      hint: "Think about what kind of energy and tempo would match this feeling",
      solution: "Select fast, upbeat music with major scales to match the excitement and energy of children running to play"
    },
    {
      step: "Pick music for a peaceful sunset scene on the beach",
      hint: "Consider what tempo and instruments would create a calm, beautiful mood",
      solution: "Choose slow, gentle music with soft instruments like strings or flute to create a peaceful, reflective atmosphere"
    },
    {
      step: "Add rhythm elements to help viewers feel like they're at the beach",
      hint: "What natural beach sounds have rhythm patterns?",
      solution: "Include steady, gentle percussion that sounds like waves hitting the shore to connect music to the beach setting"
    }
  ],

  // Phase 5: Creative Exploration (2-3 min)
  creativePrompt: "If you could invent a new musical instrument, what would it look like and how would it make sound? Would it be big or small? Loud or soft?",
  whatIfScenario: "What if colors had sounds? If you could hear the color blue or red, what do you think they might sound like?",
  explorationTask: "Listen to the sounds around you right now. Which ones have rhythm patterns like music? How could you turn everyday sounds into a musical composition?",

  // Phase 6: Summary (1-2 min)
  keyTakeaways: [
    "Rhythm is the steady beat that organizes music",
    "Instruments are grouped into families by how they make sound",
    "Music can express and create different emotions",
    "Musical patterns connect to math and nature",
    "Everyone can create and enjoy music in their own way"
  ],
  selfAssessment: {
    question: "What makes music so powerful in expressing emotions?",
    options: [
      "Only the words in songs",
      "Just how loud or quiet it is",
      "The combination of rhythm, melody, and harmony working together",
      "Only the instruments used"
    ],
    correctAnswer: 2,
    explanation: "Excellent! Music's emotional power comes from how rhythm, melody, and harmony work together to create feelings and moods that connect with our hearts and minds!"
  },
  nextTopicSuggestion: "Next, we'll explore how to compose your own simple melodies and discover the mathematical patterns that make music sound beautiful!"
};

export const createMusicLesson = (): LessonActivity[] => {
  const standardLesson = createStandardLesson(musicLessonConfig);
  return standardLesson.phases;
};
