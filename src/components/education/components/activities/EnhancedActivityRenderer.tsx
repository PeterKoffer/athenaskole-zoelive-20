
import { LessonActivity } from '../types/LessonTypes';
import StableActivityInteractiveQuiz from './StableActivityInteractiveQuiz';
import ActivityContentDelivery from './ActivityContentDelivery';
import EducationalGameActivity from './EducationalGameActivity';
import CreativeExplorationActivity from './CreativeExplorationActivity';
import InteractiveSimulationActivity from './InteractiveSimulationActivity';

interface EnhancedActivityRendererProps {
  activity: LessonActivity;
  onActivityComplete: (wasCorrect?: boolean) => void;
  isNelieReady?: boolean;
}

const EnhancedActivityRenderer = ({
  activity,
  onActivityComplete,
  isNelieReady = true
}: EnhancedActivityRendererProps) => {
  if (!activity || !activity.content) {
    console.error("Error: Activity or activity content is null in EnhancedActivityRenderer:", activity);
    return <div className="text-red-500 p-4">Error: Unable to render activity due to missing data.</div>;
  }

  console.log('🎯 EnhancedActivityRenderer rendering:', {
    activityId: activity.id,
    activityType: activity.type,
    activityPhase: activity.phase,
    isNelieReady,
    hasQuestion: !!activity.content?.question,
    hasGameType: !!activity.content?.gameType
  });

  // Handle educational games
  if (activity.type === 'educational-game' || activity.content?.gameType) {
    console.log('🎮 Rendering educational game activity');
    return (
      <EducationalGameActivity
        activity={activity}
        onActivityComplete={onActivityComplete}
      />
    );
  }

  // Handle interactive simulations
  if (activity.type === 'simulation' || activity.content?.simulationType) {
    console.log('🔬 Rendering interactive simulation activity');
    return (
      <InteractiveSimulationActivity
        activity={activity}
        onActivityComplete={onActivityComplete}
      />
    );
  }

  // Handle creative exploration
  if (activity.type === 'creative-exploration' || activity.phase === 'creative-exploration') {
    console.log('🎨 Rendering creative exploration activity');
    return (
      <CreativeExplorationActivity
        activity={activity}
        onActivityComplete={onActivityComplete}
      />
    );
  }

  // Handle content-delivery activities
  if (activity.type === 'content-delivery' || activity.phase === 'content-delivery') {
    console.log('📚 Rendering content-delivery activity');
    return (
      <ActivityContentDelivery
        activity={activity}
        onActivityComplete={onActivityComplete}
      />
    );
  }

  // Handle interactive quiz activities
  if (activity.type === 'interactive-game' || activity.phase === 'interactive-game') {
    if (!activity.content || !activity.content.question || !activity.content.options) {
      console.error("Error: Missing essential content for interactive quiz activity:", activity);
      return <div className="text-red-500 p-4">Error: Activity content is missing for this quiz.</div>;
    }
    return (
      <StableActivityInteractiveQuiz
        activity={activity}
        onActivityComplete={onActivityComplete}
      />
    );
  }

  // Handle introduction activities
  if (activity.type === 'introduction' || activity.phase === 'introduction') {
    const mainTitle = activity.title || 'Introduction';
    const mainText = activity.content?.text || activity.phaseDescription || "Welcome!";
    return (
      <div className="bg-gray-800 rounded-lg p-8 text-center text-white">
        <h3 className="text-2xl font-semibold mb-4">{mainTitle}</h3>
        <div className="text-gray-300 mb-6 text-lg leading-relaxed">
          {mainText}
        </div>
        <div className="flex justify-center mt-6">
          <button
            onClick={() => onActivityComplete(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-4 rounded-lg text-white font-bold text-lg shadow-lg transition-all duration-200 transform hover:scale-105 min-w-[200px]"
          >
            Let's Begin!
          </button>
        </div>
      </div>
    );
  }

  // Handle application activities
  if (activity.type === 'application' || activity.phase === 'application') {
    const scenarioText = activity.content?.scenario;
    return (
      <div className="bg-gray-800 rounded-lg p-8 text-white">
        <h3 className="text-2xl font-semibold mb-4">{activity.title}</h3>
        <div className="text-gray-300 mb-6 text-lg leading-relaxed">
          {scenarioText && (
            <div className="mb-4">
              <h4 className="text-xl font-semibold text-lime-400 mb-2">Scenario:</h4>
              <p>{scenarioText}</p>
            </div>
          )}
          {activity.content?.task && (
            <div className="mb-4">
              <h4 className="text-xl font-semibold text-blue-400 mb-2">Your Task:</h4>
              <p>{activity.content.task}</p>
            </div>
          )}
          {activity.content?.text && !scenarioText && (
            <p>{activity.content.text}</p>
          )}
        </div>
        <div className="flex justify-center mt-6">
          <button
            onClick={() => onActivityComplete(true)}
            className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 px-8 py-4 rounded-lg text-white font-bold text-lg shadow-lg transition-all duration-200 transform hover:scale-105 min-w-[200px]"
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  // Handle summary activities
  if (activity.type === 'summary' || activity.phase === 'summary') {
    return (
      <div className="bg-gradient-to-br from-green-800 to-blue-800 rounded-lg p-8 text-center text-white">
        <div className="text-6xl mb-4">🎉</div>
        <h3 className="text-3xl font-semibold mb-4">{activity.title}</h3>
        <div className="text-gray-200 mb-6 text-lg leading-relaxed">
          {activity.content?.keyTakeaways && (
            <div className="mb-6">
              <h4 className="text-xl font-semibold text-yellow-300 mb-4">What You've Learned:</h4>
              <ul className="space-y-2 text-left max-w-2xl mx-auto">
                {activity.content.keyTakeaways.map((takeaway: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <span className="text-green-400 mr-2">✓</span>
                    <span>{takeaway}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {activity.content?.nextTopicSuggestion && (
            <div className="bg-blue-700 rounded-lg p-4 mb-6">
              <h4 className="text-lg font-semibold text-blue-200 mb-2">Coming Up Next:</h4>
              <p className="text-blue-100">{activity.content.nextTopicSuggestion}</p>
            </div>
          )}
        </div>
        <button
          onClick={() => onActivityComplete(true)}
          className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 px-8 py-4 rounded-lg text-white font-bold text-lg shadow-lg transition-all duration-200 transform hover:scale-105 min-w-[200px]"
        >
          Celebrate! 🎊
        </button>
      </div>
    );
  }

  // Fallback for unhandled activity types
  console.warn('⚠️ Unhandled activity type:', activity.type, activity.phase);
  return (
    <div className="bg-gray-800 rounded-lg p-8 text-white">
      <h3 className="text-2xl font-semibold mb-4">{activity.title}</h3>
      <p className="text-gray-300 mb-6">
        {activity.content?.text || activity.phaseDescription || "Activity content"}
      </p>
      <div className="flex justify-center">
        <button
          onClick={() => onActivityComplete(true)}
          className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-lg text-white font-bold text-lg"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default EnhancedActivityRenderer;
