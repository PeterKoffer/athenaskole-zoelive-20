
import { LessonActivity } from '../types/LessonTypes';

export const createMusicLesson = (skillArea: string): LessonActivity[] => {
  return [
    {
      id: 'music-welcome',
      type: 'introduction',
      phase: 'introduction',
      title: 'Welcome to Music',
      duration: 120,
      phaseDescription: 'Discovering the joy and beauty of music!',
      metadata: {
        subject: 'music',
        skillArea: skillArea
      },
      content: {
        hook: 'Ready to explore the wonderful world of music?',
        text: `Today we'll learn about ${skillArea} and discover how music enriches our lives!`
      }
    },
    
    {
      id: 'music-concept',
      type: 'content-delivery',
      phase: 'content-delivery',
      title: `Understanding ${skillArea}`,
      duration: 300,
      phaseDescription: 'Learning musical concepts and appreciation',
      metadata: {
        subject: 'music',
        skillArea: skillArea
      },
      content: {
        text: `Let's explore the magical elements of ${skillArea}!`,
        segments: [{
          title: `${skillArea} Elements`,
          concept: skillArea,
          explanation: `${skillArea} includes important musical elements like rhythm, melody, and harmony that create beautiful sounds.`,
          checkQuestion: {
            question: `What are the key elements of ${skillArea}?`,
            options: ["Rhythm", "Melody", "Harmony", "All of the above"],
            correctAnswer: 3,
            explanation: "Wonderful! These elements work together to create music!"
          }
        }, {
          title: `${skillArea} Expression`,
          concept: skillArea,
          explanation: `Music allows us to express emotions and tell stories through ${skillArea} in ways that words alone cannot.`,
          checkQuestion: {
            question: `How does ${skillArea} help us express ourselves?`,
            options: ["Shows emotions", "Tells stories", "Creates connections", "All of the above"],
            correctAnswer: 3,
            explanation: "Perfect! Music is a powerful form of expression!"
          }
        }, {
          title: `${skillArea} in Culture`,
          concept: skillArea,
          explanation: `${skillArea} is found in every culture around the world, bringing people together and celebrating traditions.`,
          checkQuestion: {
            question: `What role does ${skillArea} play in cultures?`,
            options: ["Brings people together", "Celebrates traditions", "Preserves history", "All of the above"],
            correctAnswer: 3,
            explanation: "Excellent! Music is a universal language that connects us all!"
          }
        }]
      }
    },
    
    {
      id: 'music-summary',
      type: 'summary',
      phase: 'summary',
      title: 'Musical Mastery!',
      duration: 90,
      phaseDescription: 'Celebrating your musical journey',
      metadata: {
        subject: 'music',
        skillArea: skillArea
      },
      content: {
        keyTakeaways: [
          `You explored ${skillArea}`,
          'You understand musical expression',
          'You appreciate music from different cultures!'
        ],
        nextTopicSuggestion: `Continue your musical journey by exploring more ${skillArea} or learning about other musical styles!`
      }
    }
  ];
};
