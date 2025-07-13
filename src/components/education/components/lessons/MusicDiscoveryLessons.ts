
import { LessonActivity } from '../types/LessonTypes';

export interface MusicDiscoveryLessonConfig {
  skillArea: string;
  gradeLevel: number;
  sessionId: string;
}

export const generateMusicDiscoveryLessons = ({ skillArea, gradeLevel, sessionId }: MusicDiscoveryLessonConfig): LessonActivity[] => {
  const lessonId = `music-discovery-${sessionId.substring(0, 8)}-${Date.now()}`;
  const isElementary = gradeLevel <= 4;
  const isMiddle = gradeLevel >= 5 && gradeLevel <= 8;
  const isHighSchool = gradeLevel >= 9;

  console.log(`🎵 Generating Music Discovery lessons for grade ${gradeLevel}, skill: ${skillArea}`);

  const lessons: LessonActivity[] = [
    // Welcome & Musical Exploration
    {
      id: `${lessonId}_welcome`,
      title: `Welcome to Music Discovery with Nelie!`,
      type: 'introduction',
      phase: 'introduction',
      duration: 180,
      phaseDescription: 'Musical journey introduction',
      metadata: { subject: 'music', skillArea: 'welcome' },
      content: {
        text: isElementary 
          ? `Hello musical explorer! I'm Nelie, and I'm so excited to discover the wonderful world of music with you! We'll listen to beautiful sounds, learn about rhythm and melody, and maybe even create our own music together!`
          : isMiddle
          ? `Welcome to our musical adventure! I'm Nelie, your music guide. Today we'll explore how music connects cultures, express emotions, and discover the magic of ${skillArea} together!`
          : `Greetings, music enthusiast! I'm Nelie, and I'm thrilled to embark on this sophisticated musical journey with you. We'll analyze, create, and deeply appreciate the art of ${skillArea} in music!`,
        storyHook: `Ready to unlock the secrets of music?`
      }
    },

    // Musical Fundamentals
    {
      id: `${lessonId}_fundamentals`,
      title: isElementary ? `Musical Sounds & ${skillArea}` : isMiddle ? `Understanding ${skillArea} in Music` : `Advanced ${skillArea} Analysis`,
      type: 'interactive-game',
      phase: 'content-delivery',
      duration: 300,
      phaseDescription: `Learn the fundamentals of ${skillArea} in music`,
      metadata: { subject: 'music', skillArea },
      content: {
        question: isElementary
          ? `Let's listen! What do you hear in this musical example?`
          : isMiddle 
          ? `How does ${skillArea} change the feeling of this music?`
          : `Analyze the ${skillArea} techniques used in this composition.`,
        options: isElementary 
          ? ['Happy sounds', 'Sad sounds', 'Fast sounds', 'Slow sounds']
          : isMiddle
          ? ['Creates excitement', 'Brings calm', 'Tells a story', 'All of the above']
          : ['Classical technique', 'Modern innovation', 'Cultural influence', 'Artistic expression'],
        correctAnswer: isElementary ? 0 : 3,
        explanation: isElementary
          ? `Great listening! Music can make us feel happy, sad, excited, or peaceful. That's the magic of ${skillArea}!`
          : isMiddle
          ? `Excellent! ${skillArea} in music can create many different feelings and tell amazing stories.`
          : `Outstanding analysis! ${skillArea} encompasses all these elements, creating rich musical experiences.`,
        segments: [{
          title: `${skillArea} Fundamentals`,
          concept: skillArea,
          explanation: isElementary
            ? `${skillArea} is like the colors in music - it makes every song special and unique!`
            : isMiddle
            ? `${skillArea} is how musicians express ideas and emotions through organized sound and rhythm.`
            : `${skillArea} represents the sophisticated interplay of musical elements that create artistic meaning.`
        }]
      }
    },

    // Interactive Musical Activity
    {
      id: `${lessonId}_activity`,
      title: isElementary ? `Musical Play Time!` : isMiddle ? `${skillArea} Challenge` : `${skillArea} Composition Workshop`,
      type: 'creative-exploration',
      phase: 'interactive-game',
      duration: 360,
      phaseDescription: `Interactive ${skillArea} exploration`,
      metadata: { subject: 'music', skillArea },
      content: {
        creativePrompt: isElementary
          ? `Let's make music together! Clap, sing, or move to create your own musical sounds!`
          : isMiddle
          ? `Create a short musical pattern using ${skillArea}. Think about rhythm, melody, or harmony!`
          : `Compose a musical phrase that demonstrates advanced understanding of ${skillArea} principles.`,
        tools: isElementary
          ? ['Voice', 'Clapping', 'Body percussion', 'Simple instruments']
          : isMiddle
          ? ['Digital music tools', 'Traditional instruments', 'Voice recording', 'Rhythm makers']
          : ['Advanced composition software', 'Multi-track recording', 'Instrument combinations', 'Music notation'],
        explorationTask: isElementary
          ? `Explore different sounds and discover what makes music feel happy, sad, fast, or slow!`
          : isMiddle
          ? `Use your ${skillArea} skills to complete musical challenges and create original compositions!`
          : `Apply sophisticated ${skillArea} techniques to create meaningful musical expressions!`
      }
    },

    // Cultural & Historical Context
    {
      id: `${lessonId}_culture`,
      title: isElementary ? `Music Around the World` : isMiddle ? `${skillArea} Across Cultures` : `Cultural Evolution of ${skillArea}`,
      type: 'interactive-game',
      phase: 'application',
      duration: 240,
      phaseDescription: `Explore ${skillArea} in different musical cultures`,
      metadata: { subject: 'music', skillArea: 'cultural-awareness' },
      content: {
        question: isElementary
          ? `Music from different countries sounds different. What makes each one special?`
          : isMiddle
          ? `How do different cultures use ${skillArea} to express their traditions?`
          : `How has ${skillArea} evolved differently across various musical traditions?`,
        options: isElementary
          ? ['Different instruments', 'Different languages', 'Different rhythms', 'All make music special']
          : isMiddle
          ? ['Traditional instruments', 'Cultural stories', 'Historical events', 'All influence music']
          : ['Historical development', 'Cultural exchange', 'Technological advancement', 'All shaped evolution'],
        correctAnswer: 3,
        explanation: isElementary
          ? `Perfect! Every culture has its own special way of making beautiful music!`
          : isMiddle
          ? `Excellent! Music reflects the heart and history of every culture around the world!`
          : `Outstanding! ${skillArea} has been shaped by countless cultural influences throughout history!`,
        scenario: isElementary
          ? `Imagine you're traveling around the world, listening to music from every country!`
          : isMiddle
          ? `You're a music explorer discovering how ${skillArea} sounds in different parts of the world!`
          : `You're researching the global development of ${skillArea} across different musical traditions!`
      }
    },

    // Creative Expression & Performance
    {
      id: `${lessonId}_performance`,
      title: isElementary ? `Our Musical Show!` : isMiddle ? `${skillArea} Performance` : `${skillArea} Presentation`,
      type: 'application',
      phase: 'creative-exploration',
      duration: 300,
      phaseDescription: `Apply ${skillArea} knowledge in performance`,
      metadata: { subject: 'music', skillArea: 'performance' },
      content: {
        scenario: isElementary
          ? `It's time for our musical show! You can sing, clap, dance, or play simple instruments!`
          : isMiddle
          ? `Prepare a musical performance that showcases your understanding of ${skillArea}!`
          : `Create and present a sophisticated musical work demonstrating mastery of ${skillArea}!`,
        task: isElementary
          ? `Choose your favorite musical activity and share it with others!`
          : isMiddle
          ? `Perform or present your ${skillArea} creation, explaining your musical choices!`
          : `Deliver a comprehensive presentation of your ${skillArea} composition with analytical commentary!`,
        guidance: isElementary
          ? `Remember, there's no wrong way to make music - just have fun and express yourself!`
          : isMiddle
          ? `Think about how you want your audience to feel and what story your music tells!`
          : `Consider the technical, artistic, and cultural dimensions of your musical presentation!`
      }
    },

    // Musical Reflection & Celebration
    {
      id: `${lessonId}_celebration`,
      title: `Amazing Musical Journey!`,
      type: 'summary',
      phase: 'summary',
      duration: 180,
      phaseDescription: 'Celebrate musical learning achievements',
      metadata: { subject: 'music', skillArea: 'celebration' },
      content: {
        keyTakeaways: isElementary 
          ? [
              `You discovered the magic of ${skillArea} in music!`,
              `You learned that music can make us feel many different emotions!`,
              `You explored music from around the world!`,
              `You created your own musical sounds and expressions!`
            ]
          : isMiddle
          ? [
              `You mastered important concepts of ${skillArea} in music!`,
              `You connected music to different cultures and traditions!`,
              `You created original musical works using ${skillArea}!`,
              `You developed your musical listening and analytical skills!`
            ]
          : [
              `You achieved sophisticated understanding of ${skillArea} principles!`,
              `You analyzed complex musical relationships and cultural contexts!`,
              `You created advanced musical compositions demonstrating mastery!`,
              `You developed critical thinking skills for musical analysis!`
            ],
        celebration: isElementary
          ? `🎵 You're now a musical explorer who can discover the wonder in every sound! 🎵`
          : isMiddle
          ? `🎼 You're developing into a thoughtful musician who understands the deeper meaning of music! 🎼`
          : `🎶 You've achieved advanced musical literacy and analytical sophistication! 🎶`,
        nextTopicSuggestion: isElementary
          ? `Next time, we'll explore more musical adventures with different instruments and sounds!`
          : isMiddle
          ? `In our next musical journey, we'll dive deeper into composition and music theory!`
          : `Our next exploration will examine advanced topics in musical analysis and contemporary composition!`
      }
    }
  ];

  console.log(`✅ Generated ${lessons.length} Music Discovery lessons`);
  return lessons;
};
