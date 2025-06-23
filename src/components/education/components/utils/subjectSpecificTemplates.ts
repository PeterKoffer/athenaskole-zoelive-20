
import { LessonActivity } from '../types/LessonTypes';
import { UniversalContentGenerator } from './universalContentGenerator';

export class SubjectSpecificTemplates {
  
  static getMathematicsTemplate(skillArea: string, gradeLevel: number): LessonActivity[] {
    const lessonId = `math-enhanced-${Date.now()}`;
    
    return [
      // 1. Exciting Welcome
      {
        id: `${lessonId}-welcome`,
        type: 'introduction',
        phase: 'introduction',
        title: '🔢 Welcome to Math Magic! ✨',
        duration: 120,
        phaseDescription: 'Your mathematical adventure begins!',
        content: {
          hook: `Welcome to the most exciting math adventure ever! Today we're exploring ${skillArea} through amazing games, fun challenges, and cool discoveries that will make you feel like a math wizard!`,
          excitementBuilder: "Get ready for number magic, problem-solving adventures, and mathematical fun!",
          characterIntroduction: "I'm Nelie, and I'm here to make math the most amazing subject you've ever experienced!"
        }
      },
      
      // 2. Math Concept Discovery
      {
        id: `${lessonId}-concept`,
        type: 'content-delivery',
        phase: 'content-delivery',
        title: `🔍 Discovering ${skillArea}`,
        duration: 180,
        phaseDescription: 'Learning through exploration and fun!',
        content: {
          text: `Let's discover the amazing world of ${skillArea}! Math is everywhere around us!`,
          segments: [{
            concept: skillArea,
            explanation: `${skillArea} helps us solve real-world problems and understand patterns in our world. It's like having a superpower for logical thinking!`,
            checkQuestion: {
              question: "What makes math so amazing?",
              options: ["It helps solve problems!", "It's fun to learn!", "It's everywhere around us!", "All of the above!"],
              correctAnswer: 3,
              explanation: "Exactly! Math is amazing because it helps us solve problems, it's fun, and we can see it everywhere!"
            }
          }]
        }
      },
      
      // 3. Interactive Math Game 1
      {
        id: `${lessonId}-game1`,
        type: 'interactive-game',
        phase: 'interactive-game',
        title: '🎮 Math Challenge Arena!',
        duration: 200,
        phaseDescription: 'Interactive problem-solving fun!',
        content: {
          gameType: 'problem-solving',
          question: `🏆 Math Champion Challenge: Lisa has 47 stickers and gives 18 to her friends. How many stickers does Lisa have left?`,
          options: ['29', '35', '25', '31'],
          correctAnswer: 0,
          explanation: "Perfect! Lisa had 47 stickers and gave away 18, so 47 - 18 = 29 stickers left. You're a math champion!",
          celebrationLevel: 'HIGH'
        }
      },
      
      // 4. Pizza Fraction Factory (Enhanced)
      {
        id: `${lessonId}-pizza-factory`,
        type: 'simulation',
        phase: 'interactive-game',
        title: '🍕 Amazing Pizza Fraction Factory! 🏭',
        duration: 300,
        phaseDescription: 'Learn fractions through delicious pizza adventures!',
        content: {
          simulationDescription: "Welcome to the most amazing pizza factory in the world! You're the master pizza chef, and customers are ordering different fractions of pizzas!",
          scenarios: [
            {
              customer: "Alex the Explorer",
              challenge: "Alex wants 3/8 of a delicious pepperoni pizza for his adventure snack!",
              reward: "Adventure Badge and 50 pizza points!"
            },
            {
              customer: "Sophie the Scientist",
              challenge: "Sophie needs exactly 2/6 of a veggie pizza for her lab lunch!",
              reward: "Science Star and 75 pizza points!"
            },
            {
              customer: "Marcus the Musician",
              challenge: "Marcus wants 4/12 of a cheese pizza before his big concert!",
              reward: "Music Medal and 100 pizza points!"
            }
          ],
          celebrationLevel: 'EPIC',
          excitementLevel: 'MAXIMUM'
        }
      },
      
      // 5. Creative Math Building
      {
        id: `${lessonId}-creative`,
        type: 'creative-exploration',
        phase: 'creative-exploration',
        title: '🎨 Math Art Studio!',
        duration: 240,
        phaseDescription: 'Create amazing mathematical art!',
        content: {
          creativeType: 'build',
          creativePrompt: `Use your ${skillArea} knowledge to create beautiful mathematical patterns, shapes, or designs!`,
          tools: ['Pattern builder', 'Shape creator', 'Number art tools', 'Symmetry maker'],
          shareOpportunity: true,
          inspirationBoost: "Your math creativity is going to create something absolutely stunning!"
        }
      },
      
      // 6. Math Adventure Quest
      {
        id: `${lessonId}-adventure`,
        type: 'adventure-game',
        phase: 'interactive-game',
        title: '🗡️ Kingdom of Numbers Quest!',
        duration: 280,
        phaseDescription: 'Epic mathematical adventure!',
        content: {
          gameType: 'adventure-game',
          scenario: "🏰 The Mathematical Crown has been stolen from the Kingdom of Numbers! Only a brave math hero can solve the puzzles and retrieve it!",
          mechanics: `Use your ${skillArea} skills to overcome mathematical challenges and complete your heroic quest!`,
          rewards: ['Math Hero Badge', 'Number Crown', 'Problem-Solver Medal'],
          engagementHooks: ["Epic mathematical storyline!", "Challenging puzzles to solve!", "Amazing rewards await!"],
          celebrationAnimation: true
        }
      },
      
      // 7. Grand Math Celebration
      {
        id: `${lessonId}-finale`,
        type: 'summary',
        phase: 'summary',
        title: '🎉 Math Champion Celebration! 🏆',
        duration: 180,
        phaseDescription: 'Celebrating your mathematical mastery!',
        content: {
          keyTakeaways: [
            `You've mastered important ${skillArea} concepts!`,
            'Math helps us solve real-world problems every day!',
            'Practice makes you stronger and more confident!',
            'You can use these skills in amazing ways!'
          ],
          achievementsList: [
            'Became a Math Champion!',
            'Solved challenging problems!',
            'Created mathematical art!',
            'Completed the Kingdom Quest!',
            'Mastered new math skills!'
          ],
          celebration: "🎊 Congratulations! You've completed an incredible mathematical journey and should be extremely proud of your amazing achievements!",
          heroStatus: "You are now officially a Math Hero! 🦸‍♂️🔢"
        }
      }
    ];
  }

  static getEnglishTemplate(skillArea: string, gradeLevel: number): LessonActivity[] {
    const lessonId = `english-enhanced-${Date.now()}`;

    return UniversalContentGenerator.generateEngagingLesson('english', skillArea, gradeLevel);
  }

  static getScienceTemplate(skillArea: string, gradeLevel: number): LessonActivity[] {
    const lessonId = `science-enhanced-${Date.now()}`;

    return UniversalContentGenerator.generateEngagingLesson('science', skillArea, gradeLevel);
  }

  static getMusicTemplate(skillArea: string, gradeLevel: number): LessonActivity[] {
    const lessonId = `music-enhanced-${Date.now()}`;

    return UniversalContentGenerator.generateEngagingLesson('music', skillArea, gradeLevel);
  }

  static getComputerScienceTemplate(skillArea: string, gradeLevel: number): LessonActivity[] {
    const lessonId = `cs-enhanced-${Date.now()}`;

    return UniversalContentGenerator.generateEngagingLesson('computer-science', skillArea, gradeLevel);
  }

  static getCreativeArtsTemplate(skillArea: string, gradeLevel: number): LessonActivity[] {
    const lessonId = `arts-enhanced-${Date.now()}`;

    return UniversalContentGenerator.generateEngagingLesson('creative-arts', skillArea, gradeLevel);
  }

  static getTemplateForSubject(subject: string, skillArea: string, gradeLevel: number): LessonActivity[] {
    const subjectKey = subject.toLowerCase().replace(/[^a-z-]/g, '');
    
    switch (subjectKey) {
      case 'mathematics':
      case 'math':
        return this.getMathematicsTemplate(skillArea, gradeLevel);
      case 'english':
      case 'language-arts':
        return this.getEnglishTemplate(skillArea, gradeLevel);
      case 'science':
        return this.getScienceTemplate(skillArea, gradeLevel);
      case 'music':
        return this.getMusicTemplate(skillArea, gradeLevel);
      case 'computer-science':
      case 'coding':
        return this.getComputerScienceTemplate(skillArea, gradeLevel);
      case 'creative-arts':
      case 'art':
        return this.getCreativeArtsTemplate(skillArea, gradeLevel);
      default:
        return UniversalContentGenerator.generateEngagingLesson(subject, skillArea, gradeLevel);
    }
  }
}
