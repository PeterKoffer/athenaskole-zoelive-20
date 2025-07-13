
import { LessonActivity } from '../types/LessonTypes';

export interface NativeLanguageLessonConfig {
  skillArea: string;
  gradeLevel: number;
  sessionId: string;
}

export const generateNativeLanguageLessons = ({ skillArea, gradeLevel, sessionId }: NativeLanguageLessonConfig): LessonActivity[] => {
  const lessonId = `native-language-${sessionId.substring(0, 8)}-${Date.now()}`;
  const isEarlyYears = gradeLevel <= 4; // Years 1-4 / Grades K-3
  const isMiddleGrades = gradeLevel >= 5 && gradeLevel <= 8; // Years 5-8 / Grades 4-7
  const isHighSchool = gradeLevel >= 9; // Years 9-12 / Grades 8/9-12

  console.log(`📚 Generating Native Language lessons for grade ${gradeLevel}, skill: ${skillArea}`);

  // Determine focus areas based on grade level
  const getFocusAreas = () => {
    if (isEarlyYears) {
      if (gradeLevel <= 1) return ['phonics', 'emergent-literacy', 'oral-language'];
      if (gradeLevel <= 2) return ['fluency', 'decoding', 'vocabulary'];
      if (gradeLevel <= 3) return ['comprehension', 'grammar', 'writing-structure'];
      return ['genre-awareness', 'analytical-comprehension', 'writing-variety'];
    }
    
    if (isMiddleGrades) {
      if (gradeLevel <= 5) return ['reading-analysis', 'vocabulary-expansion', 'writing-coherence'];
      if (gradeLevel <= 6) return ['critical-thinking', 'text-variety', 'research-skills'];
      if (gradeLevel <= 7) return ['literary-analysis', 'creative-writing', 'presentation-skills'];
      return ['advanced-reading', 'persuasive-writing', 'oral-argumentation'];
    }
    
    // High School
    if (gradeLevel <= 9) return ['literary-depth', 'argumentation', 'research-writing'];
    if (gradeLevel <= 10) return ['comparative-literature', 'style-analysis', 'formal-presentations'];
    if (gradeLevel <= 11) return ['cultural-literacy', 'media-literacy', 'critical-writing'];
    return ['capstone-project', 'professional-communication', 'literacy-leadership'];
  };

  const focusAreas = getFocusAreas();

  const lessons: LessonActivity[] = [
    // Welcome & Language Learning Introduction
    {
      id: `${lessonId}_welcome`,
      title: `Welcome to Native Language Learning with Nelie!`,
      type: 'introduction',
      phase: 'introduction',
      duration: 180,
      phaseDescription: 'Introduction to native language learning journey',
      metadata: { subject: 'native-language', skillArea: 'welcome' },
      content: {
        text: isEarlyYears
          ? `Hello, wonderful reader! I'm Nelie, and I'm so excited to explore the amazing world of reading, writing, and storytelling with you! We'll discover how letters make words, words make stories, and stories make magic!`
          : isMiddleGrades
          ? `Welcome to our language arts adventure! I'm Nelie, your guide through the rich world of literature, writing, and communication. Together we'll explore ${skillArea} and discover the power of language!`
          : `Greetings, literary scholar! I'm Nelie, and I'm thrilled to embark on this sophisticated journey through advanced language arts with you. We'll analyze, create, and master the art of ${skillArea} in literature and communication!`,
        storyHook: isEarlyYears
          ? `Ready to become a reading superhero?`
          : isMiddleGrades
          ? `Ready to unlock the secrets of great writing and literature?`
          : `Ready to achieve mastery in advanced literary analysis and communication?`
      }
    },

    // Core Language Skills Development
    {
      id: `${lessonId}_core_skills`,
      title: isEarlyYears ? `Learning Our Letters & Words` : isMiddleGrades ? `Mastering ${skillArea}` : `Advanced ${skillArea} Analysis`,
      type: 'interactive-game',
      phase: 'content-delivery',
      duration: 300,
      phaseDescription: `Develop core ${skillArea} skills`,
      metadata: { subject: 'native-language', skillArea },
      content: {
        question: isEarlyYears
          ? gradeLevel <= 1
            ? `What sound does this letter make?`
            : gradeLevel <= 2  
            ? `Can you read this simple sentence?`
            : gradeLevel <= 3
            ? `What is the main idea of this short story?`
            : `What type of writing is this - story, poem, or information?`
          : isMiddleGrades
          ? gradeLevel <= 5
            ? `What is the author's purpose in this passage?`
            : gradeLevel <= 6
            ? `What can you infer from this text?`
            : gradeLevel <= 7
            ? `How does the author develop the main character?`
            : `What persuasive techniques does the author use?`
          : gradeLevel <= 9
            ? `What literary devices does the author employ to convey theme?`
            : gradeLevel <= 10
            ? `How do these two literary works compare in style and message?`
            : gradeLevel <= 11
            ? `What bias might be present in this media text?`
            : `How does this work contribute to cultural or literary discourse?`,
        
        options: isEarlyYears
          ? gradeLevel <= 1
            ? ['Aaa sound', 'Bbb sound', 'Ccc sound', 'Let me try again']
            : gradeLevel <= 2
            ? ['I can read it!', 'I need help', 'Let me sound it out', 'Read it to me']
            : gradeLevel <= 3
            ? ['It\'s about friendship', 'It\'s about animals', 'It\'s about school', 'It\'s about family']
            : ['A story', 'A poem', 'Information', 'Instructions']
          : isMiddleGrades
          ? ['To inform', 'To persuade', 'To entertain', 'All of the above']
          : ['Symbolism', 'Metaphor', 'Characterization', 'All of the above'],
        
        correctAnswer: isEarlyYears ? 0 : 3,
        
        explanation: isEarlyYears
          ? gradeLevel <= 1
            ? `Great job learning letter sounds! Every letter has its own special sound that helps make words.`
            : gradeLevel <= 2
            ? `Wonderful reading! When we put letters together, they make words, and words make sentences!`
            : gradeLevel <= 3
            ? `Excellent comprehension! Finding the main idea helps us understand what stories are really about.`
            : `Perfect! Recognizing different types of writing helps us understand how authors share information and stories.`
          : isMiddleGrades
          ? `Excellent analysis! Authors use many techniques to achieve their purposes in writing.`
          : `Outstanding literary analysis! Great writers use multiple devices to create meaning and impact.`,
        
        segments: [{
          title: `${skillArea} Fundamentals`,
          concept: skillArea,
          explanation: isEarlyYears
            ? `${skillArea} helps us become better readers and writers every day!`
            : isMiddleGrades
            ? `${skillArea} is how we understand and create powerful communication through language.`
            : `${skillArea} represents sophisticated analysis and creation of literary and communicative works.`
        }]
      }
    },

    // Reading & Literature Exploration
    {
      id: `${lessonId}_literature`,
      title: isEarlyYears ? `Story Time & Reading Fun` : isMiddleGrades ? `Literature Exploration` : `Advanced Literary Analysis`,
      type: 'creative-exploration',
      phase: 'interactive-game',
      duration: 360,
      phaseDescription: `Explore literature and reading comprehension`,
      metadata: { subject: 'native-language', skillArea: 'literature' },
      content: {
        creativePrompt: isEarlyYears
          ? `Let's explore wonderful stories together! We'll read about adventures, make-believe worlds, and interesting characters!`
          : isMiddleGrades
          ? `Discover the rich world of literature! We'll analyze characters, explore themes, and understand how great writers craft their stories.`
          : `Engage with sophisticated literary works! Analyze complex themes, cultural contexts, and the artistic techniques of master writers.`,
        
        explorationTask: isEarlyYears
          ? gradeLevel <= 1
            ? `Look at the pictures and tell me what's happening in this story!`
            : gradeLevel <= 2
            ? `Read this simple story and tell me about your favorite character!`
            : gradeLevel <= 3
            ? `After reading, draw a picture showing the beginning, middle, and end of the story!`
            : `Compare two different stories - how are they the same and different?`
          : isMiddleGrades
          ? gradeLevel <= 5
            ? `Read this passage and identify the author's main message and supporting details.`
            : gradeLevel <= 6
            ? `Compare characters from different stories and analyze their motivations.`
            : gradeLevel <= 7
            ? `Analyze how the setting influences the story's mood and character development.`
            : `Examine the author's use of persuasive language and evaluate the effectiveness of their argument.`
          : gradeLevel <= 9
            ? `Analyze the use of symbolism and metaphor in this literary work and explain their contribution to the overall theme.`
            : gradeLevel <= 10
            ? `Compare the treatment of similar themes across different literary periods and cultural contexts.`
            : gradeLevel <= 11
            ? `Critically evaluate multiple media sources on the same topic, identifying bias and perspective.`
            : `Conduct original literary research and present findings on a significant cultural or literary question.`,
        
        whatIfScenario: isEarlyYears
          ? `What if you could visit the world in your favorite story?`
          : isMiddleGrades
          ? `What if you could interview the author about their writing choices?`
          : `What if you could debate the themes of this work with other literary scholars?`
      }
    },

    // Writing & Communication Skills
    {
      id: `${lessonId}_writing`,
      title: isEarlyYears ? `My Writing Adventures` : isMiddleGrades ? `Crafting Great Writing` : `Advanced Composition & Style`,
      type: 'application',
      phase: 'creative-exploration',
      duration: 300,
      phaseDescription: `Develop writing and communication skills`,
      metadata: { subject: 'native-language', skillArea: 'writing' },
      content: {
        scenario: isEarlyYears
          ? gradeLevel <= 1
            ? `You're going to write your name and draw a picture about yourself!`
            : gradeLevel <= 2
            ? `Write a few sentences about your favorite animal or toy!`
            : gradeLevel <= 3
            ? `Write a short story with a beginning, middle, and end!`
            : `Write a letter to a friend telling them about something exciting!`
          : isMiddleGrades
          ? gradeLevel <= 5
            ? `Write a paragraph explaining why your favorite book is so good, with supporting details.`
            : gradeLevel <= 6
            ? `Create a short research report on a topic that interests you, using multiple sources.`
            : gradeLevel <= 7
            ? `Write a creative story and then write an analysis explaining your writing choices.`
            : `Write a persuasive essay on an issue you care about, using evidence and logical reasoning.`
          : gradeLevel <= 9
            ? `Write a literary analysis essay examining the use of a specific literary device in a chosen work.`
            : gradeLevel <= 10
            ? `Compose a comparative analysis of two works from different time periods or cultures.`
            : gradeLevel <= 11
            ? `Write a critical media analysis examining bias and perspective in contemporary sources.`
            : `Complete a capstone writing project: original research, creative work, or cultural commentary.`,
        
        task: isEarlyYears
          ? `Use your best handwriting and remember to put spaces between your words!`
          : isMiddleGrades
          ? `Organize your thoughts with an introduction, body paragraphs, and a strong conclusion.`
          : `Demonstrate sophisticated analysis, original thinking, and masterful communication skills.`,
        
        guidance: isEarlyYears
          ? `Remember, every great writer started with their first words! You're doing amazing!`
          : isMiddleGrades
          ? `Think about your audience and purpose. What do you want your readers to understand or feel?`
          : `Consider the complexity of your argument, the elegance of your style, and the depth of your insights.`
      }
    },

    // Speaking & Presentation Skills
    {
      id: `${lessonId}_speaking`,
      title: isEarlyYears ? `Sharing Our Stories` : isMiddleGrades ? `Presentation Skills` : `Advanced Oral Communication`,
      type: 'interactive-game',
      phase: 'application',
      duration: 240,
      phaseDescription: `Develop speaking and presentation abilities`,
      metadata: { subject: 'native-language', skillArea: 'oral-communication' },
      content: {
        question: isEarlyYears
          ? `What's your favorite part of the story we just read?`
          : isMiddleGrades
          ? `How would you present your ideas to convince others?`
          : `How can you use rhetorical techniques to enhance your presentation?`,
        
        options: isEarlyYears
          ? ['The beginning', 'The middle', 'The ending', 'The whole story!']
          : isMiddleGrades
          ? ['Use clear examples', 'Speak with confidence', 'Connect with audience', 'All of these help']
          : ['Logical structure', 'Emotional appeal', 'Credible evidence', 'All are essential'],
        
        correctAnswer: isEarlyYears ? 3 : 3,
        
        explanation: isEarlyYears
          ? `Wonderful! Every part of a story is important, and it's okay to love the whole thing!`
          : isMiddleGrades
          ? `Excellent! Great presentations combine clear thinking, confident delivery, and audience connection.`
          : `Outstanding! Masterful communication integrates logical, emotional, and ethical appeals.`,
        
        scenario: isEarlyYears
          ? `It's time to share! Tell us about your favorite character or your own story!`
          : isMiddleGrades
          ? `Present your research or creative work to the class, explaining your process and findings.`
          : `Deliver a formal presentation demonstrating your analytical insights and communication mastery.`
      }
    },

    // Language Arts Celebration & Reflection
    {
      id: `${lessonId}_celebration`,
      title: `Celebrating Our Language Learning!`,
      type: 'summary',
      phase: 'summary',
      duration: 180,
      phaseDescription: 'Celebrate language arts achievements',
      metadata: { subject: 'native-language', skillArea: 'celebration' },
      content: {
        keyTakeaways: isEarlyYears
          ? [
              `You learned about ${skillArea} and how it helps us communicate!`,
              `You practiced reading and discovered the joy of stories!`,
              `You wrote your own ideas and shared them with others!`,
              `You're becoming a confident reader and writer!`
            ]
          : isMiddleGrades
          ? [
              `You mastered important ${skillArea} skills for effective communication!`,
              `You analyzed literature and understood deeper meanings in texts!`,
              `You created original writing with clear organization and style!`,
              `You developed confidence in speaking and presenting ideas!`
            ]
          : [
              `You achieved sophisticated mastery of ${skillArea} concepts and applications!`,
              `You demonstrated advanced analytical thinking about complex literary works!`,
              `You produced original writing showing mature style and critical insight!`,
              `You developed leadership skills in literary and cultural discourse!`
            ],
        
        celebration: isEarlyYears
          ? `📚 You're becoming an amazing reader and writer! Every day you get better at sharing your wonderful ideas! 📚`
          : isMiddleGrades
          ? `✍️ Your language skills are growing stronger every day! You can read, write, and communicate with confidence and creativity! ✍️`
          : `🎓 You've achieved advanced literacy and communication mastery! You're ready to be a leader in literary and cultural conversations! 🎓`,
        
        nextTopicSuggestion: isEarlyYears
          ? `Next time, we'll explore more exciting stories and practice writing even more amazing sentences!`
          : isMiddleGrades
          ? `In our next language arts journey, we'll dive deeper into advanced writing techniques and literary analysis!`
          : `Our next exploration will examine contemporary literary movements and advanced rhetorical strategies!`,
        
        achievementsList: focusAreas.map(area => `✓ Mastered ${area.replace('-', ' ')} skills`)
      }
    }
  ];

  console.log(`✅ Generated ${lessons.length} Native Language lessons for grade ${gradeLevel}`);
  return lessons;
};
