import React, { useState } from 'react';
import type { Chapter, EmbeddedActivityRequest } from '@/types/learningAdventureTypes';
import type { LessonActivity, ActivityType } from '@/components/education/components/types/LessonTypes';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button'; // Added
import AdventureImageDisplay from './AdventureImageDisplay';
import UniversalLearningContent from '@/components/education/components/universal/UniversalLearningContent'; // Added

interface ChapterDisplayProps {
  chapter: Chapter;
  adventureId: string; // To form unique IDs for generated activities
  // For mock LessonActivity generation & passing to UniversalLearningContent
  // In a real app, studentProgress might come from context or props
  mockStudentName?: string;
  mockSkillArea?: string; // If not directly in EmbeddedActivityRequest, use chapter's theme
  mockGradeLevel?: number;
}

const ChapterDisplay: React.FC<ChapterDisplayProps> = ({
  chapter,
  adventureId,
  mockStudentName = "Explorer",
  mockSkillArea = "Adventure Skills",
  mockGradeLevel = 3,
}) => {
  const [activeEmbeddedActivityIndex, setActiveEmbeddedActivityIndex] = useState<number | null>(null);
  const [currentLessonActivities, setCurrentLessonActivities] = useState<LessonActivity[] | null>(null);
  const [showLessonActivityView, setShowLessonActivityView] = useState<boolean>(false);
  const [activityCompletionMessage, setActivityCompletionMessage] = useState<string | null>(null);

  const isActivityRequest = (activity: LessonActivity | EmbeddedActivityRequest): activity is EmbeddedActivityRequest => {
    return (activity as EmbeddedActivityRequest).activityType !== undefined && (activity as EmbeddedActivityRequest).subject !== undefined;
  };

  const handleStartActivity = (activity: LessonActivity | EmbeddedActivityRequest, index: number) => {
    setActivityCompletionMessage(null); // Clear previous completion message
    setActiveEmbeddedActivityIndex(index);
    let activityToRun: LessonActivity;

    if (isActivityRequest(activity)) {
      console.log(`ChapterDisplay: Would generate activity for request:`, activity);
      // Create a mock LessonActivity based on the EmbeddedActivityRequest
      // This is a simplified mock. A real implementation would call ActivityContentGenerator.
      activityToRun = {
        id: `${adventureId}-${chapter.chapterId}-activity-${index}`,
        type: activity.activityType,
        title: `${activity.skillArea}: ${activity.focusArea || 'Challenge'}`,
        phase: activity.activityType, // Assuming phase matches type for this context
        duration: 180, // Default duration
        phaseDescription: `Complete this activity about ${activity.focusArea || activity.skillArea}.`,
        content: {
          // Mock content based on type - this should be more robust or come from a generator
          // For now, a generic placeholder that UniversalLearningMainContent might try to render
          text: `This is a ${activity.activityType} activity for ${activity.subject} on ${activity.skillArea}. Focus: ${activity.focusArea || 'general'}. Difficulty: ${activity.difficulty || 'default'}.`,
          // Add minimal fields expected by UniversalLearningMainContent for this type if known
          ...(activity.activityType === 'interactive-game' && { question: `Mock question for ${activity.focusArea}?`, options: ["A", "B", "C"], correctAnswerIndex: 0, gameType: "multiple-choice-quiz" }),
          ...(activity.activityType === 'content-delivery' && { mainExplanation: `Mock explanation for ${activity.focusArea}.` }),
          ...(activity.activityType === 'application' && { scenario: `Mock scenario for ${activity.focusArea}.`, task: "Solve the mock task." }),
        },
        subject: activity.subject, // Pass subject and skillArea for UniversalLearningContent
        skillArea: activity.skillArea,
      };
    } else {
      // It's already a full LessonActivity object
      activityToRun = activity;
    }
    setCurrentLessonActivities([activityToRun]);
    setShowLessonActivityView(true);
  };

  const handleEmbeddedLessonComplete = () => {
    setActivityCompletionMessage(`Great job on completing the "${currentLessonActivities?.[0]?.title || 'activity'}"!`);
    setShowLessonActivityView(false);
    setCurrentLessonActivities(null);
    setActiveEmbeddedActivityIndex(null);
    // Auto-hide completion message after a few seconds
    setTimeout(() => setActivityCompletionMessage(null), 4000);
  };

  if (showLessonActivityView && currentLessonActivities) {
    const currentActivityDetails = currentLessonActivities[0]; // We run one activity at a time from chapter
    return (
      <UniversalLearningContent
        subject={currentActivityDetails.subject || chapter.chapterTitle} // Fallback to chapter title if subject not in activity
        skillArea={currentActivityDetails.skillArea || mockSkillArea} // Fallback
        predefinedActivities={currentLessonActivities}
        onLessonCompleteOverride={handleEmbeddedLessonComplete}
        // onBackToProgram is not strictly needed here if onLessonCompleteOverride handles exit
        // But if UniversalLearningContent requires it, we can pass a no-op or similar
        onBackToProgram={() => {
            console.log("Embedded lesson back to program called - likely via override.");
            handleEmbeddedLessonComplete();
        }}
      />
    );
  }

  return (
    <Card className="bg-slate-700/80 border-purple-400/60 p-6 animate-fadeIn">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-purple-300 mb-2">{chapter.chapterTitle}</CardTitle>
        {activityCompletionMessage && (
          <div className="my-3 p-3 bg-green-600/30 border border-green-500 text-green-200 rounded-md text-center animate-pulse">
            {activityCompletionMessage}
          </div>
        )}
        {chapter.chapterImagePrompt && (
          <div className="my-4 rounded-lg overflow-hidden border border-purple-400/30">
            <AdventureImageDisplay
              imagePrompt={chapter.chapterImagePrompt}
              altText={`Scene for ${chapter.chapterTitle}`}
              className="w-full h-56 md:h-72" // Adjusted height
              aspectRatio="aspect-video"
            />
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        <div
          className="prose prose-invert prose-lg max-w-none text-slate-200 leading-relaxed"
          // Potentially use a markdown renderer here if narrativeText can contain markdown
        >
          {/* Split narrative by newlines to render as paragraphs */}
          {chapter.narrativeText.split('\n').map((paragraph, index) => (
            <p key={index} className="mb-3">{paragraph}</p>
          ))}
        </div>

        {chapter.embeddedActivities && chapter.embeddedActivities.length > 0 && (
          <div className="mt-6 space-y-4">
            <h4 className="text-xl font-semibold text-sky-300 border-b border-sky-400/50 pb-2">
              Challenges & Activities:
            </h4>
            {chapter.embeddedActivities.map((activity, index) => (
              <Card key={index} className="p-4 bg-slate-600/70 border-slate-500/60 shadow-md">
                <CardContent className="p-0 flex flex-col md:flex-row justify-between items-start md:items-center">
                  <div className="flex-grow mb-3 md:mb-0 md:mr-4">
                    {isActivityRequest(activity) ? (
                      <>
                        <p className="font-semibold text-blue-300">
                          Challenge: A <span className="font-bold text-blue-200">{activity.activityType}</span> activity on <span className="font-bold text-blue-200">{activity.subject}</span>.
                        </p>
                        <p className="text-sm text-slate-300">
                          Focus: <span className="italic">{activity.skillArea}{activity.focusArea ? ` - ${activity.focusArea}` : ''}</span>.
                          {activity.difficulty ? ` (Difficulty: ${activity.difficulty}/5)` : ''}
                        </p>
                        {activity.activityImagePrompt && (
                          <div className="mt-2 rounded-md overflow-hidden border border-slate-600 max-w-xs">
                            <AdventureImageDisplay
                              imagePrompt={activity.activityImagePrompt}
                              altText={`Visual for activity on ${activity.skillArea}`}
                              className="w-full h-24"
                              aspectRatio="aspect-video"
                            />
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                         <p className="font-semibold text-green-300">
                          Challenge: <span className="font-bold text-green-200">{activity.title}</span> (<span className="italic">{activity.type}</span>)
                         </p>
                        {(activity.content as any)?.activityImagePrompt && (
                          <div className="mt-2 rounded-md overflow-hidden border border-slate-600 max-w-xs">
                             <AdventureImageDisplay
                              imagePrompt={(activity.content as any).activityImagePrompt}
                              altText={`Visual for predefined activity: ${activity.title}`}
                              className="w-full h-24"
                              aspectRatio="aspect-video"
                            />
                          </div>
                        )}
                      </>
                    )}
                  </div>
                  <Button
                    onClick={() => handleStartActivity(activity, index)}
                    className="bg-green-500 hover:bg-green-600 text-white whitespace-nowrap"
                    size="sm"
                  >
                    Start Challenge
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ChapterDisplay;
