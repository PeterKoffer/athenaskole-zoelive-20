
interface IntroductionSection {
  title: string;
  text: string;
  duration: number;
}

interface SubjectIntroduction {
  title: string;
  sections: IntroductionSection[];
}

const createWelcomeSection = (subject: string, userName: string = 'Student'): IntroductionSection => ({
  title: "Welcome to Class",
  text: `Welcome to your ${subject.toLowerCase()} lesson, ${userName}! Today we'll be exploring different concepts together.`,
  duration: 8
});

const subjectIntroductions: Record<string, (skillArea?: string, level?: string, userName?: string) => SubjectIntroduction> = {
  mathematics: (skillArea = "general math", level = "beginner", userName = "Student") => ({
    title: `Mathematics with Nelie - Welcome ${userName}!`,
    sections: [
      createWelcomeSection("Mathematics", userName),
      {
        title: "What is Mathematics?",
        text: `Mathematics is like a beautiful language that helps us understand patterns, solve problems, and make sense of the world around us, ${userName}! Whether you're ${level === 'beginner' ? 'just starting out' : 'building on what you already know'}, we'll explore ${skillArea} together. Math is everywhere - from counting your toys to understanding how tall buildings stay up!`,
        duration: 10
      },
      {
        title: "What We'll Learn Today",
        text: `Today, ${userName}, we're going to focus on ${skillArea}. I'll break everything down into simple, easy-to-understand steps. We'll practice together, and I'll be here to help you every step of the way. Remember, every mathematician started exactly where you are now, so let's discover the magic of numbers together!`,
        duration: 8
      }
    ]
  }),

  english: (skillArea = "language arts", level = "beginner", userName = "Student") => ({
    title: `English Language Arts with Nelie - Welcome ${userName}!`,
    sections: [
      createWelcomeSection("English", userName),
      {
        title: "The Magic of Language",
        text: `English is an incredible language that opens doors to amazing stories, beautiful poetry, and clear communication, ${userName}! ${level === 'beginner' ? 'If this is your first time exploring English deeply' : 'Building on your English knowledge'}, we'll dive into ${skillArea} together. Language is like a superpower that lets us share our thoughts and dreams with others!`,
        duration: 10
      },
      {
        title: "Our Learning Adventure",
        text: `In today's lesson, ${userName}, we'll explore ${skillArea}. We'll read together, discover new words, and learn how to express ourselves clearly and creatively. I'll guide you through each concept, making sure you feel confident and excited about using the English language!`,
        duration: 8
      }
    ]
  }),

  science: (skillArea = "general science", level = "beginner", userName = "Student") => ({
    title: `Science Exploration with Nelie - Welcome ${userName}!`,
    sections: [
      createWelcomeSection("Science", userName),
      {
        title: "The Wonder of Science",
        text: `Science is all about curiosity and discovery, ${userName}! It's how we learn about everything from tiny atoms to massive galaxies, from how plants grow to how computers work. ${level === 'beginner' ? 'Even if you\'ve never studied science before' : 'Building on your scientific knowledge'}, we'll explore ${skillArea} together and uncover the amazing secrets of our universe!`,
        duration: 10
      },
      {
        title: "Today's Scientific Journey",
        text: `Today, ${userName}, we're going to investigate ${skillArea}. We'll ask questions, make observations, and discover how things work. Science is like being a detective - we look for clues and solve mysteries about the natural world. Get ready for some amazing discoveries!`,
        duration: 8
      }
    ]
  }),

  music: (skillArea = "music basics", level = "beginner", userName = "Student") => ({
    title: `Music Discovery with Nelie - Welcome ${userName}!`,
    sections: [
      createWelcomeSection("Music", userName),
      {
        title: "The Language of Music",
        text: `Music is a universal language that speaks to our hearts and souls, ${userName}! It's made up of rhythm, melody, and harmony that can make us feel happy, peaceful, or excited. ${level === 'beginner' ? 'Whether you\'ve never played an instrument before' : 'Building on your musical foundation'}, we'll explore ${skillArea} together and discover the joy of creating beautiful sounds!`,
        duration: 10
      },
      {
        title: "Our Musical Journey",
        text: `In today's lesson, ${userName}, we'll dive into ${skillArea}. We'll listen, learn, and maybe even create some music together! Music helps us express our feelings and connect with others. Let's make some beautiful music and have fun learning!`,
        duration: 8
      }
    ]
  }),

  "computer-science": (skillArea = "coding basics", level = "beginner", userName = "Student") => ({
    title: `Computer Science with Nelie - Welcome ${userName}!`,
    sections: [
      createWelcomeSection("Computer Science", userName),
      {
        title: "The Digital World",
        text: `Computer science is like magic, but it's real, ${userName}! It's how we create apps, games, websites, and all the amazing technology around us. ${level === 'beginner' ? 'Even if you\'ve never coded before' : 'Building on your programming knowledge'}, we'll explore ${skillArea} together. Coding is like giving instructions to a computer in a special language it can understand!`,
        duration: 10
      },
      {
        title: "Today's Tech Adventure",
        text: `Today, ${userName}, we're going to learn about ${skillArea}. We'll think like programmers, solve problems step by step, and maybe even create something cool together! Computer science teaches us logical thinking and creativity. Let's start building the future!`,
        duration: 8
      }
    ]
  }),

  "creative-arts": (skillArea = "artistic expression", level = "beginner", userName = "Student") => ({
    title: `Creative Arts with Nelie - Welcome ${userName}!`,
    sections: [
      createWelcomeSection("Creative Arts", userName),
      {
        title: "The World of Creativity",
        text: `Art is everywhere around us - in the colors of a sunset, the design of buildings, and the stories in movies, ${userName}! Creative arts let us express our imagination and share our unique view of the world. ${level === 'beginner' ? 'Whether you\'re picking up art supplies for the first time' : 'Building on your artistic skills'}, we'll explore ${skillArea} together and unleash your creativity!`,
        duration: 10
      },
      {
        title: "Our Creative Journey",
        text: `In today's lesson, ${userName}, we'll dive into ${skillArea}. We'll experiment, create, and discover new ways to express ourselves through art. Remember, there's no wrong way to be creative - every artist has their own special style. Let's create something amazing together!`,
        duration: 8
      }
    ]
  })
};

export const getSubjectIntroduction = (
  subject: string, 
  skillArea?: string, 
  level: string = "beginner",
  userName: string = "Student"
): SubjectIntroduction => {
  const subjectKey = subject.toLowerCase().replace(/[^a-z-]/g, '');
  const introductionBuilder = subjectIntroductions[subjectKey] || subjectIntroductions.mathematics;
  return introductionBuilder(skillArea, level, userName);
};

export const getEstimatedIntroductionTime = (subject: string, skillArea?: string): number => {
  const introduction = getSubjectIntroduction(subject, skillArea);
  return introduction.sections.reduce((total, section) => total + section.duration, 0);
};
