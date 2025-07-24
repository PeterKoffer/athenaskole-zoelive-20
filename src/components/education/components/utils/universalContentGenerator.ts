
// @ts-nocheck
import { LessonActivity } from '../types/LessonTypes';

export class UniversalContentGenerator {
  static generateEngagingLesson(subject: string, skillArea: string, gradeLevel: number = 3): LessonActivity[] {
    const activities: LessonActivity[] = [];
    
    console.log(`🎯 Generating lesson for ${subject} - ${skillArea} (Grade ${gradeLevel})`);

    // Introduction activity
    activities.push({
      id: `${subject}-intro-1`,
      type: 'introduction',
      title: `Welcome to ${this.getSubjectDisplayName(subject)}`,
      duration: 180,
      content: {
        hook: this.generateIntroductionHook(subject, skillArea),
        text: `Today we're diving into the fascinating world of ${skillArea}. Get ready for an interactive learning adventure!`
      },
      difficulty: 'easy',
      subject,
      skillArea
    });

    // Content delivery activity
    activities.push({
      id: `${subject}-content-1`,
      type: 'content-delivery',
      title: `Understanding ${this.getTopicTitle(skillArea)}`,
      duration: 300,
      content: {
        segments: [
          {
            explanation: this.generateContentExplanation(subject, skillArea, gradeLevel)
          }
        ]
      },
      difficulty: 'easy',
      subject,
      skillArea
    });

    // Interactive quiz
    activities.push({
      id: `${subject}-quiz-1`,
      type: 'quiz',
      title: `Quick Check: ${this.getTopicTitle(skillArea)}`,
      duration: 240,
      content: {
        question: this.generateQuizQuestion(subject, skillArea, gradeLevel),
        options: this.generateQuizOptions(subject, skillArea, gradeLevel),
        correctAnswer: 0,
        explanation: this.generateQuizExplanation(subject, skillArea)
      },
      difficulty: 'medium',
      subject,
      skillArea
    });

    // Creative exploration
    activities.push({
      id: `${subject}-creative-1`,
      type: 'creative-exploration',
      title: `Explore and Create`,
      duration: 360,
      content: {
        creativePrompt: this.generateCreativePrompt(subject, skillArea),
        text: "Time to get creative! Think about how this concept applies to your daily life."
      },
      difficulty: 'medium',
      subject,
      skillArea
    });

    // Summary activity
    activities.push({
      id: `${subject}-summary-1`,
      type: 'summary',
      title: `Key Takeaways`,
      duration: 180,
      content: {
        keyTakeaways: this.generateKeyTakeaways(subject, skillArea)
      },
      difficulty: 'easy',
      subject,
      skillArea
    });

    console.log(`✅ Generated ${activities.length} activities for ${subject}`);
    return activities;
  }

  private static getSubjectDisplayName(subject: string): string {
    const displayNames: Record<string, string> = {
      'mathematics': 'Mathematics',
      'science': 'Science',
      'english': 'English Language Arts',
      'computer-science': 'Computer Science',
      'history-religion': 'History & Religion',
      'world-history-religions': 'World History & Religions',
      'geography': 'Geography',
      'global-geography': 'Global Geography',
      'creative-arts': 'Creative Arts',
      'music': 'Music',
      'body-lab': 'Body Lab',
      'mental-wellness': 'Mental Wellness',
      'life-essentials': 'Life Essentials',
      'language-lab': 'Language Lab'
    };
    return displayNames[subject] || subject;
  }

  private static getTopicTitle(skillArea: string): string {
    return skillArea.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  private static generateIntroductionHook(subject: string, skillArea: string): string {
    const hooks: Record<string, string> = {
      'mathematics': 'Numbers are everywhere around us! Today we\'ll discover the magic of mathematics.',
      'science': 'Science helps us understand how our amazing world works!',
      'english': 'Words have power! Let\'s explore the beauty of language together.',
      'computer-science': 'Welcome to the digital world where we can create amazing things with code!',
      'history-religion': 'Every place has stories to tell. Let\'s journey through time and traditions!',
      'geography': 'Our planet Earth is full of incredible places and phenomena!',
      'creative-arts': 'Art is a window to creativity and self-expression!',
      'music': 'Music is the universal language that speaks to our hearts!'
    };
    return hooks[subject] || `Welcome to the exciting world of ${this.getSubjectDisplayName(subject)}!`;
  }

  private static generateContentExplanation(subject: string, skillArea: string, gradeLevel: number): string {
    return `In ${this.getSubjectDisplayName(subject)}, we explore ${this.getTopicTitle(skillArea)} through hands-on activities and real-world examples. This helps us understand concepts better and see how they connect to our daily lives.`;
  }

  private static generateQuizQuestion(subject: string, skillArea: string, gradeLevel: number): string {
    const questions: Record<string, string> = {
      'mathematics': 'What makes mathematics important in our daily lives?',
      'science': 'How does science help us understand the world around us?',
      'english': 'Why is effective communication important?',
      'computer-science': 'What can we create with computer programming?',
      'geography': 'How do maps help us navigate the world?'
    };
    return questions[subject] || `What did you learn about ${this.getTopicTitle(skillArea)}?`;
  }

  private static generateQuizOptions(subject: string, skillArea: string, gradeLevel: number): string[] {
    const options: Record<string, string[]> = {
      'mathematics': [
        'It helps us solve problems and understand patterns',
        'It\'s only useful for homework',
        'It\'s just about memorizing numbers',
        'It has no real-world applications'
      ],
      'science': [
        'It explains natural phenomena and helps us make discoveries',
        'It\'s only for scientists',
        'It\'s too complicated for everyday use',
        'It doesn\'t affect our daily lives'
      ]
    };
    return options[subject] || [
      'It helps us learn and grow',
      'It\'s not very important',
      'It\'s too difficult',
      'It\'s boring'
    ];
  }

  private static generateQuizExplanation(subject: string, skillArea: string): string {
    return `Great job! ${this.getSubjectDisplayName(subject)} plays a vital role in helping us understand and interact with the world around us.`;
  }

  private static generateCreativePrompt(subject: string, skillArea: string): string {
    const prompts: Record<string, string> = {
      'mathematics': 'Think of three ways you use math in your daily life. How would your day be different without numbers?',
      'science': 'Imagine you\'re a scientist for a day. What would you want to discover or experiment with?',
      'english': 'Write a short story or poem about your favorite place using descriptive words.',
      'geography': 'If you could visit any place in the world, where would you go and why?'
    };
    return prompts[subject] || `How can you apply what you learned about ${this.getTopicTitle(skillArea)} in your own life?`;
  }

  private static generateKeyTakeaways(subject: string, skillArea: string): string[] {
    const takeaways: Record<string, string[]> = {
      'mathematics': [
        'Math helps us solve everyday problems',
        'Patterns and relationships are everywhere',
        'Mathematical thinking develops logical reasoning'
      ],
      'science': [
        'Science explains how the world works',
        'Observation and experimentation lead to discoveries',
        'Scientific knowledge helps us make informed decisions'
      ]
    };
    return takeaways[subject] || [
      `${this.getSubjectDisplayName(subject)} is relevant to our daily lives`,
      'Learning helps us understand the world better',
      'Knowledge empowers us to make good choices'
    ];
  }
}
