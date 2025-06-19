/**
 * Enhanced Content Uniqueness System with real diverse content pools
 * Fixes repetitive lesson content by providing actual diverse scenarios and activities
 */

export interface ContentPool {
  themes: string[];
  scenarios: string[];
  activities: string[];
  contexts: string[];
}

export class EnhancedContentUniquenessSystem {
  private static sessionHistory: Map<string, {
    sessionId: string;
    usedThemes: string[];
    usedScenarios: string[];
    usedActivities: string[];
    usedContexts: string[];
    lastGenerated: string;
  }> = new Map();

  /**
   * Mathematics content pools - diverse real scenarios
   */
  private static mathematicsContent: ContentPool = {
    themes: [
      'Space Mission Calculator', 'Underwater Treasure Hunt', 'Magic Potion Recipes',
      'Robot Factory Assembly', 'Time Travel Adventures', 'Superhero Training Camp',
      'Dinosaur Excavation Site', 'Pirate Ship Navigation', 'Wizard School Lessons',
      'Animal Rescue Center', 'Candy Factory Production', 'Sports Championship',
      'Art Gallery Display', 'Music Concert Planning', 'Cooking Competition',
      'Building Design Challenge', 'Nature Park Exploration', 'Circus Performance',
      'Library Organization', 'Weather Station Data'
    ],
    scenarios: [
      'Sarah needs to distribute 24 stickers equally among 6 friends',
      'A bakery makes 8 dozen cookies and sells them in boxes of 12',
      'Tom collects 45 baseball cards and wants to organize them in albums',
      'A zoo has 7 enclosures with 9 animals in each one',
      'Maria saves $3 every week for 8 weeks to buy a new toy',
      'A school bus picks up students from 5 stops with 8 children at each stop',
      'Jake plants seeds in rows: 6 rows with 7 seeds in each row',
      'A library has 9 shelves with 12 books on each shelf',
      'Emma buys 4 packs of pencils with 6 pencils in each pack',
      'A farmer has chickens in 3 coops with 15 chickens in each coop',
      'Alex arranges chairs in 8 rows with 9 chairs in each row',
      'A toy store has 5 boxes with 14 action figures in each box',
      'Lisa makes bracelets using 8 beads for each of 7 bracelets',
      'A parking lot has 6 sections with 11 cars in each section',
      'Ben collects shells: 4 bags with 13 shells in each bag'
    ],
    activities: [
      'Count and group objects in different arrangements',
      'Solve word problems using addition and subtraction',
      'Create patterns with numbers and shapes',
      'Compare quantities using greater than and less than',
      'Measure objects using standard and non-standard units',
      'Identify and extend number sequences',
      'Practice skip counting by 2s, 5s, and 10s',
      'Solve simple multiplication using repeated addition',
      'Work with money: counting coins and making change',
      'Tell time to the hour and half hour',
      'Identify 2D and 3D shapes in real objects',
      'Create bar graphs with collected data',
      'Solve two-step word problems',
      'Practice mental math strategies',
      'Explore fractions using visual models'
    ],
    contexts: [
      'playground games', 'kitchen cooking', 'garden planting', 'toy collection',
      'pet care', 'sports teams', 'art projects', 'birthday parties',
      'classroom supplies', 'nature walks', 'building blocks', 'family trips',
      'school events', 'holiday celebrations', 'shopping adventures'
    ]
  };

  /**
   * English content pools - diverse language scenarios
   */
  private static englishContent: ContentPool = {
    themes: [
      'Mystery Story Detective', 'Fantasy Adventure Quest', 'Science Fiction Explorer',
      'Historical Time Traveler', 'Animal Kingdom Reporter', 'Underwater World Journalist',
      'Space Colony Writer', 'Magical Forest Storyteller', 'Future City Blogger',
      'Ancient Civilization Historian', 'Weather Station Reporter', 'Ocean Explorer',
      'Mountain Climber Diary', 'Invention Laboratory', 'Art Museum Guide'
    ],
    scenarios: [
      'Write a story about a character who discovers a hidden door',
      'Describe your perfect day using descriptive adjectives',
      'Create dialogue between two characters meeting for the first time',
      'Write instructions for making your favorite sandwich',
      'Compose a letter to a friend about an exciting adventure',
      'Describe a magical creature using vivid details',
      'Write a news report about an unusual weather event',
      'Create a comic strip with speech bubbles and captions',
      'Write a persuasive paragraph about your favorite book',
      'Describe a dream vacation destination',
      'Write a recipe for happiness using creative ingredients',
      'Create a character profile for a superhero',
      'Write about a day from your pet\'s perspective',
      'Compose a poem about your favorite season',
      'Write instructions for playing your favorite game'
    ],
    activities: [
      'Build vocabulary through word association games',
      'Practice reading comprehension with short passages',
      'Identify parts of speech in fun sentences',
      'Create rhyming word families',
      'Practice spelling with word patterns',
      'Write sentences using new vocabulary words',
      'Identify main idea and supporting details',
      'Practice using punctuation correctly',
      'Create story maps for reading comprehension',
      'Play word games to improve fluency',
      'Practice writing different sentence types',
      'Identify character traits and motivations',
      'Create graphic organizers for writing',
      'Practice editing and proofreading skills',
      'Explore different genres of literature'
    ],
    contexts: [
      'favorite books', 'family stories', 'school adventures', 'weekend activities',
      'holiday traditions', 'friendship moments', 'outdoor explorations', 'creative projects',
      'learning experiences', 'helpful actions', 'exciting discoveries', 'problem solving',
      'artistic expressions', 'community helpers', 'imaginative play'
    ]
  };

  /**
   * Science content pools - hands-on exploration
   */
  private static scienceContent: ContentPool = {
    themes: [
      'Weather Detective Lab', 'Plant Growth Experiment', 'Animal Habitat Explorer',
      'Simple Machine Engineer', 'Light and Shadow Investigator', 'Water Cycle Journey',
      'Rock and Mineral Collector', 'Human Body Explorer', 'Solar System Traveler',
      'Ecosystem Food Chain Detective', 'States of Matter Laboratory', 'Magnet Force Explorer'
    ],
    scenarios: [
      'Observe and record plant growth over two weeks',
      'Investigate which materials float or sink in water',
      'Compare how different seeds grow in various conditions',
      'Explore how shadows change throughout the day',
      'Test which materials are attracted to magnets',
      'Observe and classify different types of rocks',
      'Investigate how water changes from liquid to gas',
      'Compare the characteristics of different animal habitats',
      'Explore how simple machines make work easier',
      'Observe and record daily weather patterns',
      'Investigate which materials dissolve in water',
      'Compare the life cycles of different animals',
      'Explore how sound travels through different materials',
      'Investigate the properties of different soils',
      'Observe and classify different types of clouds'
    ],
    activities: [
      'Conduct simple experiments with predictions',
      'Create science journals with observations',
      'Build models to explain scientific concepts',
      'Sort and classify natural objects',
      'Make predictions and test hypotheses',
      'Create charts and graphs with data',
      'Practice using scientific tools safely',
      'Design solutions to simple problems',
      'Observe and describe changes over time',
      'Compare and contrast natural phenomena',
      'Create diagrams to show understanding',
      'Practice scientific vocabulary',
      'Share findings through presentations',
      'Connect science to everyday life',
      'Work collaboratively on investigations'
    ],
    contexts: [
      'backyard discoveries', 'kitchen science', 'nature walks', 'weather watching',
      'plant care', 'animal observations', 'simple experiments', 'collection activities',
      'building projects', 'water play', 'light exploration', 'sound investigations',
      'measurement activities', 'recycling projects', 'seasonal changes'
    ]
  };

  private static mentalWellnessContent: ContentPool = {
    themes: ["Mindful Moments", "Emotion Explorer", "Friendship Corner", "Resilience Builders", "Calm Oasis"],
    scenarios: ["Feeling overwhelmed before a test", "A friend seems sad", "Disagreeing with a sibling", "Trying something new and failing", "Setting a small goal for yourself"],
    activities: ["Guided deep breathing exercises", "Journaling about three good things", "Role-playing asking for help", "Listing personal strengths", "Practicing positive self-talk affirmations"],
    contexts: ["during a quiet time at home", "when feeling stressed at school", "while playing with friends", "when learning a new skill", "after a disagreement"]
  };

  private static worldHistoryReligionsContent: ContentPool = {
    themes: ["Ancient Wonders", "Echoes of Empires", "Sacred Texts & Traditions", "Crossroads of Culture", "Moments that Shaped Millennia"],
    scenarios: ["Discovering a lost city in the jungle", "Translating an ancient scroll", "Debating the causes of a major war", "Comparing two different religious festivals", "Interviewing a historical figure (imagined)"],
    activities: ["Creating a timeline of an empire", "Designing a museum exhibit for an artifact", "Writing a diary entry as someone from the past", "Comparing maps of ancient and modern worlds", "Researching a specific religious symbol or ritual"],
    contexts: ["in a grand library of Alexandria", "at an archaeological dig site", "during a medieval fair", "inside a majestic temple or cathedral", "at a United Nations historical summit"]
  };

  private static globalGeographyContent: ContentPool = {
    themes: ["Planet Earth Explorers", "Mapping Our World", "Cultures & Climates", "Human Impact Zones", "Journey to the Core"],
    scenarios: ["Planning a sustainable city in a challenging environment", "Tracking a migrating animal species across continents", "Investigating the causes of desertification in a region", "Comparing population pyramids of two different countries", "Designing a travel itinerary for an around-the-world trip"],
    activities: ["Building a model of a volcano or mountain range", "Creating a climate graph for a specific city", "Using GIS data (simulated) to solve a problem", "Debating solutions to overpopulation or resource scarcity", "Designing a flag and anthem for a new micro-nation"],
    contexts: ["aboard a research vessel in the Arctic", "deep within the Amazon rainforest", "on top of Mount Everest", "in a bustling megacity like Tokyo", "navigating with a compass in a vast desert"]
  };

  private static bodyLabContent: ContentPool = {
    themes: ["Fuel Your Body", "Move & Groove", "Mind-Body Connection", "Healthy Habits Handbook", "Wellness Warriors"],
    scenarios: ["Designing a balanced meal plan for an athlete", "Creating a fun workout routine for different age groups", "Investigating the effects of sleep deprivation", "Developing a campaign to reduce screen time", "Understanding how stress affects the body"],
    activities: ["Tracking daily water intake and its benefits", "Learning basic yoga poses for flexibility", "Comparing nutritional labels on food products", "Designing an obstacle course for fitness", "Practicing mindfulness meditation for 5 minutes"],
    contexts: ["in a modern gym or fitness studio", "at a farmer's market choosing fresh produce", "during a school sports day", "while preparing a healthy family dinner", "in a calm nature spot for meditation"]
  };

  private static lifeEssentialsContent: ContentPool = {
    themes: ["Future Ready Finances", "Adulting 101", "Career Compass", "Smart Consumer Skills", "Blueprint for Independence"],
    scenarios: ["Creating a budget for your first apartment", "Comparing different types of bank accounts or credit cards", "Researching career paths based on interests and skills", "Understanding a sample rental agreement or job contract", "Planning for a major purchase like a car or further education"],
    activities: ["Role-playing a job interview", "Calculating compound interest on savings", "Developing a 5-year financial goal plan", "Creating a weekly household chore schedule", "Comparing prices for a common household item across different stores"],
    contexts: ["at a mock job fair", "while planning a personal budget at a desk", "in a simulated bank or financial advisor's office", "when looking for your first apartment online", "discussing future plans with a mentor"]
  };

  /**
   * Generate truly unique content for a session
   */
  static generateUniqueContent(config: { subject: string; sessionId?: string }): {
    themes: string[];
    scenarios: string[];
    activities: string[];
    contexts: string[];
  } {
    const sessionId = config.sessionId || `session-${Date.now()}`;
    const subject = config.subject.toLowerCase();
    
    // Get content pool for subject
    let contentPool: ContentPool;
    switch (subject) {
      case 'mathematics':
      case 'math':
        contentPool = this.mathematicsContent;
        break;
      case 'english':
      case 'language':
        contentPool = this.englishContent;
        break;
      case 'science':
        contentPool = this.scienceContent;
        break;
      case 'mentalwellness':
        contentPool = this.mentalWellnessContent;
        break;
      case 'worldhistoryreligions':
        contentPool = this.worldHistoryReligionsContent;
        break;
      case 'globalgeography':
        contentPool = this.globalGeographyContent;
        break;
      case 'bodylab':
        contentPool = this.bodyLabContent;
        break;
      case 'lifeessentials':
        contentPool = this.lifeEssentialsContent;
        break;
      default:
        // Consider a more generic fallback or error if subject pool is missing
        console.warn(`No specific content pool for ${subject}, defaulting to Mathematics.`);
        contentPool = this.mathematicsContent;
    }

    // Get or create session history
    const history = this.sessionHistory.get(sessionId) || {
      sessionId,
      usedThemes: [],
      usedScenarios: [],
      usedActivities: [],
      usedContexts: [],
      lastGenerated: ''
    };

    // Filter out used content to ensure uniqueness
    const availableThemes = contentPool.themes.filter(theme => !history.usedThemes.includes(theme));
    const availableScenarios = contentPool.scenarios.filter(scenario => !history.usedScenarios.includes(scenario));
    const availableActivities = contentPool.activities.filter(activity => !history.usedActivities.includes(activity));
    const availableContexts = contentPool.contexts.filter(context => !history.usedContexts.includes(context));

    // If we've used most content, reset some arrays to allow reuse with variation
    if (availableThemes.length < 2) {
      history.usedThemes = history.usedThemes.slice(-5); // Keep only recent 5
    }
    if (availableScenarios.length < 3) {
      history.usedScenarios = history.usedScenarios.slice(-10); // Keep only recent 10
    }
    if (availableActivities.length < 3) {
      history.usedActivities = history.usedActivities.slice(-10);
    }
    if (availableContexts.length < 3) {
      history.usedContexts = history.usedContexts.slice(-8);
    }

    // Randomly select unique content
    const selectedThemes = this.selectRandomItems(availableThemes.length > 0 ? availableThemes : contentPool.themes, 3);
    const selectedScenarios = this.selectRandomItems(availableScenarios.length > 0 ? availableScenarios : contentPool.scenarios, 5);
    const selectedActivities = this.selectRandomItems(availableActivities.length > 0 ? availableActivities : contentPool.activities, 5);
    const selectedContexts = this.selectRandomItems(availableContexts.length > 0 ? availableContexts : contentPool.contexts, 3);

    // Update history
    history.usedThemes.push(...selectedThemes);
    history.usedScenarios.push(...selectedScenarios);
    history.usedActivities.push(...selectedActivities);
    history.usedContexts.push(...selectedContexts);
    history.lastGenerated = new Date().toISOString();

    // Keep history manageable
    history.usedThemes = history.usedThemes.slice(-20);
    history.usedScenarios = history.usedScenarios.slice(-30);
    history.usedActivities = history.usedActivities.slice(-30);
    history.usedContexts = history.usedContexts.slice(-20);

    this.sessionHistory.set(sessionId, history);

    console.log(`✨ Generated unique ${subject} content:`, {
      sessionId: sessionId.substring(0, 12) + '...',
      themes: selectedThemes.length,
      scenarios: selectedScenarios.length,
      activities: selectedActivities.length,
      contexts: selectedContexts.length,
      historySize: {
        themes: history.usedThemes.length,
        scenarios: history.usedScenarios.length,
        activities: history.usedActivities.length,
        contexts: history.usedContexts.length
      }
    });

    return {
      themes: selectedThemes,
      scenarios: selectedScenarios,
      activities: selectedActivities,
      contexts: selectedContexts
    };
  }

  /**
   * Select random items from an array without repetition
   */
  private static selectRandomItems<T>(array: T[], count: number): T[] {
    const shuffled = [...array].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, array.length));
  }

  /**
   * Clear session history for a fresh start
   */
  static clearSessionHistory(sessionId: string): void {
    this.sessionHistory.delete(sessionId);
    console.log(`🧹 Cleared session history for: ${sessionId}`);
  }

  /**
   * Get usage statistics for debugging
   */
  static getUsageStats(): any {
    const stats = {
      totalSessions: this.sessionHistory.size,
      sessions: Array.from(this.sessionHistory.entries()).map(([id, history]) => ({
        id: id.substring(0, 12) + '...',
        usedContent: {
          themes: history.usedThemes.length,
          scenarios: history.usedScenarios.length,
          activities: history.usedActivities.length,
          contexts: history.usedContexts.length
        },
        lastGenerated: history.lastGenerated
      }))
    };
    
    console.log('📊 Content uniqueness usage stats:', stats);
    return stats;
  }
}

export default EnhancedContentUniquenessSystem;
