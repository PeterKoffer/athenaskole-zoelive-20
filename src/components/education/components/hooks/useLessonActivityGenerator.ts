
import { LessonActivity } from '../types/LessonTypes';
import { useSubjectQuestionGenerator } from './useSubjectQuestionGenerator';

interface UseLessonActivityGeneratorProps {
  subject: string;
  skillArea: string;
}

export const useLessonActivityGenerator = ({ subject, skillArea }: UseLessonActivityGeneratorProps) => {
  const { getSubjectQuestions, getSubjectScenario, getSubjectApplicationScenario } = useSubjectQuestionGenerator();

  const generateUnifiedLessonActivities = (): LessonActivity[] => {
    const activities: LessonActivity[] = [];
    const lessonId = `unified-${subject}-${Date.now()}`;
    const subjectTitle = subject.charAt(0).toUpperCase() + subject.slice(1);

    console.log(`🎯 Generating activities for ${subject} with skill area: ${skillArea}`);

    // 1. Welcome Introduction
    activities.push({
      id: `${lessonId}_welcome`,
      title: `Welcome to ${subjectTitle} with Nelie!`,
      type: 'introduction',
      phase: 'introduction', 
      duration: 180,
      phaseDescription: `Welcome to your ${subjectTitle} learning adventure`,
      metadata: { subject, skillArea: 'welcome' },
      content: {
        text: `Hello! I'm Nelie, and I'm so excited to learn ${subjectTitle} with you today! We'll explore amazing concepts, solve fun problems, play educational games, and discover how ${subjectTitle} connects to the real world. Are you ready for this adventure?`
      }
    });

    // 2-4. Interactive Questions (subject-specific)
    const questionTopics = getSubjectQuestions(subject);
    questionTopics.forEach((topic, index) => {
      activities.push({
        id: `${lessonId}_question_${index + 1}`,
        title: topic.title,
        type: 'interactive-game',
        phase: 'interactive-game',
        duration: 240,
        phaseDescription: topic.description,
        metadata: { subject, skillArea: topic.skillArea },
        content: {
          question: topic.question,
          options: topic.options,
          correctAnswer: topic.correctAnswer,
          explanation: topic.explanation,
          text: topic.question,
          choices: topic.options
        }
      });
    });

    // 5. Educational Game/Assignment
    activities.push({
      id: `${lessonId}_game`,
      title: `${subjectTitle} Challenge Game`,
      type: 'creative-exploration',
      phase: 'creative-exploration',
      duration: 300,
      phaseDescription: `Interactive ${subjectTitle} challenge`,
      metadata: { subject, skillArea: 'game' },
      content: {
        creativePrompt: `Let's play a fun ${subjectTitle} game! I'll give you different scenarios where you can use your ${subjectTitle} skills creatively.`,
        whatIfScenario: getSubjectScenario(subject),
        explorationTask: `Think about how ${subjectTitle} helps us solve real-world problems!`
      }
    });

    // 6. Application Assignment
    activities.push({
      id: `${lessonId}_assignment`,
      title: `Real-World ${subjectTitle}`,
      type: 'application',
      phase: 'application',
      duration: 240,
      phaseDescription: `Apply ${subjectTitle} to real situations`,
      metadata: { subject, skillArea: 'application' },
      content: {
        scenario: getSubjectApplicationScenario(subject),
        task: `Use your ${subjectTitle} knowledge to solve this real-world challenge!`,
        guidance: `Take your time and think through each step. Remember what we've learned today!`
      }
    });

    // 7. Celebration Summary
    activities.push({
      id: `${lessonId}_celebration`,
      title: `Amazing Work in ${subjectTitle}!`,
      type: 'summary',
      phase: 'summary',
      duration: 180,
      phaseDescription: 'Celebrate your learning achievements',
      metadata: { subject, skillArea: 'celebration' },
      content: {
        keyTakeaways: [
          `You explored fascinating ${subjectTitle} concepts today!`,
          `You solved challenging problems with confidence!`,
          `You discovered how ${subjectTitle} connects to everyday life!`,
          `You're becoming an amazing ${subjectTitle} learner!`
        ],
        nextTopicSuggestion: `Next time, we'll dive even deeper into ${subjectTitle} and discover more exciting concepts!`
      }
    });

    console.log(`✅ Generated ${activities.length} activities for ${subject}:`, activities.map(a => a.title));
    return activities;
  };

  return {
    generateUnifiedLessonActivities
  };
};
