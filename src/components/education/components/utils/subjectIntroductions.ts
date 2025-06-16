
interface Introduction Section {
  title: string;
  text: string;
  duration: number;
}

interface SubjectIntroduction {
  title: string;
  sections: IntroductionSection[];
}

const createPersonalizedWelcome = (subject: string, userName: string = 'Student'): IntroductionSection => ({
  title: "Your Personal Welcome",
  text: `Hello there, amazing ${userName}! 🌟 I'm Nelie, your AI learning companion, and I'm absolutely thrilled to be your guide on this incredible ${subject.toLowerCase()} adventure! Today is going to be special because we're going to discover, play, learn, and have so much fun together. Are you ready to become a ${subject.toLowerCase()} superstar?`,
  duration: 12
});

const createSubjectMagic = (subject: string, skillArea: string, userName: string): IntroductionSection => {
  const subjectContent = {
    mathematics: {
      magic: `Mathematics is like having superpowers, ${userName}! 🔢✨ Numbers are everywhere around us - when you count your favorite toys, when you share snacks with friends, or even when you figure out how many minutes until recess! Math helps us solve puzzles, build amazing things, and understand the incredible patterns in our world. Today we're going to explore ${skillArea} through exciting games, fun challenges, and cool discoveries!`
    },
    english: {
      magic: `English is pure magic, ${userName}! 📚✨ Words are like paintbrushes that let us create beautiful pictures in people's minds. Stories can take us to faraway kingdoms, poems can make our hearts sing, and learning new words gives us the power to express our most amazing ideas! In our ${skillArea} journey today, we'll read exciting stories, discover fascinating new words, and learn how to express ourselves like true word wizards!`
    },
    science: {
      magic: `Science is the most amazing detective game ever, ${userName}! 🔬🌟 Everything around us has incredible secrets waiting to be discovered - from why flowers grow toward the sun, to how butterflies know where to fly, to what makes rainbows appear after storms! Today in ${skillArea}, we're going to be real scientists and make exciting discoveries together!`
    },
    music: {
      magic: `Music is the language that speaks directly to our hearts, ${userName}! 🎵💫 It can make us dance, help us feel brave, or wrap us up in comfort like a warm hug. Every sound around us - from birds singing to rain pattering - is part of the beautiful symphony of life! In our ${skillArea} adventure today, we'll explore rhythm, melody, and harmony!`
    },
    "computer-science": {
      magic: `Computer science is like being a wizard in the digital world, ${userName}! 💻✨ When we code, we're giving magical instructions to computers, creating games, apps, and websites that can help people and bring joy to the world. In our ${skillArea} journey, we'll think like programmers and solve problems step by step!`
    },
    "creative-arts": {
      magic: `Art is your imagination coming to life, ${userName}! 🎨🌈 Every color, shape, and line you create is uniquely yours. Art lets us express feelings that are too big for words, create beauty that makes people smile, and share our special way of seeing the world! Today in ${skillArea}, we'll explore colors, shapes, and creative techniques!`
    }
  };

  const content = subjectContent[subject.toLowerCase() as keyof typeof subjectContent] || subjectContent.mathematics;
  
  return {
    title: "The Magic We'll Discover",
    text: content.magic.replace(/\$\{userName\}/g, userName).replace(/\$\{skillArea\}/g, skillArea),
    duration: 15
  };
};

const createTodaysAdventure = (subject: string, skillArea: string, userName: string): IntroductionSection => {
  const adventureContent = {
    mathematics: `Today, ${userName}, we're going on an incredible math adventure! 🚀 We'll solve exciting puzzles, play number games, and discover cool patterns. I'll be right here to help you every step of the way, celebrating every success and helping you through any challenges. By the end of our time together, you'll feel like a confident math explorer ready for any mathematical adventure!`,
    english: `Get ready for an amazing word adventure, ${userName}! 📖 We'll dive into the world of language through stories, games, and creative activities. We'll build your vocabulary like collecting treasure, practice reading like brave explorers, and maybe even create our own stories! Every great writer started with curiosity just like yours, and today you'll discover the magic of words!`,
    science: `Today's science adventure is going to blow your mind, ${userName}! 🧪 We'll investigate mysteries, make predictions like real scientists, and discover answers to questions you might have wondered about. Science is all around us, and today you'll see the world through a scientist's curious eyes and maybe even make your own amazing discoveries!`,
    music: `Our musical journey starts now, ${userName}! 🎼 We'll explore sounds, rhythms, and melodies that will make your heart happy. Whether you're hearing these concepts for the first time or building on what you know, we'll create beautiful musical moments together and discover the joy that music brings to our lives!`,
    "computer-science": `Welcome to the amazing world of coding, ${userName}! 💾 In our adventure today, we'll learn to think like programmers, solve digital puzzles, and understand how the technology around us works. Every line of code we explore brings us closer to creating something incredible, and you'll discover that coding is both logical and creative!`,
    "creative-arts": `Your artistic journey begins right now, ${userName}! 🖌️ We'll explore different techniques, experiment with colors and shapes, and create something uniquely beautiful. Remember, there's no wrong way to be creative - your artistic voice is perfect just as it is, and today we'll help it shine even brighter!`
  };

  const defaultContent = `Today's adventure is going to be amazing, ${userName}! We'll learn, play, and discover together, building your confidence and skills step by step. I'm here to make sure you feel supported and excited about everything we explore!`;

  return {
    title: "Today's Amazing Adventure",
    text: adventureContent[subject.toLowerCase() as keyof typeof adventureContent] || defaultContent,
    duration: 12
  };
};

const subjectIntroductions: Record<string, (skillArea?: string, level?: string, userName?: string) => SubjectIntroduction> = {
  mathematics: (skillArea = "general math", level = "beginner", userName = "Student") => ({
    title: `🔢 Mathematics Magic with Nelie - Welcome ${userName}! ✨`,
    sections: [
      createPersonalizedWelcome("Mathematics", userName),
      createSubjectMagic("mathematics", skillArea, userName),
      createTodaysAdventure("mathematics", skillArea, userName)
    ]
  }),

  english: (skillArea = "language arts", level = "beginner", userName = "Student") => ({
    title: `📚 English Adventures with Nelie - Welcome ${userName}! 🌟`,
    sections: [
      createPersonalizedWelcome("English", userName),
      createSubjectMagic("english", skillArea, userName),
      createTodaysAdventure("english", skillArea, userName)
    ]
  }),

  science: (skillArea = "general science", level = "beginner", userName = "Student") => ({
    title: `🔬 Science Discoveries with Nelie - Welcome ${userName}! 🌟`,
    sections: [
      createPersonalizedWelcome("Science", userName),
      createSubjectMagic("science", skillArea, userName),
      createTodaysAdventure("science", skillArea, userName)
    ]
  }),

  music: (skillArea = "music basics", level = "beginner", userName = "Student") => ({
    title: `🎵 Musical Magic with Nelie - Welcome ${userName}! ✨`,
    sections: [
      createPersonalizedWelcome("Music", userName),
      createSubjectMagic("music", skillArea, userName),
      createTodaysAdventure("music", skillArea, userName)
    ]
  }),

  "computer-science": (skillArea = "coding basics", level = "beginner", userName = "Student") => ({
    title: `💻 Coding Adventures with Nelie - Welcome ${userName}! 🚀`,
    sections: [
      createPersonalizedWelcome("Computer Science", userName),
      createSubjectMagic("computer-science", skillArea, userName),
      createTodaysAdventure("computer-science", skillArea, userName)
    ]
  }),

  "creative-arts": (skillArea = "artistic expression", level = "beginner", userName = "Student") => ({
    title: `🎨 Creative Magic with Nelie - Welcome ${userName}! 🌈`,
    sections: [
      createPersonalizedWelcome("Creative Arts", userName),
      createSubjectMagic("creative-arts", skillArea, userName),
      createTodaysAdventure("creative-arts", skillArea, userName)
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
