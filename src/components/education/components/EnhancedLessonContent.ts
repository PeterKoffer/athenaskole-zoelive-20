
export interface LessonActivity {
  id: string;
  type: 'welcome' | 'explanation' | 'question' | 'game' | 'practice' | 'celebration';
  title: string;
  duration: number; // in seconds
  content: any;
  speech: string;
}

export const createMathematicsLesson = (): LessonActivity[] => {
  return [
    {
      id: 'welcome',
      type: 'welcome',
      title: 'Welcome to Mathematics!',
      duration: 90,
      speech: "Hello my wonderful student! I'm Nelie, your AI learning companion, and I'm absolutely thrilled to explore the amazing world of Mathematics with you today! Mathematics is like a magical language that helps us understand patterns, solve puzzles, and discover how everything around us works. Are you ready for an exciting mathematical adventure with me?",
      content: {
        message: "Welcome to your Mathematics adventure with Nelie!",
        animation: "wave"
      }
    },
    {
      id: 'intro-explanation',
      type: 'explanation', 
      title: 'What Makes Math Amazing',
      duration: 120,
      speech: "You know what's really cool about mathematics? It's everywhere! When you count your toys, when you share cookies with friends, when you look at the beautiful patterns in flowers - that's all mathematics! Today we're going to become math detectives and discover some incredible secrets about numbers. I'll be right here to help you every step of the way!",
      content: {
        text: "Mathematics is the language of patterns and problem-solving!",
        examples: ["Counting objects", "Sharing equally", "Finding patterns", "Solving puzzles"]
      }
    },
    {
      id: 'warmup-question',
      type: 'question',
      title: 'Let\'s Warm Up Our Math Brains!',
      duration: 180,
      speech: "Let's start with a fun warm-up question to get our math brains excited! Here's your first challenge:",
      content: {
        question: "If you have 5 colorful balloons and I give you 3 more beautiful balloons, how many balloons will you have in total?",
        options: ["7 balloons", "8 balloons", "9 balloons", "6 balloons"],
        correct: 1,
        explanation: "Great thinking! When we add 5 balloons plus 3 balloons, we get 8 balloons total! You can count them: 5, 6, 7, 8. Addition is like bringing groups together!",
        encouragement: "Fantastic work! You're already thinking like a mathematician!"
      }
    },
    {
      id: 'number-pattern-game',
      type: 'game',
      title: 'Number Pattern Detective Game',
      duration: 240,
      speech: "Now let's play my favorite game - Number Pattern Detective! I'm going to show you a sequence of numbers, and you need to figure out what comes next. Ready to be a detective?",
      content: {
        gameType: "pattern",
        sequence: [2, 4, 6, 8, "?"],
        options: [9, 10, 11, 12],
        correct: 1,
        explanation: "Brilliant detective work! The pattern is counting by 2s: 2, 4, 6, 8, 10! Each number is 2 more than the one before it.",
        hint: "Look at how much each number increases from the previous one!"
      }
    },
    {
      id: 'story-problem',
      type: 'question',
      title: 'Math Story Adventure',
      duration: 200,
      speech: "I love telling math stories! Let me tell you about Maya's adventure at the zoo. Listen carefully because there's a math puzzle hidden in the story!",
      content: {
        story: "Maya went to the zoo and saw 12 monkeys playing in the trees. Then 4 monkeys went inside for lunch. How many monkeys were still playing outside?",
        question: "How many monkeys were still playing outside?",
        options: ["8 monkeys", "7 monkeys", "9 monkeys", "6 monkeys"],
        correct: 0,
        explanation: "Perfect! Maya started with 12 monkeys, then 4 went inside. So 12 minus 4 equals 8 monkeys still playing outside! Subtraction helps us find out how many are left.",
        followUp: "Subtraction is like taking away. It's the opposite of addition!"
      }
    },
    {
      id: 'shape-exploration',
      type: 'explanation',
      title: 'Amazing World of Shapes',
      duration: 150,
      speech: "Now let's explore the fascinating world of shapes! Shapes are all around us, and each one has special properties that make it unique. Let me show you some magical shapes!",
      content: {
        shapes: [
          { name: "Circle", properties: "Round, no corners, like a ball or wheel" },
          { name: "Triangle", properties: "3 sides, 3 corners, like a slice of pizza" },
          { name: "Square", properties: "4 equal sides, 4 corners, like a window" },
          { name: "Rectangle", properties: "4 sides, opposite sides equal, like a door" }
        ],
        activity: "Can you find these shapes around your room?"
      }
    },
    {
      id: 'shape-question',
      type: 'question',
      title: 'Shape Detective Challenge',
      duration: 160,
      speech: "Time for a shape detective challenge! Look at this question carefully and use what we just learned about shapes:",
      content: {
        question: "Which shape has exactly 3 corners and 3 sides?",
        options: ["Circle", "Triangle", "Square", "Rectangle"],
        correct: 1,
        explanation: "Excellent! A triangle has exactly 3 corners and 3 sides. The word 'tri' means three, so a triangle is a shape with three of everything!",
        bonus: "Triangles are super strong shapes - that's why they're used in bridges!"
      }
    },
    {
      id: 'counting-game',
      type: 'game',
      title: 'Super Counting Challenge',
      duration: 180,
      speech: "Let's play the Super Counting Challenge! I'm going to give you a counting puzzle that will make your brain sparkle with mathematical magic!",
      content: {
        gameType: "counting",
        challenge: "Count by 5s starting from 5. What number comes after 15?",
        sequence: [5, 10, 15, "?"],
        options: [18, 20, 25, 16],
        correct: 2,
        explanation: "Amazing counting! When we count by 5s, we add 5 each time: 5, 10, 15, 20! Counting by groups helps us count faster!",
        extension: "Try counting by 5s up to 50: 5, 10, 15, 20, 25, 30, 35, 40, 45, 50!"
      }
    },
    {
      id: 'word-problem',
      type: 'question',
      title: 'Real-World Math Magic',
      duration: 190,
      speech: "Mathematics isn't just numbers - it helps us solve real problems! Here's a real-world challenge that happens every day:",
      content: {
        scenario: "At a birthday party, there are 15 children. If 8 children are girls, how many children are boys?",
        question: "How many boys are at the party?",
        options: ["6 boys", "7 boys", "8 boys", "9 boys"],
        correct: 1,
        explanation: "Wonderful thinking! If there are 15 children total and 8 are girls, then 15 minus 8 equals 7 boys. We used subtraction to solve a real-world problem!",
        realWorld: "Math helps us solve everyday problems like this!"
      }
    },
    {
      id: 'final-challenge',
      type: 'question',
      title: 'Grand Finale Challenge',
      duration: 200,
      speech: "Here's our grand finale challenge! This is a bit trickier, but I know you can do it because you've been such an amazing mathematician today!",
      content: {
        question: "Sarah has 24 stickers. She wants to put them in groups of 6. How many groups can she make?",
        options: ["3 groups", "4 groups", "5 groups", "6 groups"],
        correct: 1,
        explanation: "Outstanding mathematical thinking! 24 divided by 6 equals 4 groups. Division helps us see how many equal groups we can make from a bigger number!",
        celebration: "You've mastered addition, subtraction, shapes, patterns, and even division!"
      }
    },
    {
      id: 'celebration',
      type: 'celebration',
      title: 'You\'re a Math Champion!',
      duration: 120,
      speech: "Wow! You've been absolutely incredible today! You solved problems, found patterns, identified shapes, and showed amazing mathematical thinking. You're officially a Math Champion! Remember, mathematics is all around us, and with practice, you'll discover even more mathematical magic. I'm so proud of you, and I can't wait for our next mathematical adventure together!",
      content: {
        achievements: [
          "Mastered addition and subtraction",
          "Discovered number patterns", 
          "Explored amazing shapes",
          "Solved real-world problems",
          "Became a Math Champion!"
        ],
        encouragement: "Keep practicing and exploring - mathematics is everywhere!"
      }
    }
  ];
};

export const createEnglishLesson = (): LessonActivity[] => {
  return [
    {
      id: 'welcome',
      type: 'welcome',
      title: 'Welcome to English Adventures!',
      duration: 90,
      speech: "Hello there, amazing reader! I'm Nelie, and I'm absolutely delighted to embark on an incredible English language adventure with you today! English is like a treasure chest full of beautiful words, exciting stories, and powerful ways to express your thoughts and feelings. Are you ready to discover the magic of language together?",
      content: {
        message: "Welcome to your English adventure with Nelie!",
        animation: "bookOpen"
      }
    },
    {
      id: 'intro-explanation',
      type: 'explanation',
      title: 'The Magic of Words',
      duration: 120,
      speech: "Did you know that words are like magical tools? With words, we can paint pictures in people's minds, share our feelings, tell amazing stories, and connect with friends all around the world! Today we're going to explore reading comprehension, which means understanding and enjoying what we read. I'll be your guide on this wonderful journey!",
      content: {
        text: "Words are powerful tools for communication and imagination!",
        examples: ["Telling stories", "Sharing feelings", "Asking questions", "Making friends"]
      }
    },
    {
      id: 'reading-warmup',
      type: 'question',
      title: 'Reading Detective Warm-up',
      duration: 180,
      speech: "Let's start by being reading detectives! I'm going to share a short, fun story with you, and then ask you a question about it. Listen carefully!",
      content: {
        passage: "Luna the cat loved to explore. Every morning, she would climb the tall oak tree in her backyard to watch the sunrise. From up high, she could see the whole neighborhood waking up.",
        question: "Where did Luna like to climb every morning?",
        options: ["A fence", "The tall oak tree", "The roof", "A ladder"],
        correct: 1,
        explanation: "Perfect reading! The story tells us that Luna loved to climb the tall oak tree in her backyard every morning. Great job paying attention to the details!",
        encouragement: "You're already showing excellent reading comprehension skills!"
      }
    }
    // ... (continuing with more English activities following the same pattern)
  ];
};

export const createScienceLesson = (): LessonActivity[] => {
  return [
    {
      id: 'welcome',
      type: 'welcome', 
      title: 'Welcome to Science Discoveries!',
      duration: 90,
      speech: "Hello, future scientist! I'm Nelie, and I'm absolutely thrilled to explore the fascinating world of science with you today! Science is like being a detective, but instead of solving mysteries about people, we solve mysteries about how our amazing world works. Get ready for some mind-blowing discoveries!",
      content: {
        message: "Welcome to your Science adventure with Nelie!",
        animation: "microscope"
      }
    }
    // ... (continuing with science activities)
  ];
};
