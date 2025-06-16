
import { LessonActivity } from '../types/LessonTypes';

interface UniversalContentConfig {
  subject: string;
  skillArea: string;
  gradeLevel: number;
  activityIndex: number;
  totalActivities: number;
}

export class UniversalContentGenerator {
  
  static generateEngagingLesson(subject: string, skillArea: string, gradeLevel: number = 6): LessonActivity[] {
    const activities: LessonActivity[] = [];
    const lessonId = `enhanced-${subject.toLowerCase()}-${Date.now()}`;
    
    // 1. Welcome Activity (Introduction)
    activities.push(this.createWelcomeActivity(subject, skillArea, lessonId));
    
    // 2. Concept Introduction (Content Delivery)
    activities.push(this.createConceptIntroduction(subject, skillArea, lessonId, gradeLevel));
    
    // 3. Interactive Practice (Game 1)
    activities.push(this.createInteractiveGame(subject, skillArea, lessonId, 1, gradeLevel));
    
    // 4. Learning Reinforcement (Content Delivery)
    activities.push(this.createLearningReinforcement(subject, skillArea, lessonId, gradeLevel));
    
    // 5. Fun Challenge (Game 2)
    activities.push(this.createFunChallenge(subject, skillArea, lessonId, gradeLevel));
    
    // 6. Creative Application (Creative Activity)
    activities.push(this.createCreativeApplication(subject, skillArea, lessonId, gradeLevel));
    
    // 7. Adventure Quest (Game 3)
    activities.push(this.createAdventureQuest(subject, skillArea, lessonId, gradeLevel));
    
    // 8. Grand Finale (Summary with Celebration)
    activities.push(this.createGrandFinale(subject, skillArea, lessonId, gradeLevel));

    return activities;
  }

  private static createWelcomeActivity(subject: string, skillArea: string, lessonId: string): LessonActivity {
    const welcomeMessages = {
      mathematics: `🎯 Welcome to today's amazing math adventure! We're going to explore ${skillArea} through exciting challenges, fun games, and cool discoveries. Get ready to become a math superstar!`,
      english: `📖 Welcome to our wonderful word journey! Today we'll dive into ${skillArea} through stories, games, and creative activities that will make you fall in love with language!`,
      science: `🔬 Welcome, future scientist! We're about to explore ${skillArea} through amazing experiments, cool discoveries, and mind-blowing facts about our incredible world!`,
      music: `🎵 Welcome to our musical adventure! We'll explore ${skillArea} through rhythm, melody, and harmony that will make your heart sing with joy!`,
      "computer-science": `💻 Welcome, future programmer! We're going to explore ${skillArea} through coding challenges, digital creativity, and tech adventures!`,
      "creative-arts": `🎨 Welcome, amazing artist! Today we'll explore ${skillArea} through colors, creativity, and artistic expression that will unleash your imagination!`
    };

    const subjectKey = subject.toLowerCase().replace(/[^a-z-]/g, '');
    const welcomeText = welcomeMessages[subjectKey as keyof typeof welcomeMessages] || 
      `Welcome to today's exciting ${subject} lesson! We're going to have an amazing time learning about ${skillArea}!`;

    return {
      id: `${lessonId}-welcome`,
      type: 'introduction',
      phase: 'introduction',
      title: `Welcome to ${subject} with Nelie! 🌟`,
      duration: 120,
      phaseDescription: 'Your exciting learning adventure begins!',
      content: {
        hook: welcomeText,
        excitementBuilder: "Today is going to be absolutely amazing! Are you ready for an incredible learning adventure?",
        characterIntroduction: "I'm Nelie, your AI learning companion, and I'm here to make sure you have the most fun and engaging learning experience possible!"
      }
    };
  }

  private static createConceptIntroduction(subject: string, skillArea: string, lessonId: string, gradeLevel: number): LessonActivity {
    return {
      id: `${lessonId}-concept-intro`,
      type: 'content-delivery',
      phase: 'content-delivery',
      title: `Discovering ${skillArea} 🔍`,
      duration: 180,
      phaseDescription: 'Learning new concepts in an engaging way',
      content: {
        text: `Let's discover the amazing world of ${skillArea}! This is going to be so much fun!`,
        segments: [{
          concept: skillArea,
          explanation: this.getSubjectSpecificExplanation(subject, skillArea, gradeLevel),
          checkQuestion: this.createConceptCheckQuestion(subject, skillArea)
        }],
        engagementType: 'discovery-mode',
        celebrationReady: true
      }
    };
  }

  private static createInteractiveGame(subject: string, skillArea: string, lessonId: string, gameNumber: number, gradeLevel: number): LessonActivity {
    const gameTypes = ['fill-blanks', 'drag-drop', 'matching', 'problem-solving'];
    const gameType = gameTypes[gameNumber % gameTypes.length];
    
    return {
      id: `${lessonId}-game-${gameNumber}`,
      type: 'interactive-game',
      phase: 'interactive-game',
      title: this.getGameTitle(subject, gameNumber),
      duration: 200,
      phaseDescription: 'Interactive learning through play!',
      content: {
        gameType: gameType as any,
        gameInstructions: "Let's play and learn together! This is going to be so much fun!",
        ...this.generateGameContent(subject, skillArea, gradeLevel, gameNumber),
        celebrationLevel: 'HIGH',
        excitementLevel: 'MAXIMUM'
      }
    };
  }

  private static createLearningReinforcement(subject: string, skillArea: string, lessonId: string, gradeLevel: number): LessonActivity {
    return {
      id: `${lessonId}-reinforcement`,
      type: 'content-delivery',
      phase: 'content-delivery',
      title: `Mastering ${skillArea} 💪`,
      duration: 150,
      phaseDescription: 'Building confidence and understanding',
      content: {
        text: `Great job so far! Let's build on what we've learned and become even more confident with ${skillArea}!`,
        segments: [{
          concept: `Advanced ${skillArea}`,
          explanation: this.getReinforcementContent(subject, skillArea, gradeLevel)
        }],
        quickChallenge: {
          type: 'click-reveal',
          instruction: 'Click to reveal the next amazing concept!',
          options: ['Click here!', 'Discover more!', 'Let\'s continue!'],
          correctAnswer: 0,
          celebration: 'Amazing! You\'re doing fantastic!'
        }
      }
    };
  }

  private static createFunChallenge(subject: string, skillArea: string, lessonId: string, gradeLevel: number): LessonActivity {
    return {
      id: `${lessonId}-fun-challenge`,
      type: 'interactive-game',
      phase: 'interactive-game',
      title: `${subject} Fun Challenge! 🎊`,
      duration: 220,
      phaseDescription: 'A super fun challenge to test your skills!',
      content: {
        gameType: 'creative-builder',
        scenario: `Welcome to the ultimate ${skillArea} challenge! You're about to prove just how amazing you are!`,
        ...this.generateChallengeContent(subject, skillArea, gradeLevel),
        celebrationLevel: 'EPIC',
        excitementLevel: 'MAXIMUM',
        epicnessLevel: 'LEGENDARY'
      }
    };
  }

  private static createCreativeApplication(subject: string, skillArea: string, lessonId: string, gradeLevel: number): LessonActivity {
    return {
      id: `${lessonId}-creative`,
      type: 'creative-exploration',
      phase: 'creative-exploration',
      title: `Creative ${subject} Studio 🎨`,
      duration: 240,
      phaseDescription: 'Express your learning through creativity!',
      content: {
        creativeType: this.getCreativeType(subject),
        creativePrompt: `Use your ${skillArea} knowledge to create something absolutely amazing!`,
        tools: this.getCreativeTools(subject),
        shareOpportunity: true,
        inspirationBoost: `Your creativity combined with ${skillArea} knowledge is going to create something incredible!`,
        prideFactor: 'You should be so proud of what you\'re creating!'
      }
    };
  }

  private static createAdventureQuest(subject: string, skillArea: string, lessonId: string, gradeLevel: number): LessonActivity {
    return {
      id: `${lessonId}-adventure`,
      type: 'adventure-game',
      phase: 'interactive-game',
      title: `${subject} Adventure Quest! 🗡️`,
      duration: 280,
      phaseDescription: 'Epic adventure using your new skills!',
      content: {
        gameType: 'adventure-game',
        scenario: this.getAdventureScenario(subject, skillArea),
        mechanics: `Use your ${skillArea} skills to overcome challenges and complete your quest!`,
        rewards: ['Adventure Badge', 'Knowledge Crown', 'Wisdom Gem'],
        difficulty: Math.min(gradeLevel, 5),
        engagementHooks: [
          'Epic storyline that adapts to your choices!',
          'Exciting challenges that test your knowledge!',
          'Amazing rewards for your success!'
        ],
        winCondition: `Successfully complete the quest using your ${skillArea} mastery!`,
        celebrationAnimation: true
      }
    };
  }

  private static createGrandFinale(subject: string, skillArea: string, lessonId: string, gradeLevel: number): LessonActivity {
    return {
      id: `${lessonId}-finale`,
      type: 'summary',
      phase: 'summary',
      title: `🎉 Amazing Job, ${subject} Champion! 🏆`,
      duration: 180,
      phaseDescription: 'Celebrating your incredible achievements!',
      content: {
        keyTakeaways: this.getKeyTakeaways(subject, skillArea),
        achievementsList: [
          `Mastered ${skillArea} concepts!`,
          'Completed interactive challenges!',
          'Showed amazing creativity!',
          'Conquered the adventure quest!',
          'Became a true learning champion!'
        ],
        celebration: `Congratulations! You've completed an amazing ${subject} journey and should be incredibly proud of everything you've accomplished!`,
        nextTopicSuggestion: `You're ready for even more exciting ${subject} adventures!`,
        heroStatus: `You are now officially a ${subject} Hero! 🦸‍♂️✨`
      }
    };
  }

  // Helper methods for generating subject-specific content
  private static getSubjectSpecificExplanation(subject: string, skillArea: string, gradeLevel: number): string {
    const explanations = {
      mathematics: `${skillArea} is like having a superpower! Numbers and patterns help us solve puzzles, build amazing things, and understand the world around us.`,
      english: `${skillArea} opens up magical worlds of stories and communication! Words are our tools for sharing amazing ideas and creating beautiful expressions.`,
      science: `${skillArea} helps us understand the incredible mysteries of our world! From tiny atoms to massive planets, science explains the amazing things around us.`,
      music: `${skillArea} is the universal language that speaks to our hearts! Music can make us feel happy, calm, excited, or inspired.`,
      "computer-science": `${skillArea} is like learning the language that computers understand! We can create games, apps, and digital art through coding.`,
      "creative-arts": `${skillArea} lets us express our unique vision and creativity! Art helps us share our feelings and see the world in beautiful new ways.`
    };
    
    return explanations[subject.toLowerCase() as keyof typeof explanations] || 
      `${skillArea} is an amazing area of ${subject} that will help you grow and learn in exciting ways!`;
  }

  private static generateGameContent(subject: string, skillArea: string, gradeLevel: number, gameNumber: number): any {
    // Generate unique, engaging content based on the subject
    const timestamp = Date.now() + gameNumber;
    const uniqueNumbers = [
      Math.floor(Math.random() * 30) + (gradeLevel * 5),
      Math.floor(Math.random() * 20) + (gradeLevel * 3)
    ];

    if (subject.toLowerCase() === 'mathematics') {
      return {
        question: `🎮 Math Challenge ${gameNumber}: Alex collected ${uniqueNumbers[0]} stickers and gave ${uniqueNumbers[1]} to friends. How many stickers does Alex have left?`,
        options: [
          (uniqueNumbers[0] - uniqueNumbers[1]).toString(),
          (uniqueNumbers[0] - uniqueNumbers[1] + 7).toString(),
          (uniqueNumbers[0] + uniqueNumbers[1]).toString(),
          (uniqueNumbers[0] - uniqueNumbers[1] - 5).toString()
        ],
        correctAnswer: 0,
        explanation: `Great job! Alex started with ${uniqueNumbers[0]} stickers and gave away ${uniqueNumbers[1]}, leaving ${uniqueNumbers[0] - uniqueNumbers[1]} stickers. You're becoming a math champion!`
      };
    }

    return {
      question: `Amazing ${subject} Challenge: Let's explore ${skillArea} together!`,
      options: ["Let's go!", "I'm ready!", "This is exciting!", "Show me more!"],
      correctAnswer: 0,
      explanation: `Fantastic! You're doing amazingly well with ${skillArea}!`
    };
  }

  private static generateChallengeContent(subject: string, skillArea: string, gradeLevel: number): any {
    return {
      question: `🏆 Ultimate ${subject} Challenge: Show off your amazing ${skillArea} skills!`,
      options: ["I'm ready to shine!", "Let's do this!", "Bring on the challenge!", "I've got this!"],
      correctAnswer: 0,
      explanation: `Incredible! You've mastered this challenge like a true ${subject} champion!`
    };
  }

  private static getGameTitle(subject: string, gameNumber: number): string {
    const titles = {
      mathematics: [`Math Magic Challenge ${gameNumber}`, `Number Adventure ${gameNumber}`, `Problem-Solving Quest ${gameNumber}`],
      english: [`Word Wizard Challenge ${gameNumber}`, `Language Adventure ${gameNumber}`, `Story Magic Quest ${gameNumber}`],
      science: [`Science Detective Challenge ${gameNumber}`, `Discovery Adventure ${gameNumber}`, `Mystery Solving Quest ${gameNumber}`],
      music: [`Musical Magic Challenge ${gameNumber}`, `Rhythm Adventure ${gameNumber}`, `Harmony Quest ${gameNumber}`],
      "computer-science": [`Coding Challenge ${gameNumber}`, `Digital Adventure ${gameNumber}`, `Programming Quest ${gameNumber}`],
      "creative-arts": [`Art Magic Challenge ${gameNumber}`, `Creative Adventure ${gameNumber}`, `Artistic Quest ${gameNumber}`]
    };

    const subjectTitles = titles[subject.toLowerCase() as keyof typeof titles] || [`Amazing Challenge ${gameNumber}`];
    return subjectTitles[(gameNumber - 1) % subjectTitles.length];
  }

  private static getCreativeType(subject: string): 'draw' | 'build' | 'story' | 'design' | 'compose' {
    const types = {
      mathematics: 'build' as const,
      english: 'story' as const,
      science: 'design' as const,
      music: 'compose' as const,
      "computer-science": 'build' as const,
      "creative-arts": 'draw' as const
    };
    return types[subject.toLowerCase() as keyof typeof types] || 'draw';
  }

  private static getCreativeTools(subject: string): string[] {
    const tools = {
      mathematics: ['Number blocks', 'Pattern makers', 'Geometry tools', 'Calculator'],
      english: ['Word bank', 'Story prompts', 'Character creator', 'Plot builder'],
      science: ['Lab equipment', 'Research tools', 'Experiment kit', 'Discovery journal'],
      music: ['Virtual instruments', 'Rhythm maker', 'Melody creator', 'Sound mixer'],
      "computer-science": ['Code blocks', 'Design tools', 'Logic gates', 'Algorithm builder'],
      "creative-arts": ['Digital paintbrush', 'Color palette', 'Shape tools', 'Texture library']
    };
    return tools[subject.toLowerCase() as keyof typeof tools] || ['Creative tools'];
  }

  private static getAdventureScenario(subject: string, skillArea: string): string {
    const scenarios = {
      mathematics: `🏰 Welcome to the Kingdom of Numbers! The Mathematical Crown has been stolen, and only a master of ${skillArea} can retrieve it. Your quest awaits!`,
      english: `📚 Enter the Library of Lost Words! Ancient stories have lost their words, and only a language hero skilled in ${skillArea} can restore them!`,
      science: `🔬 Welcome to the Laboratory of Mysteries! Strange phenomena are occurring, and only a brilliant scientist with ${skillArea} knowledge can solve them!`,
      music: `🎼 Enter the Concert Hall of Harmony! The magical instruments have lost their music, and only a musical hero can restore the melodies using ${skillArea}!`,
      "computer-science": `💻 Welcome to the Digital Dimension! The code has been scrambled, and only a programming hero with ${skillArea} skills can restore order!`,
      "creative-arts": `🎨 Enter the Gallery of Imagination! The colors have faded from all the artwork, and only an artistic hero can restore beauty using ${skillArea}!`
    };
    
    return scenarios[subject.toLowerCase() as keyof typeof scenarios] || 
      `🌟 Welcome to an amazing adventure where your ${skillArea} skills will save the day!`;
  }

  private static getKeyTakeaways(subject: string, skillArea: string): string[] {
    const takeaways = {
      mathematics: [
        `You've mastered important ${skillArea} concepts!`,
        'Math helps us solve real-world problems!',
        'Practice makes you stronger at mathematics!',
        'You can use these skills in everyday life!'
      ],
      english: [
        `You've grown as a ${skillArea} expert!`,
        'Reading and writing open up amazing worlds!',
        'Words are powerful tools for communication!',
        'Every story starts with curiosity like yours!'
      ],
      science: [
        `You've discovered amazing ${skillArea} concepts!`,
        'Science helps us understand our incredible world!',
        'Curiosity leads to amazing discoveries!',
        'You think like a real scientist now!'
      ],
      music: [
        `You've learned wonderful ${skillArea} skills!`,
        'Music is a universal language of joy!',
        'Rhythm and melody are all around us!',
        'You can create beautiful music!'
      ],
      "computer-science": [
        `You've learned amazing ${skillArea} concepts!`,
        'Coding helps us create incredible digital experiences!',
        'Logic and problem-solving are superpowers!',
        'You can build amazing things with technology!'
      ],
      "creative-arts": [
        `You've developed wonderful ${skillArea} skills!`,
        'Art lets us express our unique creativity!',
        'Every person has their own artistic voice!',
        'Creativity makes the world more beautiful!'
      ]
    };
    
    return takeaways[subject.toLowerCase() as keyof typeof takeaways] || [
      `You've learned amazing ${skillArea} skills!`,
      'Every lesson makes you stronger!',
      'Learning is an incredible adventure!',
      'You should be proud of your progress!'
    ];
  }

  private static createConceptCheckQuestion(subject: string, skillArea: string): any {
    return {
      question: `What's the most exciting thing about ${skillArea}?`,
      options: [
        "It helps me understand the world better!",
        "It's fun to learn new things!",
        "I can use it to solve problems!",
        "All of the above - it's amazing!"
      ],
      correctAnswer: 3,
      explanation: `Exactly right! ${skillArea} is amazing because it helps us understand, have fun, and solve problems all at the same time!`
    };
  }

  private static getReinforcementContent(subject: string, skillArea: string, gradeLevel: number): string {
    return `You're doing incredibly well with ${skillArea}! The more we practice, the stronger and more confident we become. Let's continue building your amazing skills!`;
  }
}
