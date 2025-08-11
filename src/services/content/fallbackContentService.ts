export const fallbackContentService = {
  createFallbackContent(subject: string, skillArea: string, difficultyLevel: number) {
    const question = `Practice ${subject}: ${skillArea.replace(/_/g, ' ')} (Level ${difficultyLevel})`;
    return {
      subject,
      skill_area: skillArea,
      difficulty_level: difficultyLevel,
      title: question,
      content: {
        question: `Which option best matches the topic: ${skillArea.replace(/_/g, ' ')}?`,
        options: ['Example A', 'Example B', 'Example C', 'Example D'],
        correct: 0,
        explanation: 'This is fallback practice content to keep the lesson going.'
      },
      learning_objectives: [`Build fluency in ${skillArea.replace(/_/g, ' ')}`],
      estimated_time: 5,
      content_type: 'question'
    };
  }
};
