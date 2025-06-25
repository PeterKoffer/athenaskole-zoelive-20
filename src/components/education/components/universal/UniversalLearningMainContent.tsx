import React, { useState, useEffect } from 'react'; // Added React for FC type
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Volume2, VolumeX, Play, Pause, Home } from 'lucide-react';
import ClassroomEnvironment from '../shared/ClassroomEnvironment';
import { getClassroomConfig } from '../shared/classroomConfigs';
import { LessonActivity, IntroductionContent, ContentDeliveryContent, InteractiveGameContent, ApplicationContent, CreativeExplorationContent, SummaryContent } from '../types/LessonTypes';

// Imports for Simulation
import GameEngine, { GameConfig, GameState, GameActions } from '@/components/games/GameEngine'; // Assuming GameEngine path
import SimulationActivityDisplay from '@/components/simulations/SimulationActivityDisplay'; // Assuming path
import { SimulationActivityContent } from '@/types/simulationContentTypes'; // Assuming path

interface UniversalLearningMainContentProps {
  subject: string;
  skillArea: string;
  studentName: string;
  // For GameConfig, assuming these might come from a higher-level context or props
  gradeLevelMin?: number;
  gradeLevelMax?: number;
  timeElapsed: number;
  targetLessonLength: number;
  score: number;
  currentActivityIndex: number;
  totalRealActivities: number;
  correctStreak: number;
  currentActivity: LessonActivity | null;
  isSpeaking: boolean;
  onBackToProgram: () => void;
  onToggleMute: () => void;
  onReadRequest: () => void;
  onStopSpeaking: () => void;
  onActivityComplete: (result: any) => void;
}

const UniversalLearningMainContent: React.FC<UniversalLearningMainContentProps> = ({ // Added React.FC
  subject,
  skillArea,
  studentName,
  gradeLevelMin = 3, // Defaulting if not provided
  gradeLevelMax = 5, // Defaulting if not provided
  timeElapsed,
  targetLessonLength,
  score,
  currentActivityIndex,
  totalRealActivities,
  correctStreak,
  currentActivity,
  isSpeaking,
  onBackToProgram,
  onToggleMute,
  onReadRequest,
  onStopSpeaking,
  onActivityComplete
}: UniversalLearningMainContentProps) => {
  const [showWelcomeTemplate, setShowWelcomeTemplate] = useState(true);
  const classroomConfig = getClassroomConfig(subject);
  // State for simple text inputs, can be expanded if needed
  const [responseText, setResponseText] = useState('');


  const getSubjectWelcomeContent = (subjectName: string) => {
    // ... (welcome content logic remains the same as provided)
    switch (subjectName.toLowerCase()) {
      case 'mathematics':
        return {
          title: 'Mathematics with Nelie!',
          subtitle: 'Ready for an amazing adventure?',
          welcomeMessage: `Hello ${studentName}! I'm Nelie, your math learning companion! Today we're going to explore the amazing world of numbers, patterns, and problem-solving together.`,
          tips: [
            'Take your time with each problem - there\'s no rush!',
            'Ask Nelie to repeat if you need to hear something again',
            'Math is like solving puzzles - have fun with it!',
            'Every mistake is a chance to learn something new!'
          ],
          readyMessage: 'Ready to start your math adventure!',
          lessonInfo: 'Starting lesson automatically in 5 seconds...'
        };
      case 'english':
        return {
          title: 'English with Nelie!',
          subtitle: 'Ready for an amazing adventure?',
          welcomeMessage: `Hello ${studentName}! I'm Nelie, your English learning companion! Today we're going to explore the wonderful world of words, stories, and language together.`,
          tips: [
            'Read carefully and take your time with each question',
            'Ask Nelie to repeat if you need to hear something again',
            'Every new word you learn opens new possibilities!',
            'Practice makes your reading and writing stronger!'
          ],
          readyMessage: 'Ready to start your English adventure!',
          lessonInfo: 'Starting lesson automatically in 5 seconds...'
        };
      case 'science':
        return {
          title: 'Science with Nelie!',
          subtitle: 'Ready for an amazing adventure?',
          welcomeMessage: `Hello ${studentName}! I'm Nelie, your science learning companion! Today we're going to explore the incredible world of discovery and investigation together.`,
          tips: [
            'Think like a scientist - ask questions and explore!',
            'Ask Nelie to repeat if you need to hear something again',
            'Science is all around us - look for patterns everywhere!',
            'Every experiment teaches us something new!'
          ],
          readyMessage: 'Ready to start your science adventure!',
          lessonInfo: 'Starting lesson automatically in 5 seconds...'
        };
      case 'music':
        return {
          title: 'Music with Nelie!',
          subtitle: 'Ready for an amazing adventure?',
          welcomeMessage: `Hello ${studentName}! I'm Nelie, your music learning companion! Today we're going to explore the beautiful world of rhythm, melody, and harmony together.`,
          tips: [
            'Listen carefully to the rhythms and melodies around you',
            'Ask Nelie to repeat if you need to hear something again',
            'Music is a universal language - express yourself!',
            'Every note you learn adds to your musical journey!'
          ],
          readyMessage: 'Ready to start your music adventure!',
          lessonInfo: 'Starting lesson automatically in 5 seconds...'
        };
      case 'computer-science':
        return {
          title: 'Computer Science with Nelie!',
          subtitle: 'Ready for an amazing adventure?',
          welcomeMessage: `Hello ${studentName}! I'm Nelie, your coding learning companion! Today we're going to explore the exciting world of programming and technology together.`,
          tips: [
            'Think step-by-step like a computer programmer',
            'Ask Nelie to repeat if you need to hear something again',
            'Coding is like building with digital blocks!',
            'Every line of code you learn is a new superpower!'
          ],
          readyMessage: 'Ready to start your coding adventure!',
          lessonInfo: 'Starting lesson automatically in 5 seconds...'
        };
      case 'creative-arts':
        return {
          title: 'Creative Arts with Nelie!',
          subtitle: 'Ready for an amazing adventure?',
          welcomeMessage: `Hello ${studentName}! I'm Nelie, your art learning companion! Today we're going to explore the colorful world of creativity and artistic expression together.`,
          tips: [
            'Let your imagination flow freely and creatively',
            'Ask Nelie to repeat if you need to hear something again',
            'Art is about expressing your unique vision!',
            'Every creation you make is beautifully unique!'
          ],
          readyMessage: 'Ready to start your art adventure!',
          lessonInfo: 'Starting lesson automatically in 5 seconds...'
        };
      default:
        return {
          title: `${subject.charAt(0).toUpperCase() + subject.slice(1)} with Nelie!`,
          subtitle: 'Ready for an amazing adventure?',
          welcomeMessage: `Hello ${studentName}! I'm Nelie, your learning companion! Today we're going to explore the exciting world of ${subject} together.`,
          tips: [
            'Take your time and think through each challenge',
            'Ask Nelie to repeat if you need to hear something again',
            'Learning is an adventure - enjoy the journey!',
            'Every step forward makes you stronger and smarter!'
          ],
          readyMessage: 'Ready to start your learning adventure!',
          lessonInfo: 'Starting lesson automatically in 5 seconds...'
        };
    }
  };

  const subjectContent = getSubjectWelcomeContent(subject);

  const handleStartIntroductionWithNelie = () => {
    setShowWelcomeTemplate(false);
  };

  const handleStartLessonWithoutSpeech = () => {
    setShowWelcomeTemplate(false);
  };

  useEffect(() => {
    // Reset response text when activity changes
    setResponseText('');
  }, [currentActivity]);


  const renderActivityContent = () => {
    if (!currentActivity || !currentActivity.content) {
      return (
        <div className="text-center text-white">
          <p>Loading activity...</p>
          <Button onClick={() => onActivityComplete({})} className="mt-4">Continue</Button>
        </div>
      );
    }

    // Type casting for convenience, ensure content matches type in generator
    const { content, type } = currentActivity;

    switch (type) {
      case 'introduction':
        const introContent = content as IntroductionContent;
        return (
          <div className="text-white space-y-4 text-center">
            {introContent.hook && <p className="text-lg">{introContent.hook}</p>}
            {introContent.realWorldExample && <p>{introContent.realWorldExample}</p>}
            {introContent.storyContext && <p className="italic">{introContent.storyContext}</p>}
            {introContent.introductionText && <p>{introContent.introductionText}</p>}
            {introContent.learningObjectives && (
              <div>
                <h4 className="font-semibold mt-2">Today we will:</h4>
                <ul className="list-disc list-inside">
                  {introContent.learningObjectives.map((obj, i) => <li key={i}>{obj}</li>)}
                </ul>
              </div>
            )}
            <Button onClick={() => onActivityComplete({})} className="mt-6 bg-green-500 hover:bg-green-600">Let's Start!</Button>
          </div>
        );

      case 'content-delivery':
        const deliveryContent = content as ContentDeliveryContent;
        return (
          <div className="text-white space-y-4">
            {deliveryContent.introductionText && <p className="text-lg font-semibold">{deliveryContent.introductionText}</p>}
            {deliveryContent.mainExplanation && <p>{deliveryContent.mainExplanation}</p>}
            {deliveryContent.examples?.map((ex, i) => <p key={i} className="pl-4 italic">Example: {ex}</p>)}
            {deliveryContent.segments?.map((seg, i) => (
              <div key={i} className="p-3 bg-black/20 rounded-md">
                <h4 className="font-semibold">{seg.title}</h4>
                <p>{seg.explanation}</p>
                {seg.examples?.map((exSeg, j) => <p key={j} className="pl-2 italic text-sm">E.g.: {exSeg}</p>)}
                {seg.checkQuestion && <p className="mt-2 text-purple-300">Quick Check: {seg.checkQuestion}</p>}
              </div>
            ))}
            <Button onClick={() => onActivityComplete({})} className="mt-6 bg-blue-500 hover:bg-blue-600 w-full">Got it!</Button>
          </div>
        );

      case 'interactive-game':
        const gameContent = content as InteractiveGameContent;
        return (
          <div className="text-white text-center space-y-4">
            <p className="text-xl font-semibold">{gameContent.question}</p>
            {gameContent.gameType === "drag-and-drop" && <p className="text-sm">(Imagine a drag and drop interface here)</p>}
            {gameContent.options ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {gameContent.options.map((option, index) => (
                  <Button
                    key={index}
                    onClick={() => onActivityComplete({ success: true, answer: index })} // Simplified completion
                    variant="outline"
                    className="text-lg p-4 border-purple-400 hover:bg-purple-600"
                  >
                    {option}
                  </Button>
                ))}
              </div>
            ) : (
              <Button onClick={() => onActivityComplete({})} className="mt-6 bg-yellow-500 hover:bg-yellow-600">Play Game</Button>
            )}
             {gameContent.explanation && <p className="text-sm mt-4 p-2 bg-black/30 rounded">{gameContent.explanation}</p>}
          </div>
        );

      case 'application':
        const appContent = content as ApplicationContent;
        return (
          <div className="text-white space-y-4">
            {appContent.scenario && <p className="font-semibold">{appContent.scenario}</p>}
            {appContent.task && <p>{appContent.task}</p>}
            <Textarea
              placeholder="Type your response here..."
              className="bg-black/30 border-purple-400 text-white"
              value={responseText}
              onChange={(e) => setResponseText(e.target.value)}
            />
            {appContent.hints?.map((hint, i) => <p key={i} className="text-sm text-gray-400 italic">Hint: {hint}</p>)}
            <Button onClick={() => onActivityComplete({ response: responseText })} className="mt-6 bg-orange-500 hover:bg-orange-600 w-full">Submit Response</Button>
          </div>
        );

      case 'creative-exploration':
        const creativeContent = content as CreativeExplorationContent;
        return (
          <div className="text-white space-y-4">
            {creativeContent.creativePrompt && <p className="font-semibold text-lg">{creativeContent.creativePrompt}</p>}
            {creativeContent.whatIfScenario && <p className="italic">{creativeContent.whatIfScenario}</p>}
            {creativeContent.guidelines?.map((guide, i) => <p key={i} className="text-sm text-gray-300">Tip: {guide}</p>)}
            <Textarea
              placeholder="Let your imagination flow! Type your ideas here..."
              className="bg-black/30 border-purple-400 text-white min-h-[150px]"
              value={responseText}
              onChange={(e) => setResponseText(e.target.value)}
            />
            <Button onClick={() => onActivityComplete({ idea: responseText })} className="mt-6 bg-pink-500 hover:bg-pink-600 w-full">Save My Idea</Button>
          </div>
        );

      case 'summary':
        const summaryContent = content as SummaryContent;
        return (
          <div className="text-white space-y-4 text-center">
            <h4 className="text-xl font-semibold">Lesson Recap!</h4>
            {summaryContent.keyTakeaways?.map((takeaway, i) => <p key={i} className="p-2 bg-black/20 rounded">{takeaway}</p>)}
            {summaryContent.nextStepsPreview && <p className="mt-4 text-purple-300">{summaryContent.nextStepsPreview}</p>}
            {summaryContent.finalEncouragement && <p className="mt-4 text-lg font-bold text-green-400">{summaryContent.finalEncouragement}</p>}
            <Button onClick={() => onActivityComplete({})} className="mt-6 bg-teal-500 hover:bg-teal-600">Finish Lesson</Button>
          </div>
        );

      case 'simulation':
        const simActivityContent = content as SimulationActivityContent;
        if (!simActivityContent || !simActivityContent.details || !simActivityContent.simulationType) {
          return (
            <div className="text-red-500 p-4">
              Error: Simulation content is missing or malformed for activity: {currentActivity.title}.
              <Button onClick={() => onActivityComplete({ error: 'malformed_simulation_content' })} className="mt-4">Skip Activity</Button>
            </div>
          );
        }

        const gameConfigForSim: GameConfig = {
          id: currentActivity.id + '_sim_game', // Unique ID for this game instance
          title: simActivityContent.title || currentActivity.title || 'Simulation Challenge',
          subject: subject,
          interactionType: 'simulation', // Crucial: tells GameEngine this is a simulation
          difficulty: currentActivity.metadata?.difficulty || 3,
          gradeLevel: [gradeLevelMin, gradeLevelMax],
          objectives: [simActivityContent.introductionText || 'Complete the simulation successfully.'],
          maxScore: 1000,
          timeLimit: currentActivity.duration,
          adaptiveRules: {
            successThreshold: 0.7, // Example: 70% of maxScore or specific sim success
            failureThreshold: 0.3,
            difficultyIncrease: 1,
            difficultyDecrease: 1,
          },
          // other metadata can be passed if GameConfig supports it
        };

        return (
          <div className="w-full mx-auto relative" style={{ minHeight: '500px' /* Ensure GameEngine has space */ }}>
            <GameEngine
              gameConfig={gameConfigForSim}
              onComplete={(finalScore, achievements) => {
                console.log('Simulation completed via GameEngine!', { finalScore, achievements });
                // Determine success based on simulation's own metrics or score vs objectives
                const success = simActivityContent.details.successMetrics ?
                  simActivityContent.details.successMetrics.every(metric => {
                    // This logic would need access to final simState from gameState.gameData
                    // For now, let's assume finalScore reflects overall success
                    return finalScore >= (gameConfigForSim.adaptiveRules?.successThreshold || 0.7) * gameConfigForSim.maxScore;
                  })
                  : finalScore >= (gameConfigForSim.adaptiveRules?.successThreshold || 0.7) * gameConfigForSim.maxScore;

                onActivityComplete({ success: success, score: finalScore, achievements });
              }}
              onBack={() => {
                console.log('Simulation backed out via GameEngine.');
                // Decide how to handle "back" from a simulation - e.g., mark as incomplete or allow resume?
                onActivityComplete({ success: false, status: 'backed_out' });
              }}
              // Pass the lessonActivity for SimulationActivityDisplay to use
              // GameEngine might need a way to pass this through to its children function
              // For now, we assume SimulationActivityDisplay can access it if GameEngine exposes it or if we pass it directly.
              // Let's assume GameEngine's children render prop gets the full currentActivity or specific parts.
              // The SimulationActivityDisplay expects lessonActivity directly.
              // So GameEngine needs to make this available to its child function.
              // This might require a small adjustment to GameEngine's children render prop signature
              // if it doesn't already pass through arbitrary context or the activity object.
              // For this subtask, we'll assume GameEngine's child function can receive `lessonActivity`
              // or GameEngine itself takes `currentLessonActivity` prop.
              // Simplest is to assume GameEngine's children render prop provides gameState and gameActions
              // and SimulationActivityDisplay uses currentActivity from its own closure.
            >
              {(gameState: GameState, gameActions: GameActions) => (
                <SimulationActivityDisplay
                  gameState={gameState}
                  gameActions={gameActions}
                  gameConfig={gameConfigForSim}
                  lessonActivity={currentActivity} // Pass the full LessonActivity
                />
              )}
            </GameEngine>
          </div>
        );

      default:
        // This default case should ideally not be reached if all ActivityTypes are handled.
        console.warn("Unhandled activity type in renderActivityContent:", type);
        return (
          <div className="text-center text-white">
            <p>Cannot display activity of type: {type}.</p>
            <Button onClick={() => onActivityComplete({ error: 'unknown_type' })} className="mt-4">Skip</Button>
          </div>
        );
    }
  };


  if (showWelcomeTemplate) {
    // ... (welcome template JSX remains the same)
    return (
      <ClassroomEnvironment config={classroomConfig}>
        <div className="w-full max-w-4xl mx-auto px-4 py-6 space-y-6">
          {/* Header Section with Home button */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button
                onClick={() => window.location.href = '/'}
                variant="outline"
                size="sm"
                className="border-gray-400 text-white hover:bg-gray-700 bg-black/50"
              >
                <Home className="w-4 h-4 mr-2" />
                Home
              </Button>
              
              <Button
                onClick={onBackToProgram}
                variant="outline"
                size="sm"
                className="border-gray-400 text-white hover:bg-gray-700 bg-black/50"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="border-gray-400 text-white hover:bg-gray-700 bg-black/50"
              >
                Sound Off
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-gray-400 text-white hover:bg-gray-700 bg-black/50"
              >
                Ask Nelie to Repeat
              </Button>
            </div>
          </div>

          {/* Main Welcome Card */}
          <Card className="bg-black/70 border-purple-400/50 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-white mb-2">
                  Welcome to {subjectContent.title}
                </h1>
                <div className="text-2xl text-purple-200 mb-6">
                  {subjectContent.subtitle}
                </div>
              </div>

              {/* Welcome Message */}
              <div className="bg-blue-900/40 rounded-lg p-6 border border-blue-400/30 mb-6">
                <div className="text-blue-100 text-lg leading-relaxed text-center">
                  {subjectContent.welcomeMessage}
                </div>
              </div>

              {/* Progress Info */}
              <div className="text-center text-white mb-6">
                <p className="text-lg">Step 1 of 1</p>
                <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                  <div className="bg-purple-400 h-2 rounded-full w-full"></div>
                </div>
              </div>

              {/* Tips Section */}
              <div className="bg-green-900/30 border border-green-400/30 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-green-300 mb-4 flex items-center">
                  💡 {subject.charAt(0).toUpperCase() + subject.slice(1)} Learning Tips
                </h3>
                <ul className="space-y-2">
                  {subjectContent.tips.map((tip, index) => (
                    <li key={index} className="text-green-200 flex items-start">
                      <span className="mr-2">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Buttons - NO purple ready box here */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button
                  onClick={handleStartIntroductionWithNelie}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold px-6 py-3"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Start Introduction with Nelie
                </Button>
                
                <Button
                  onClick={handleStartLessonWithoutSpeech}
                  variant="outline"
                  className="border-gray-400 text-white hover:bg-gray-700 bg-black/30"
                >
                  Start Lesson Without Speech
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </ClassroomEnvironment>
    );
  }

  return (
    <ClassroomEnvironment config={classroomConfig}>
      <div className="w-full max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Lesson Header */}
        <div className="flex items-center justify-between bg-black/50 backdrop-blur-sm rounded-lg p-4">
          <div className="flex items-center space-x-4">
            <Button
              onClick={onBackToProgram}
              variant="outline"
              size="sm"
              className="border-gray-400 text-white hover:bg-gray-700"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="text-white">
              <h2 className="text-lg font-semibold">{subject.charAt(0).toUpperCase() + subject.slice(1)} Learning</h2>
              <p className="text-sm text-gray-300">Activity {currentActivityIndex + 1} of {totalRealActivities}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              onClick={isSpeaking ? onStopSpeaking : onReadRequest}
              variant="outline"
              size="sm"
              className="border-purple-400 text-purple-200 hover:bg-purple-700"
            >
              {isSpeaking ? <Pause className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </Button>
            <Button
              onClick={onToggleMute}
              variant="outline"
              size="sm"
              className="border-gray-400 text-gray-300 hover:bg-gray-700"
            >
              <VolumeX className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Current Activity Content Card */}
        {currentActivity && (
          <Card className="bg-black/50 border-purple-400/50 backdrop-blur-sm">
            <CardContent className="p-6 sm:p-8"> {/* Adjusted padding for responsiveness */}
              <h3 className="text-2xl font-bold text-white mb-4 text-center">{currentActivity.title}</h3>
              {renderActivityContent()} {/* Dynamic content rendering here */}
            </CardContent>
          </Card>
        )}

        {/* Progress Bar */}
        <div className="bg-black/50 backdrop-blur-sm rounded-lg p-4">
          <div className="flex items-center justify-between text-white text-sm mb-2">
            <span>Progress</span>
            <span>{Math.round((timeElapsed / targetLessonLength) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-purple-400 to-blue-400 h-3 rounded-full transition-all duration-300"
              style={{ width: `${Math.min((timeElapsed / targetLessonLength) * 100, 100)}%` }}
            />
          </div>
        </div>
      </div>
    </ClassroomEnvironment>
  );
};

export default UniversalLearningMainContent;
