
import { LessonActivity } from '../types/LessonTypes';

export const createMusicDiscoveryLesson = (skillArea: string, gradeLevel: number): LessonActivity[] => {
  const lessons: LessonActivity[] = [];
  
  // Determine grade-appropriate content
  const isElementary = gradeLevel <= 4;
  const isMiddle = gradeLevel >= 5 && gradeLevel <= 8;
  const isHigh = gradeLevel >= 9;

  // Welcome Activity
  lessons.push({
    id: 'music-discovery-welcome',
    type: 'introduction',
    phase: 'introduction',
    title: 'Welcome to Music Discovery!',
    duration: 180,
    phaseDescription: 'Beginning your musical journey with excitement and curiosity',
    metadata: {
      subject: 'music',
      skillArea: skillArea,
      gradeLevel: gradeLevel
    },
    content: {
      hook: isElementary 
        ? 'Let\'s explore the magical world of sounds and music together!'
        : isMiddle
        ? 'Ready to discover the amazing power of music and creativity?'
        : 'Welcome to an advanced exploration of musical artistry and cultural expression!',
      text: `Today we'll dive into ${skillArea} and discover how music connects us to emotions, cultures, and creativity!`
    }
  });

  // Grade-specific content delivery
  if (isElementary) {
    lessons.push({
      id: 'music-elementary-exploration',
      type: 'content-delivery',
      phase: 'content-delivery',
      title: `Sound & Rhythm: ${skillArea}`,
      duration: 300,
      phaseDescription: 'Exploring basic musical elements through play and discovery',
      metadata: {
        subject: 'music',
        skillArea: skillArea,
        gradeLevel: gradeLevel
      },
      content: {
        text: `Let's explore the wonderful world of ${skillArea}!`,
        segments: [{
          title: 'Musical Sounds',
          concept: skillArea,
          explanation: `Music is made of special sounds that can be high or low, loud or soft, fast or slow. Let's listen and explore!`,
          checkQuestion: {
            question: `What makes music special?`,
            options: ["Different sounds", "Rhythm and beat", "Emotions and feelings", "All of these!"],
            correctAnswer: 3,
            explanation: "Great! Music combines sounds, rhythms, and emotions to create something magical!"
          }
        }, {
          title: 'Your Musical Voice',
          concept: 'singing',
          explanation: `Everyone has a special musical voice inside them. We can use our voices to make beautiful sounds!`,
          checkQuestion: {
            question: `How can we make music with our voices?`,
            options: ["Singing songs", "Humming melodies", "Making sound effects", "All of these!"],
            correctAnswer: 3,
            explanation: "Perfect! Our voices are amazing musical instruments!"
          }
        }]
      }
    });
  } else if (isMiddle) {
    lessons.push({
      id: 'music-middle-exploration',
      type: 'content-delivery',
      phase: 'content-delivery',
      title: `Musicianship & Culture: ${skillArea}`,
      duration: 300,
      phaseDescription: 'Developing musical skills and cultural understanding',
      metadata: {
        subject: 'music',
        skillArea: skillArea,
        gradeLevel: gradeLevel
      },
      content: {
        text: `Let's explore ${skillArea} and develop your musical abilities!`,
        segments: [{
          title: 'Musical Elements',
          concept: skillArea,
          explanation: `Music has many elements: melody (the tune), rhythm (the beat), harmony (chords), and form (structure). Each element adds something special!`,
          checkQuestion: {
            question: `Which elements combine to create music?`,
            options: ["Only melody", "Melody and rhythm", "Melody, rhythm, and harmony", "All musical elements together"],
            correctAnswer: 3,
            explanation: "Excellent! All musical elements work together to create beautiful music!"
          }
        }, {
          title: 'Cultural Musical Traditions',
          concept: 'world_music',
          explanation: `Every culture around the world has its own special musical traditions, instruments, and styles that tell stories about their people.`,
          checkQuestion: {
            question: `Why is music important in different cultures?`,
            options: ["Tells stories", "Celebrates traditions", "Brings people together", "All of these reasons"],
            correctAnswer: 3,
            explanation: "Wonderful! Music is a universal language that connects all cultures!"
          }
        }]
      }
    });
  } else {
    lessons.push({
      id: 'music-high-exploration',
      type: 'content-delivery',
      phase: 'content-delivery',
      title: `Advanced Musical Analysis: ${skillArea}`,
      duration: 300,
      phaseDescription: 'Mastering complex musical concepts and creative expression',
      metadata: {
        subject: 'music',
        skillArea: skillArea,
        gradeLevel: gradeLevel
      },
      content: {
        text: `Let's master advanced concepts in ${skillArea} and explore musical artistry!`,
        segments: [{
          title: 'Musical Theory & Analysis',
          concept: skillArea,
          explanation: `Advanced music theory helps us understand chord progressions (like I-IV-V), key relationships, and harmonic analysis that creates emotional impact.`,
          checkQuestion: {
            question: `How does music theory enhance composition?`,
            options: ["Provides structure", "Enables creativity", "Improves communication", "All of these benefits"],
            correctAnswer: 3,
            explanation: "Perfect! Music theory is a powerful tool for both understanding and creating music!"
          }
        }, {
          title: 'Digital Music Creation',
          concept: 'technology',
          explanation: `Modern music production uses Digital Audio Workstations (DAWs) to record, edit, and mix music, opening endless creative possibilities.`,
          checkQuestion: {
            question: `What can digital music technology help us achieve?`,
            options: ["Record performances", "Edit and mix sounds", "Create new musical styles", "All of these possibilities"],
            correctAnswer: 3,
            explanation: "Excellent! Technology expands our musical creativity in amazing ways!"
          }
        }]
      }
    });
  }

  // Interactive Musical Game
  lessons.push({
    id: 'music-interactive-game',
    type: 'interactive-game',
    phase: 'interactive-game',
    title: isElementary ? 'Musical Sound Game!' : isMiddle ? 'Rhythm & Melody Challenge!' : 'Composition Challenge!',
    duration: 240,
    phaseDescription: 'Interactive musical exploration and skill building',
    metadata: {
      subject: 'music',
      skillArea: skillArea,
      gradeLevel: gradeLevel
    },
    content: {
      scenario: isElementary 
        ? 'Help Nelie identify different musical sounds and create simple rhythms!'
        : isMiddle
        ? 'Join Nelie in creating musical patterns and exploring world music!'
        : 'Collaborate with Nelie to compose and analyze complex musical pieces!',
      explorationTask: `Use your ${skillArea} skills to complete musical challenges!`,
      interactionType: isElementary ? 'sound_identification' : isMiddle ? 'pattern_creation' : 'composition_analysis'
    }
  });

  // Creative Musical Expression
  lessons.push({
    id: 'music-creative-expression',
    type: 'creative-exploration',
    phase: 'creative-exploration',
    title: isElementary ? 'Make Your Own Music!' : isMiddle ? 'Musical Composition Project!' : 'Advanced Musical Creation!',
    duration: 300,
    phaseDescription: 'Express yourself through musical creativity',
    metadata: {
      subject: 'music',
      skillArea: skillArea,
      gradeLevel: gradeLevel
    },
    content: {
      creativePrompt: isElementary
        ? `Create your own musical sounds using voice, clapping, or imaginary instruments!`
        : isMiddle
        ? `Compose a short musical piece that expresses your feelings or tells a story!`
        : `Design an original composition that demonstrates advanced musical concepts and personal artistic vision!`,
      explorationTask: `Think about how music makes you feel and how you can share those feelings with others through ${skillArea}!`
    }
  });

  // Musical Summary & Celebration
  lessons.push({
    id: 'music-summary-celebration',
    type: 'summary',
    phase: 'summary',
    title: 'Musical Mastery Celebration! 🎵',
    duration: 120,
    phaseDescription: 'Celebrating your musical discoveries and growth',
    metadata: {
      subject: 'music',
      skillArea: skillArea,
      gradeLevel: gradeLevel
    },
    content: {
      keyTakeaways: [
        `You explored the wonderful world of ${skillArea}!`,
        'You discovered how music connects cultures and emotions!',
        isElementary ? 'You made your own musical sounds!' : isMiddle ? 'You created your own musical compositions!' : 'You mastered advanced musical concepts!',
        'You\'re becoming an amazing musical artist!'
      ],
      nextTopicSuggestion: `Continue your musical journey by exploring more aspects of music theory, performance, or world music traditions!`
    }
  });

  return lessons;
};

export const MUSIC_DISCOVERY_SKILL_AREAS = {
  elementary: [
    'listening_skills',
    'singing_basics',
    'rhythm_fundamentals',
    'cultural_sounds',
    'instrument_exploration'
  ],
  middle: [
    'music_notation',
    'ensemble_performance',
    'composition_basics',
    'world_music',
    'music_theory_foundations'
  ],
  high: [
    'advanced_theory',
    'digital_production',
    'performance_mastery',
    'music_analysis',
    'cultural_leadership'
  ]
};
