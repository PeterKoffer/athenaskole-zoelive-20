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
      default:
        contentPool = this.mathematicsContent; // fallback
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
