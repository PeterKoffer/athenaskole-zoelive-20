
import { LessonActivity } from '../types/LessonTypes';

export const createCreativeArtsLesson = (skillArea: string): LessonActivity[] => {
  return [
    {
      id: 'arts-welcome',
      type: 'introduction',
      phase: 'introduction',
      title: 'Welcome to Creative Arts',
      duration: 120,
      phaseDescription: 'Unleashing your creative potential!',
      metadata: {
        subject: 'creativeArts',
        skillArea: skillArea
      },
      content: {
        hook: 'Ready to express yourself through art?',
        text: `Today we'll explore ${skillArea} and discover your artistic talents!`
      }
    },
    
    {
      id: 'arts-concept',
      type: 'content-delivery',
      phase: 'content-delivery',
      title: `Exploring ${skillArea}`,
      duration: 300,
      phaseDescription: 'Learning artistic techniques and concepts',
      metadata: {
        subject: 'creativeArts',
        skillArea: skillArea
      },
      content: {
        text: `Let's dive into the world of ${skillArea}!`,
        segments: [{
          title: `${skillArea} Basics`,
          concept: skillArea,
          explanation: `${skillArea} is a wonderful way to express creativity and emotions through visual elements.`,
          checkQuestion: {
            question: `What can we express through ${skillArea}?`,
            options: ["Emotions", "Ideas", "Stories", "All of the above"],
            correctAnswer: 3,
            explanation: "Wonderful! Art is a universal language of expression!"
          }
        }, {
          title: `${skillArea} Techniques`,
          concept: skillArea,
          explanation: `Artists use various techniques in ${skillArea} to create different effects and styles.`,
          checkQuestion: {
            question: `Why do artists use different techniques?`,
            options: ["To create variety", "To express different moods", "To tell stories", "All of the above"],
            correctAnswer: 3,
            explanation: "Excellent! Techniques help artists communicate their vision!"
          }
        }, {
          title: `${skillArea} in Culture`,
          concept: skillArea,
          explanation: `${skillArea} plays an important role in cultures around the world, telling stories and preserving history.`,
          checkQuestion: {
            question: `How does ${skillArea} help cultures?`,
            options: ["Tells stories", "Preserves history", "Shares traditions", "All of the above"],
            correctAnswer: 3,
            explanation: "Perfect! Art connects us across time and cultures!"
          }
        }]
      }
    },
    
    {
      id: 'arts-summary',
      type: 'summary',
      phase: 'summary',
      title: 'Creative Arts Achievement!',
      duration: 90,
      phaseDescription: 'Celebrating your artistic journey',
      metadata: {
        subject: 'creativeArts',
        skillArea: skillArea
      },
      content: {
        keyTakeaways: [
          `You explored ${skillArea}`,
          'You learned about artistic expression',
          'You discovered your creative potential!'
        ],
        nextTopicSuggestion: `Continue creating with more ${skillArea} projects or explore other art forms!`
      }
    }
  ];
};
