
import { LessonActivity } from '../types/LessonTypes';

export interface WelcomeActivityConfig {
  subject: string;
  skillArea: string;
  studentName?: string;
  gradeLevel?: number;
}

export const generateWelcomeActivity = (config: WelcomeActivityConfig): LessonActivity => {
  const { subject, skillArea, studentName = 'Student', gradeLevel = 6 } = config;
  
  const welcomeMessages = [
    `Welcome ${studentName}! Ready for an amazing ${subject} adventure?`,
    `Hi ${studentName}! Let's explore the wonderful world of ${subject} together!`,
    `Hello ${studentName}! Today we're going to have so much fun learning ${subject}!`,
    `Welcome to your ${subject} journey, ${studentName}! Let's discover something incredible!`
  ];

  const randomWelcome = welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];

  return {
    id: `welcome_${subject}_${Date.now()}`,
    type: 'introduction',
    phase: 'introduction',
    title: `Welcome to ${subject}!`,
    duration: 120,
    phaseDescription: `Welcoming introduction to ${subject} learning`,
    metadata: {
      subject,
      skillArea,
      gradeLevel,
      studentName
    },
    content: {
      hook: randomWelcome
    }
  };
};

export const generateSubjectSpecificWelcome = (subject: string, skillArea: string): LessonActivity => {
  const subjectEmojis: { [key: string]: string } = {
    mathematics: '🔢',
    science: '🔬',
    english: '📚',
    history: '🏛️',
    art: '🎨',
    music: '🎵',
    'computer-science': '💻'
  };

  const emoji = subjectEmojis[subject.toLowerCase()] || '📖';

  return generateWelcomeActivity({
    subject: `${emoji} ${subject}`,
    skillArea
  });
};
