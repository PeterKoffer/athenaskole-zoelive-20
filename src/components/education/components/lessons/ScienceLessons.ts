
import { LessonActivity } from '../types/LessonTypes';

export const createScienceLesson = (skillArea: string): LessonActivity[] => {
  return [
    {
      id: 'science-welcome',
      type: 'introduction',
      phase: 'introduction',
      title: 'Welcome to Science',
      duration: 120,
      phaseDescription: 'Discovering the wonders of the natural world!',
      metadata: {
        subject: 'science',
        skillArea: skillArea
      },
      content: {
        hook: 'Ready to explore the amazing world of science?',
        text: `Today we'll investigate ${skillArea} and uncover the secrets of nature!`
      }
    },
    
    {
      id: 'science-concept',
      type: 'content-delivery',
      phase: 'content-delivery',
      title: `Investigating ${skillArea}`,
      duration: 300,
      phaseDescription: 'Learning scientific concepts and inquiry',
      metadata: {
        subject: 'science',
        skillArea: skillArea
      },
      content: {
        text: `Let's investigate the fascinating world of ${skillArea}!`,
        segments: [{
          title: `${skillArea} Concepts`,
          concept: skillArea,
          explanation: `${skillArea} helps us understand how the natural world works through observation and experimentation.`,
          checkQuestion: {
            question: `How do scientists study ${skillArea}?`,
            options: ["Observation", "Experimentation", "Analysis", "All of the above"],
            correctAnswer: 3,
            explanation: "Excellent! Scientists use many methods to understand nature!"
          }
        }, {
          title: `${skillArea} in Nature`,
          concept: skillArea,
          explanation: `We can see ${skillArea} all around us in nature, from tiny atoms to vast galaxies.`,
          checkQuestion: {
            question: `Where can we observe ${skillArea}?`,
            options: ["In plants and animals", "In weather patterns", "In space", "All of the above"],
            correctAnswer: 3,
            explanation: "Perfect! Science is everywhere in the natural world!"
          }
        }]
      }
    },
    
    {
      id: 'science-summary',
      type: 'summary',
      phase: 'summary',
      title: 'Scientific Discovery!',
      duration: 90,
      phaseDescription: 'Celebrating your scientific learning',
      metadata: {
        subject: 'science',
        skillArea: skillArea
      },
      content: {
        keyTakeaways: [
          `You explored ${skillArea}`,
          'You learned to think like a scientist',
          'You discovered how science explains our world!'
        ],
        nextTopicSuggestion: `Continue exploring with more ${skillArea} experiments or investigate other scientific topics!`
      }
    }
  ];
};
