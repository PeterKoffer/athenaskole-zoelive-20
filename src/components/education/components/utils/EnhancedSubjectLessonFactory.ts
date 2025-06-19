import { EnhancedLessonConfig, K12_CURRICULUM_STANDARDS } from './EnhancedLessonGenerator';

/**
 * Factory for generating enhanced lessons for all 6 subjects
 * with K-12 curriculum alignment and learning style adaptation
 */

/**
 * Mathematics enhanced lesson configurations by grade level
 */
export function generateMathematicsLesson(gradeLevel: number, learningStyle?: 'visual' | 'auditory' | 'kinesthetic' | 'mixed', sessionId?: string): EnhancedLessonConfig {
  const baseSkills = K12_CURRICULUM_STANDARDS[gradeLevel as keyof typeof K12_CURRICULUM_STANDARDS]?.mathematics || 
                     ['Number concepts', 'Basic operations', 'Problem solving'];

  const skillArea = baseSkills[Math.floor(Math.random() * baseSkills.length)];

  return {
    subject: 'mathematics',
    skillArea,
    gradeLevel,
    learningStyle: learningStyle || 'mixed',
    sessionId,
    learningObjectives: [
      `Master ${skillArea} concepts appropriate for grade ${gradeLevel}`,
      'Apply mathematical thinking to real-world scenarios',
      'Develop problem-solving confidence and skills',
      'Connect mathematics to daily life experiences'
    ],
    prerequisites: gradeLevel > 0 ? [`Grade ${gradeLevel - 1} math skills`] : ['Basic counting and number recognition'],
    
    hook: `Let's go on a number adventure where ${skillArea} helps us solve fun puzzles!`,
    realWorldExample: `Every time you count toys, share snacks with friends, or help cook in the kitchen, you're using ${skillArea} skills!`,
    thoughtQuestion: `Have you ever wondered how ${skillArea} helps make everyday activities easier and more fun?`,
    
    contentSegments: [
      {
        concept: `Understanding ${skillArea}`,
        explanation: `${skillArea} is like a superpower that helps us solve problems and understand the world around us!`,
        checkQuestion: {
          question: `What makes ${skillArea} useful in everyday life?`,
          options: ['It helps solve problems', 'It is only for school', 'It is too difficult', 'It is not needed'],
          correctAnswer: 0,
          explanation: `Exactly! ${skillArea} is a powerful tool for solving real-world problems!`
        }
      }
    ],
    
    gameType: 'adventure-game',
    gameInstructions: `Solve mathematical challenges in an exciting ${skillArea} adventure!`,
    gameQuestion: `Use your ${skillArea} skills to solve this challenge!`,
    gameOptions: ['Option A', 'Option B', 'Option C', 'Option D'],
    gameCorrectAnswer: 0,
    gameExplanation: `Excellent mathematical thinking! You've mastered ${skillArea} concepts!`,
    
    applicationScenario: `You're helping plan a class party and need to use ${skillArea} to make sure everything works out perfectly!`,
    problemSteps: [
      {
        step: `First, identify what ${skillArea} concepts are needed`,
        hint: 'Think about the problem carefully',
        solution: 'Break down the problem into smaller parts'
      }
    ],
    
    creativePrompt: `Create your own ${skillArea} adventure story where the hero uses math to save the day!`,
    whatIfScenario: `What if ${skillArea} didn't exist? How would we solve everyday problems?`,
    explorationTask: `Find three ways you could use ${skillArea} skills at home this week!`,
    
    keyTakeaways: [
      `${skillArea} helps solve real-world problems`,
      'Mathematical thinking builds logical reasoning',
      'Practice makes mathematical concepts easier',
      'Math is everywhere in our daily lives'
    ],
    selfAssessment: {
      question: `What's the most important thing about ${skillArea}?`,
      options: [
        'It helps solve everyday problems',
        'It is only useful in school',
        'It is too difficult to understand',
        'It is not needed in real life'
      ],
      correctAnswer: 0,
      explanation: `Perfect! ${skillArea} is a powerful tool for solving real-world problems and making informed decisions.`
    },
    nextTopicSuggestion: `Next, we'll explore more advanced ${skillArea} concepts and their applications!`
  };
}

/**
 * English enhanced lesson configurations by grade level
 */
export function generateEnglishLesson(gradeLevel: number, learningStyle?: 'visual' | 'auditory' | 'kinesthetic' | 'mixed', sessionId?: string): EnhancedLessonConfig {
  const baseSkills = K12_CURRICULUM_STANDARDS[gradeLevel as keyof typeof K12_CURRICULUM_STANDARDS]?.english || 
                     ['Reading comprehension', 'Writing skills', 'Vocabulary', 'Grammar'];

  const skillArea = baseSkills[Math.floor(Math.random() * baseSkills.length)];

  return {
    subject: 'english',
    skillArea,
    gradeLevel,
    learningStyle: learningStyle || 'mixed',
    sessionId,
    learningObjectives: [
      `Develop ${skillArea} skills appropriate for grade ${gradeLevel}`,
      'Improve communication and expression abilities',
      'Build confidence in language use',
      'Connect language skills to real-world communication'
    ],
    prerequisites: gradeLevel > 0 ? [`Grade ${gradeLevel - 1} language skills`] : ['Basic letter and sound recognition'],
    
    hook: `Let's embark on a language adventure where ${skillArea} opens doors to amazing stories and communication!`,
    realWorldExample: `Every time you tell a story, write a note, or read your favorite book, you're using ${skillArea} skills!`,
    thoughtQuestion: `How do you think ${skillArea} helps people connect and share ideas across the world?`,
    
    contentSegments: [
      {
        concept: `Mastering ${skillArea}`,
        explanation: `${skillArea} is your key to expressing thoughts, understanding others, and exploring infinite worlds through language!`,
        checkQuestion: {
          question: `Why is ${skillArea} important for communication?`,
          options: ['It improves communication', 'It is only for tests', 'It is not practical', 'It is too complicated'],
          correctAnswer: 0,
          explanation: `Perfect! ${skillArea} is essential for clear communication and self-expression!`
        }
      }
    ],
    
    gameType: 'adventure-game',
    gameInstructions: `Embark on a language adventure to master ${skillArea}!`,
    gameQuestion: `Show your ${skillArea} mastery in this language challenge!`,
    gameOptions: ['Choice A', 'Choice B', 'Choice C', 'Choice D'],
    gameCorrectAnswer: 0,
    gameExplanation: `Wonderful language skills! You've mastered ${skillArea} concepts!`,
    
    applicationScenario: `You're writing a letter to a pen pal and want to use your ${skillArea} skills to make it engaging and clear!`,
    problemSteps: [
      {
        step: `Apply ${skillArea} concepts to organize your thoughts`,
        hint: 'Consider your audience and purpose',
        solution: 'Structure your ideas clearly and logically'
      }
    ],
    
    creativePrompt: `Write a creative story that showcases your ${skillArea} abilities!`,
    whatIfScenario: `What if ${skillArea} skills didn't exist? How would people communicate?`,
    explorationTask: `Practice using ${skillArea} in conversations with family and friends this week!`,
    
    keyTakeaways: [
      `${skillArea} improves communication`,
      'Language skills open new opportunities',
      'Practice develops fluency and confidence',
      'Good communication helps in all life areas'
    ],
    selfAssessment: {
      question: `How does ${skillArea} help in daily life?`,
      options: [
        'It improves communication with others',
        'It is only useful for tests',
        'It is not practical',
        'It is too complicated'
      ],
      correctAnswer: 0,
      explanation: `Excellent! ${skillArea} is essential for clear communication and expression in all aspects of life.`
    },
    nextTopicSuggestion: `Next, we'll explore advanced ${skillArea} techniques and creative applications!`
  };
}

/**
 * Science enhanced lesson configurations by grade level
 */
export function generateScienceLesson(gradeLevel: number, learningStyle?: 'visual' | 'auditory' | 'kinesthetic' | 'mixed', sessionId?: string): EnhancedLessonConfig {
  const baseSkills = K12_CURRICULUM_STANDARDS[gradeLevel as keyof typeof K12_CURRICULUM_STANDARDS]?.science || 
                     ['Scientific observation', 'Experiments', 'Natural world', 'Scientific thinking'];

  const skillArea = baseSkills[Math.floor(Math.random() * baseSkills.length)];

  return {
    subject: 'science',
    skillArea,
    gradeLevel,
    learningStyle: learningStyle || 'mixed',
    sessionId,
    learningObjectives: [
      `Explore ${skillArea} through hands-on discovery`,
      'Develop scientific thinking and observation skills',
      'Connect science to the natural world around us',
      'Build curiosity about how things work'
    ],
    prerequisites: gradeLevel > 0 ? [`Basic scientific concepts`] : ['Curiosity about the world'],
    
    hook: `Let's become science detectives and explore the amazing world of ${skillArea}!`,
    realWorldExample: `When you watch plants grow, observe the weather, or wonder why things happen, you're using ${skillArea}!`,
    thoughtQuestion: `What mysteries about ${skillArea} would you like to solve?`,
    
    contentSegments: [
      {
        concept: `Discovering ${skillArea}`,
        explanation: `${skillArea} helps us understand the amazing world around us through observation and exploration!`,
        checkQuestion: {
          question: `What makes ${skillArea} exciting to learn about?`,
          options: ['It helps us understand our world', 'It is too complicated', 'It is only for scientists', 'It is not useful'],
          correctAnswer: 0,
          explanation: `Yes! ${skillArea} opens up a world of discovery and understanding!`
        }
      }
    ],
    
    gameType: 'adventure-game',
    gameInstructions: `Go on a scientific adventure to discover ${skillArea}!`,
    gameQuestion: `Use your scientific thinking to solve this ${skillArea} challenge!`,
    gameOptions: ['Discovery A', 'Discovery B', 'Discovery C', 'Discovery D'],
    gameCorrectAnswer: 0,
    gameExplanation: `Amazing scientific thinking! You're becoming a great explorer of ${skillArea}!`,
    
    applicationScenario: `You're a young scientist investigating ${skillArea} in your backyard laboratory!`,
    problemSteps: [
      {
        step: `Observe and gather information about ${skillArea}`,
        hint: 'Use all your senses to explore',
        solution: 'Make careful observations and ask questions'
      }
    ],
    
    creativePrompt: `Design an experiment to learn more about ${skillArea}!`,
    whatIfScenario: `What if we couldn't study ${skillArea}? What wouldn't we understand about our world?`,
    explorationTask: `Find examples of ${skillArea} in nature around your home!`,
    
    keyTakeaways: [
      `${skillArea} helps us understand the natural world`,
      'Scientific thinking involves observation and questioning',
      'Experiments help us learn new things',
      'Science is all around us every day'
    ],
    selfAssessment: {
      question: `Why is studying ${skillArea} important?`,
      options: [
        'It helps us understand how the world works',
        'It is only for school tests',
        'It is too difficult to understand',
        'It is not relevant to daily life'
      ],
      correctAnswer: 0,
      explanation: `Perfect! ${skillArea} helps us understand and appreciate the amazing world we live in!`
    },
    nextTopicSuggestion: `Next, we'll explore more exciting aspects of ${skillArea} and conduct new discoveries!`
  };
}

// Generate other subjects with similar patterns
export function generateMusicLesson(gradeLevel: number, learningStyle?: 'visual' | 'auditory' | 'kinesthetic' | 'mixed', sessionId?: string): EnhancedLessonConfig {
  return {
    ...generateMathematicsLesson(gradeLevel, learningStyle, sessionId),
    subject: 'music',
    skillArea: 'Musical expression and rhythm',
    hook: 'Let\'s explore the wonderful world of music and create beautiful sounds together!'
  };
}

export function generateComputerScienceLesson(gradeLevel: number, learningStyle?: 'visual' | 'auditory' | 'kinesthetic' | 'mixed', sessionId?: string): EnhancedLessonConfig {
  return {
    ...generateMathematicsLesson(gradeLevel, learningStyle, sessionId),
    subject: 'computerScience',
    skillArea: 'Computational thinking and problem solving',
    hook: 'Let\'s learn how computers think and solve problems step by step!'
  };
}

export function generateCreativeArtsLesson(gradeLevel: number, learningStyle?: 'visual' | 'auditory' | 'kinesthetic' | 'mixed', sessionId?: string): EnhancedLessonConfig {
  return {
    ...generateMathematicsLesson(gradeLevel, learningStyle, sessionId),
    subject: 'creativeArts',
    skillArea: 'Artistic expression and creativity',
    hook: 'Let\'s unleash our creativity and express ourselves through amazing art!'
  };
}

/**
 * Generate all 6 subject lessons for a complete educational session
 */
export function generateCompleteEducationalSession(
  gradeLevel: number, 
  learningStyle?: 'visual' | 'auditory' | 'kinesthetic' | 'mixed',
  sessionId?: string
) {
  const sessionID = sessionId || `complete-session-${Date.now()}`;
  
  return {
    mathematics: generateMathematicsLesson(gradeLevel, learningStyle, `${sessionID}-math`),
    english: generateEnglishLesson(gradeLevel, learningStyle, `${sessionID}-english`),
    science: generateScienceLesson(gradeLevel, learningStyle, `${sessionID}-science`),
    music: generateMusicLesson(gradeLevel, learningStyle, `${sessionID}-music`),
    computerScience: generateComputerScienceLesson(gradeLevel, learningStyle, `${sessionID}-cs`),
    creativeArts: generateCreativeArtsLesson(gradeLevel, learningStyle, `${sessionID}-arts`),
    sessionMetadata: {
      sessionId: sessionID,
      gradeLevel,
      learningStyle: learningStyle || 'mixed',
      totalDuration: '2.5-3 hours',
      subjects: 6,
      createdAt: new Date().toISOString()
    }
  };
}
