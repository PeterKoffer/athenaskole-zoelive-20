
import { LessonActivity } from '../types/LessonTypes';

export const createComputerScienceLesson = (skillArea: string): LessonActivity[] => {
  return [
    {
      id: 'cs-welcome',
      type: 'introduction',
      phase: 'introduction',
      title: 'Welcome to Computer Science',
      duration: 120,
      phaseDescription: 'Getting excited about coding and technology!',
      metadata: {
        subject: 'computerScience',
        skillArea: skillArea
      },
      content: {
        hook: 'Ready to explore the amazing world of computer science?',
        text: `Today we'll discover ${skillArea} and learn how computers think!`
      }
    },
    
    {
      id: 'cs-concept',
      type: 'content-delivery',
      phase: 'content-delivery',
      title: `Understanding ${skillArea}`,
      duration: 300,
      phaseDescription: 'Learning core computer science concepts',
      metadata: {
        subject: 'computerScience',
        skillArea: skillArea
      },
      content: {
        text: `Let's explore ${skillArea} in computer science!`,
        segments: [{
          title: `${skillArea} Fundamentals`,
          concept: skillArea,
          explanation: `In computer science, ${skillArea} helps us solve problems and create amazing technology.`,
          checkQuestion: {
            question: `What is ${skillArea} used for?`,
            options: ["Solving problems", "Creating technology", "Making computers work", "All of the above"],
            correctAnswer: 3,
            explanation: "Great! All these applications show how important this concept is!"
          }
        }, {
          title: `${skillArea} Applications`,
          concept: skillArea,
          explanation: `${skillArea} is used in many real-world applications like games, websites, and mobile apps.`,
          checkQuestion: {
            question: `Where can we see ${skillArea} in action?`,
            options: ["Video games", "Websites", "Mobile apps", "All of the above"],
            correctAnswer: 3,
            explanation: "Excellent! Technology is everywhere around us!"
          }
        }, {
          title: `${skillArea} Problem Solving`,
          concept: skillArea,
          explanation: `Computer scientists use ${skillArea} to break down complex problems into smaller, manageable parts.`,
          checkQuestion: {
            question: `How do computer scientists approach problems?`,
            options: ["Break them into small parts", "Use logic and creativity", "Test solutions", "All of the above"],
            correctAnswer: 3,
            explanation: "Perfect! That's exactly how we solve problems in computer science!"
          }
        }]
      }
    },
    
    {
      id: 'cs-summary',
      type: 'summary',
      phase: 'summary',
      title: 'Computer Science Mastery!',
      duration: 90,
      phaseDescription: 'Celebrating your computer science learning',
      metadata: {
        subject: 'computerScience',
        skillArea: skillArea
      },
      content: {
        keyTakeaways: [
          `You learned about ${skillArea}`,
          'You understand how computers solve problems',
          'You can think like a computer scientist!'
        ],
        nextTopicSuggestion: `Next, explore more computer science concepts like algorithms or programming!`
      }
    }
  ];
};
