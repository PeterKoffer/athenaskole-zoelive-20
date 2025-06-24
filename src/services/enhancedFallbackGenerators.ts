
export class EnhancedFallbackGenerators {
  static generateMathFallback(config: any) {
    const scenarios = [
      'Library Adventure', 'Space Mission', 'Cooking Challenge', 'Garden Project',
      'Sports Tournament', 'Art Gallery', 'Music Festival', 'Science Fair'
    ];
    
    const characters = [
      'Alex', 'Sam', 'Jordan', 'Casey', 'Riley', 'Morgan', 'Avery', 'Quinn'
    ];

    const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
    const character = characters[Math.floor(Math.random() * characters.length)];
    const num1 = Math.floor(Math.random() * 50) + 10;
    const num2 = Math.floor(Math.random() * 30) + 5;
    const operation = ['+', '-'][Math.floor(Math.random() * 2)];

    let question, correctAnswer;
    
    if (operation === '+') {
      question = `During the ${scenario}, ${character} collected ${num1} items and then found ${num2} more items. How many items does ${character} have in total?`;
      correctAnswer = num1 + num2;
    } else {
      const larger = Math.max(num1, num2);
      const smaller = Math.min(num1, num2);
      question = `${character} started the ${scenario} with ${larger} points and used ${smaller} points. How many points does ${character} have left?`;
      correctAnswer = larger - smaller;
    }

    const wrongAnswers = [
      correctAnswer + Math.floor(Math.random() * 10) + 1,
      correctAnswer - Math.floor(Math.random() * 10) - 1,
      Math.floor(correctAnswer * 1.5)
    ].filter(ans => ans !== correctAnswer && ans > 0);

    const allOptions = [correctAnswer, ...wrongAnswers.slice(0, 3)]
      .sort(() => Math.random() - 0.5);

    return {
      question,
      options: allOptions.map(String),
      correctAnswer: allOptions.indexOf(correctAnswer),
      explanation: `${character} ${operation === '+' ? 'added' : 'subtracted'} to get ${correctAnswer}.`
    };
  }

  static generateEnglishFallback(config: any) {
    const stories = [
      'The brave knight discovered a hidden castle in the enchanted forest.',
      'The curious scientist found a mysterious glowing crystal in the cave.',
      'The clever detective solved the puzzle using the hidden clues.',
      'The young artist painted a beautiful rainbow after the storm.'
    ];

    const story = stories[Math.floor(Math.random() * stories.length)];
    const words = story.split(' ');
    const targetWord = words[Math.floor(Math.random() * words.length)];

    return {
      question: `Read this sentence: "${story}" What does the word "${targetWord}" mean in this context?`,
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      correctAnswer: 0,
      explanation: `In this context, "${targetWord}" refers to the subject of the sentence.`
    };
  }

  static generateScienceFallback(config: any) {
    const experiments = [
      'Why do plants grow toward the light?',
      'What happens when you mix oil and water?',
      'Why do some objects float while others sink?',
      'How do butterflies know where to migrate?'
    ];

    const question = experiments[Math.floor(Math.random() * experiments.length)];

    return {
      question,
      options: ['Scientific reason A', 'Scientific reason B', 'Scientific reason C', 'Scientific reason D'],
      correctAnswer: 0,
      explanation: 'This is a fascinating scientific phenomenon that demonstrates natural laws.'
    };
  }

  static generateCreativeFallback(config: any) {
    const prompts = [
      'Write about a magical door that leads to...',
      'Describe a day when gravity stopped working...',
      'Tell the story of a robot who learned to...',
      'Imagine a world where colors have sounds...'
    ];

    const prompt = prompts[Math.floor(Math.random() * prompts.length)];

    return {
      question: `Creative writing challenge: ${prompt}`,
      options: ['Creative idea A', 'Creative idea B', 'Creative idea C', 'Creative idea D'],
      correctAnswer: Math.floor(Math.random() * 4),
      explanation: 'All creative ideas are valuable! Your imagination is the key to great storytelling.'
    };
  }

  static generateGenericFallback(config: any) {
    return {
      question: `What is an important concept in ${config.subject}?`,
      options: ['Concept A', 'Concept B', 'Concept C', 'Concept D'],
      correctAnswer: 0,
      explanation: `This is a fundamental concept in ${config.subject} that helps build understanding.`
    };
  }
}
