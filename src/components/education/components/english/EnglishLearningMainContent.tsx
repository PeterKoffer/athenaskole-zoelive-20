
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Star, RotateCcw, Home, Volume2, VolumeX } from "lucide-react";
import ActivityRenderer from "../ActivityRenderer";
import EnglishLearningTips from "./EnglishLearningTips";

interface EnglishLearningMainContentProps {
  studentName: string;
  timeElapsed: number;
  targetLessonLength: number;
  score: number;
  currentActivityIndex: number;
  totalRealActivities: number;
  correctStreak: number;
  currentActivity: any;
  isSpeaking: boolean;
  onBackToProgram: () => void;
  onToggleMute: () => void;
  onReadRequest: () => void;
  onStopSpeaking: () => void;
  onActivityComplete: (success: boolean, timeSpent: number) => void;
}

const EnglishLearningMainContent = ({
  studentName,
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
}: EnglishLearningMainContentProps) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-purple-950 to-indigo-950">
      {/* Header */}
      <div className="bg-purple-900/50 backdrop-blur-sm border-b border-purple-700">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-2xl">📚</div>
              <div>
                <h1 className="text-white text-xl font-bold">English with Nelie</h1>
                <p className="text-purple-200 text-sm">Learning with {studentName}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-purple-200">
                <Clock className="w-4 h-4" />
                <span className="text-sm">{formatTime(timeElapsed)} / {formatTime(targetLessonLength)}</span>
              </div>
              
              <div className="flex items-center space-x-2 text-purple-200">
                <Star className="w-4 h-4 text-yellow-400" />
                <span className="text-sm">Score: {score}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Progress */}
        <Card className="bg-purple-900/30 border-purple-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-purple-200 text-sm">
                Activity {currentActivityIndex + 1} of {totalRealActivities}
              </span>
              {correctStreak > 0 && (
                <span className="text-green-400 text-sm flex items-center">
                  <span className="mr-1">🔥</span>
                  {correctStreak} in a row!
                </span>
              )}
            </div>
            <div className="w-full bg-purple-900 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-purple-400 to-blue-400 h-2 rounded-full transition-all duration-500"
                style={{ width: `${((currentActivityIndex + 1) / totalRealActivities) * 100}%` }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Controls */}
        <div className="flex justify-center gap-3">
          <Button
            onClick={onToggleMute}
            variant="outline"
            size="sm"
            className="border-purple-400 text-purple-200 bg-purple-800/50 hover:bg-purple-700"
          >
            {isSpeaking ? <VolumeX className="w-4 h-4 mr-2" /> : <Volume2 className="w-4 h-4 mr-2" />}
            {isSpeaking ? 'Mute Nelie' : 'Unmute Nelie'}
          </Button>
          
          <Button
            onClick={isSpeaking ? onStopSpeaking : onReadRequest}
            variant="outline"
            size="sm"
            className="border-purple-400 text-purple-200 bg-purple-800/50 hover:bg-purple-700"
            disabled={false}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            {isSpeaking ? 'Stop Nelie' : 'Ask Nelie to Repeat'}
          </Button>
          
          <Button
            onClick={onBackToProgram}
            variant="outline"
            size="sm"
            className="border-purple-400 text-purple-200 bg-purple-800/50 hover:bg-purple-700"
          >
            <Home className="w-4 h-4 mr-2" />
            Home
          </Button>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Activity (2/3 width on large screens) */}
          <div className="lg:col-span-2">
            <ActivityRenderer
              activity={currentActivity}
              onComplete={onActivityComplete}
              timeRemaining={0}
            />
          </div>

          {/* Tips Sidebar (1/3 width on large screens) */}
          <div className="lg:col-span-1">
            <EnglishLearningTips 
              skillArea="general_english"
              currentActivity={currentActivity?.type}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnglishLearningMainContent;
