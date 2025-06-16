
interface IntroductionSection {
  title: string;
  text: string;
}

interface SubjectIntroduction {
  title: string;
  sections: IntroductionSection[];
}

export const getSubjectIntroduction = (
  subject: string,
  skillArea: string,
  userLevel: string,
  studentName: string
): SubjectIntroduction => {
  const firstName = studentName.split(' ')[0] || 'Student';
  
  switch (subject.toLowerCase()) {
    case 'english':
      return {
        title: `Welcome to English with Nelie, ${firstName}!`,
        sections: [
          {
            title: 'English Adventure Begins',
            text: `Hello ${firstName}! I'm Nelie, your English learning companion! Today we're going to explore the wonderful world of words, stories, and language together. Get ready for an amazing journey through reading, writing, and creative expression!`
          },
          {
            title: 'Language Magic Awaits',
            text: `We'll discover how words can paint pictures in our minds, how stories can take us to amazing places, and how you can express your own thoughts and ideas beautifully. Are you ready to become a master of the English language?`
          },
          {
            title: 'Let\'s Begin Our Adventure',
            text: `Today's lesson will help you build confidence with reading, expand your vocabulary, and develop your writing skills. Every word you learn makes you a stronger communicator!`
          }
        ]
      };

    case 'mathematics':
    case 'math':
      return {
        title: `Welcome to Mathematics with Nelie, ${firstName}!`,
        sections: [
          {
            title: 'Math Adventure Begins',
            text: `Hello ${firstName}! I'm Nelie, your math learning companion! Today we're going to explore the amazing world of numbers, patterns, and problem-solving together.`
          }
        ]
      };

    case 'science':
      return {
        title: `Welcome to Science with Nelie, ${firstName}!`,
        sections: [
          {
            title: 'Science Discovery Begins',
            text: `Hello ${firstName}! I'm Nelie, your science learning companion! Today we're going to explore the fascinating world of discovery, experiments, and understanding how things work around us.`
          }
        ]
      };

    default:
      return {
        title: `Welcome to ${subject} with Nelie, ${firstName}!`,
        sections: [
          {
            title: 'Learning Adventure Begins',
            text: `Hello ${firstName}! I'm Nelie, your learning companion! Today we're going to have an amazing educational adventure together.`
          }
        ]
      };
  }
};

export const getEstimatedIntroductionTime = (subject: string, skillArea?: string): number => {
  // Return estimated time in seconds based on subject
  switch (subject.toLowerCase()) {
    case 'english':
      return 45; // 45 seconds for English introduction
    case 'mathematics':
    case 'math':
      return 30; // 30 seconds for Math introduction
    case 'science':
      return 40; // 40 seconds for Science introduction
    default:
      return 35; // Default 35 seconds
  }
};
