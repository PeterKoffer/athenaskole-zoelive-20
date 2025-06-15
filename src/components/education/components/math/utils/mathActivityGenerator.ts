
import { InteractiveActivity } from '../../../templates/InteractiveLessonTemplate';

export const generateMathActivities = async (): Promise<InteractiveActivity[]> => {
  console.log('🔢 Generating EXCITING interactive math activities');
  
  // Return truly interactive and engaging activities
  const activities: InteractiveActivity[] = [
    {
      id: 'math-battle-arena',
      type: 'quiz',
      title: '⚔️ Math Battle Arena',
      description: 'Face off against challenging math problems in this epic battle!',
      duration: 240,
      difficulty: 3,
      points: 30,
      instructions: 'Solve math problems to defeat your opponents in battle!',
      successCriteria: 'Win 5 battles by solving problems correctly',
      content: {
        question: 'A dragon has 147 gold coins. It finds a treasure chest with 3 times as many coins. How many coins does the dragon have now?',
        options: ['441 coins', '588 coins', '294 coins', '735 coins'],
        correctAnswer: 1,
        explanation: 'The treasure chest has 147 × 3 = 441 coins. Total: 147 + 441 = 588 coins!',
        theme: 'fantasy-battle',
        battleScenario: 'You face a fierce math dragon! Solve this to cast your spell!'
      }
    },
    
    {
      id: 'pizza-fraction-factory',
      type: 'simulation',
      title: '🍕 Pizza Fraction Factory',
      description: 'Run your own pizza shop and master fractions by serving customers!',
      duration: 300,
      difficulty: 2,
      points: 25,
      instructions: 'Cut pizzas into the right fractions to satisfy hungry customers!',
      successCriteria: 'Successfully serve 8 customers with correct pizza fractions',
      content: {
        simulationDescription: 'Interactive pizza-cutting game where students drag and slice pizzas into fractions',
        scenarios: [
          {
            customer: 'A family of 4 wants to share 2 pizzas equally',
            challenge: 'Cut each pizza into 4 equal slices (1/4 each)',
            reward: '$12 earned!'
          },
          {
            customer: '6 friends want to share 3 pizzas',
            challenge: 'Each person gets 1/2 pizza',
            reward: '$18 earned!'
          }
        ],
        gameType: 'drag-and-slice'
      }
    },
    
    {
      id: 'treasure-hunt-coordinates',
      type: 'puzzle',
      title: '🗺️ Coordinate Treasure Hunt',
      description: 'Navigate a mysterious island using coordinates to find hidden treasure!',
      duration: 360,
      difficulty: 3,
      points: 35,
      instructions: 'Use coordinate pairs to navigate the treasure map and find the gold!',
      successCriteria: 'Find all 5 treasure chests using coordinate clues',
      content: {
        puzzleDescription: 'Interactive coordinate plane where students click on points to find treasures',
        treasureMap: {
          chest1: { coordinates: [3, 4], clue: 'Where X marks 3 and Y reaches 4' },
          chest2: { coordinates: [-2, 5], clue: '2 steps west, 5 steps north from center' },
          chest3: { coordinates: [0, -3], clue: 'Straight down 3 from the origin' }
        },
        gameType: 'coordinate-clicking'
      }
    },
    
    {
      id: 'rocket-equation-launch',
      type: 'mini-game',
      title: '🚀 Rocket Equation Launch',
      description: 'Solve equations to provide enough fuel for your rocket to reach different planets!',
      duration: 280,
      difficulty: 4,
      points: 40,
      instructions: 'Solve equations correctly to fuel your rocket and explore the galaxy!',
      successCriteria: 'Successfully launch to 4 different planets',
      content: {
        gameDescription: 'Each correct equation adds fuel. Wrong answers lose fuel. Reach planets with enough fuel!',
        destinations: [
          { planet: 'Moon', fuelNeeded: 100, equation: '2x + 5 = 17', answer: 6 },
          { planet: 'Mars', fuelNeeded: 250, equation: '3(x - 4) = 15', answer: 9 },
          { planet: 'Jupiter', fuelNeeded: 400, equation: 'x² - 16 = 0', answer: 4 }
        ],
        gameType: 'fuel-management'
      }
    },
    
    {
      id: 'geometry-castle-builder',
      type: 'creative',
      title: '🏰 Geometry Castle Builder',
      description: 'Build an epic castle using geometric shapes and learn about area and perimeter!',
      duration: 400,
      difficulty: 3,
      points: 45,
      instructions: 'Drag geometric shapes to build your castle while calculating areas!',
      successCriteria: 'Build a castle with total area of at least 500 square units',
      content: {
        creativePrompt: 'Design your dream castle using rectangles, triangles, and circles. Calculate the area of each section!',
        availableShapes: [
          { shape: 'rectangle', maxWidth: 20, maxHeight: 15 },
          { shape: 'triangle', maxBase: 12, maxHeight: 10 },
          { shape: 'circle', maxRadius: 8 }
        ],
        gameType: 'shape-building'
      }
    },
    
    {
      id: 'time-travel-math-adventure',
      type: 'exploration',
      title: '⏰ Time Travel Math Adventure',
      description: 'Travel through different time periods solving math problems to fix history!',
      duration: 350,
      difficulty: 4,
      points: 50,
      instructions: 'Solve math problems in different eras to restore the timeline!',
      successCriteria: 'Fix 6 historical events by solving their math challenges',
      content: {
        explorationTask: 'Visit Ancient Egypt, Medieval Times, and the Future to solve era-specific math problems',
        timePeriodsn: [
          {
            era: 'Ancient Egypt',
            problem: 'Help build a pyramid: If each block is 2×2×2 feet, how many blocks for a 20×20×30 pyramid?',
            historicalContext: 'The Great Pyramid construction requires precise calculations!'
          },
          {
            era: 'Medieval Times',
            problem: 'A knight needs to divide 144 gold coins among 12 villagers equally',
            historicalContext: 'Fair distribution prevents peasant revolts!'
          }
        ],
        gameType: 'time-travel-adventure'
      }
    },
    
    {
      id: 'sports-statistics-champion',
      type: 'quiz',
      title: '⚽ Sports Statistics Champion',
      description: 'Become a sports analyst by calculating averages, percentages, and predictions!',
      duration: 320,
      difficulty: 3,
      points: 35,
      instructions: 'Analyze real sports data to make predictions and calculate statistics!',
      successCriteria: 'Correctly analyze 8 different sports scenarios',
      content: {
        question: 'A basketball player made 75% of their free throws in 20 attempts. How many did they make?',
        options: ['12 shots', '15 shots', '18 shots', '20 shots'],
        correctAnswer: 1,
        explanation: '75% of 20 = 0.75 × 20 = 15 successful free throws!',
        sportsContext: 'This player is having an excellent game!'
      }
    }
  ];

  console.log('✅ Generated', activities.length, 'EXCITING interactive math activities');
  return activities;
};
