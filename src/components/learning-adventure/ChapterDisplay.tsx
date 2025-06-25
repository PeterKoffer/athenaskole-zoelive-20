import React, { useState } from 'react';
import type { Chapter, EmbeddedActivityRequest } from '@/types/learningAdventureTypes';
import type { LessonActivity, ActivityType } from '@/components/education/components/types/LessonTypes';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AdventureImageDisplay from './AdventureImageDisplay';
import UniversalLearningContent from '@/components/education/components/universal/UniversalLearningContent';
import { ActivityContentGenerator } from '@/services/dailyLessonGenerator/activityContentGenerator'; // Added
import type { StudentProgressData } from '@/services/dailyLessonGenerator/types'; // Added
import { Loader2 } from 'lucide-react'; // For spinner icon

interface ChapterDisplayProps {
  chapter: Chapter;
  adventureId: string;
  mockStudentName?: string;
  mockSkillArea?: string;
  mockGradeLevel?: number;
}

const ChapterDisplay: React.FC<ChapterDisplayProps> = ({
  chapter,
  adventureId,
  mockStudentName = "Explorer", // Will be used by UniversalLearningContent via mock activity.subject/skillArea if needed
  mockSkillArea = "Adventure Skills", // Used as fallback for activity.skillArea
  mockGradeLevel = 3, // Used for generating activity
}) => {
  const [activeEmbeddedActivityIndex, setActiveEmbeddedActivityIndex] = useState<number | null>(null);
  const [currentLessonActivities, setCurrentLessonActivities] = useState<LessonActivity[] | null>(null);
  const [showLessonActivityView, setShowLessonActivityView] = useState<boolean>(false);
  const [activityCompletionMessage, setActivityCompletionMessage] = useState<string | null>(null);
  const [isLoadingActivity, setIsLoadingActivity] = useState<boolean>(false); // Added state

  const isActivityRequest = (activity: LessonActivity | EmbeddedActivityRequest): activity is EmbeddedActivityRequest => {
    return (activity as EmbeddedActivityRequest).activityType !== undefined && (activity as EmbeddedActivityRequest).subject !== undefined;
  };

  const handleStartActivity = async (activity: LessonActivity | EmbeddedActivityRequest, index: number) => {
    setActivityCompletionMessage(null);
    setActiveEmbeddedActivityIndex(index);

    if (isActivityRequest(activity)) {
      setIsLoadingActivity(true);
      console.log(`ChapterDisplay: Generating activity for request:`, activity);

      const mockStudentProgress: StudentProgressData = {
        userId: 'mockAdventureUserId', // Using a distinct mock user ID for adventure context
        subject: activity.subject,
        overallAccuracy: 75,
        lessonsCompleted: 5,
        focusAreaPerformance: {},
        lastAccessed: new Date().toISOString(),
      };

      try {
        const generatedActivity = await ActivityContentGenerator.createCurriculumActivity(
          `${adventureId}_${chapter.chapterId}`, // lessonId (unique for this chapter context)
          index,                               // activity index within the chapter
          activity.subject,
          activity.skillArea,
          activity.focusArea || activity.skillArea, // focusArea (fallback to skillArea)
          mockGradeLevel, // gradeLevel
          mockStudentProgress,
          activity.activityType
          // `activity.difficulty` from EmbeddedActivityRequest is not directly passed;
          // createCurriculumActivity calculates difficulty based on studentProgress and gradeLevel.
          // If direct difficulty override is needed, createCurriculumActivity signature would need adjustment.
          // For now, we can assume the generator's calculation is sufficient or difficulty from request is used internally if passed.
        );
        setCurrentLessonActivities([generatedActivity]);
        setShowLessonActivityView(true);
      } catch (err) {
        console.error("Error generating curriculum activity:", err);
        setActivityCompletionMessage(`Error preparing activity: \${(err as Error).message}`);
      } finally {
        setIsLoadingActivity(false);
      }
    } else {
      // It's already a full LessonActivity object
      setCurrentLessonActivities([activity]);
      setShowLessonActivityView(true);
    }
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
