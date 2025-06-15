
export const generateMathActivities = async () => {
  console.log('🔢 Generating optimized math activities');
  
  // Start directly with Mental Math Strategies
  const activities = [
    {
      id: 'mental-math-strategies',
      type: 'content-delivery' as const,
      phase: 'content-delivery' as const,
      title: 'Mental Math Strategies',
      content: {
        text: 'Let\'s learn some powerful mental math strategies that will make solving problems faster and easier!',
        segments: [
          {
            concept: 'Mental Math Strategies Overview',
            explanation: 'Mental math strategies help you solve problems in your head quickly and accurately. We\'ll explore number bonds, compensation, doubling and halving, and benchmark numbers.'
          }
        ]
      },
      difficulty: 1,
      estimatedDuration: 180,
      learningObjectives: ['Understanding mental math strategies', 'Learning number bonds', 'Practicing compensation techniques']
    },
    
    // Practice activities
    {
      id: 'number-bonds-practice',
      type: 'interactive-game' as const,
      phase: 'interactive-game' as const,
      title: 'Number Bonds Practice',
      content: {
        question: 'What is 8 + 7?',
        options: ['14', '15', '16', '17'],
        correctAnswer: '15',
        explanation: 'Using number bonds: 8 + 7 = 8 + 2 + 5 = 10 + 5 = 15'
      },
      difficulty: 2,
      estimatedDuration: 120
    },
    
    {
      id: 'compensation-practice',
      type: 'interactive-game' as const,
      phase: 'interactive-game' as const,
      title: 'Compensation Strategy',
      content: {
        question: 'What is 29 + 15?',
        options: ['42', '43', '44', '45'],
        correctAnswer: '44',
        explanation: 'Using compensation: 29 + 15 = 30 + 15 - 1 = 45 - 1 = 44'
      },
      difficulty: 2,
      estimatedDuration: 120
    },
    
    {
      id: 'doubling-halving-practice',
      type: 'interactive-game' as const,
      phase: 'interactive-game' as const,
      title: 'Doubling & Halving',
      content: {
        question: 'What is 6 × 8?',
        options: ['46', '47', '48', '49'],
        correctAnswer: '48',
        explanation: 'Using doubling: 6 × 8 = (6 × 4) × 2 = 24 × 2 = 48'
      },
      difficulty: 3,
      estimatedDuration: 120
    },
    
    {
      id: 'benchmark-numbers-practice',
      type: 'interactive-game' as const,
      phase: 'interactive-game' as const,
      title: 'Benchmark Numbers',
      content: {
        question: 'What is 98 + 47?',
        options: ['143', '144', '145', '146'],
        correctAnswer: '145',
        explanation: 'Using benchmark numbers: 98 + 47 = 100 + 47 - 2 = 147 - 2 = 145'
      },
      difficulty: 3,
      estimatedDuration: 120
    },
    
    // Additional practice problems
    {
      id: 'mixed-strategies-1',
      type: 'interactive-game' as const,
      phase: 'interactive-game' as const,
      title: 'Mixed Strategy Practice',
      content: {
        question: 'What is 25 + 38?',
        options: ['61', '62', '63', '64'],
        correctAnswer: '63',
        explanation: 'Using compensation: 25 + 38 = 25 + 40 - 2 = 65 - 2 = 63'
      },
      difficulty: 2,
      estimatedDuration: 120
    },
    
    {
      id: 'mixed-strategies-2',
      type: 'interactive-game' as const,
      phase: 'interactive-game' as const,
      title: 'Mental Math Challenge',
      content: {
        question: 'What is 7 × 9?',
        options: ['61', '62', '63', '64'],
        correctAnswer: '63',
        explanation: 'Using known facts: 7 × 9 = 7 × 10 - 7 = 70 - 7 = 63'
      },
      difficulty: 3,
      estimatedDuration: 120
    }
  ];

  console.log('✅ Generated', activities.length, 'math activities starting with Mental Math Strategies');
  return activities;
};
