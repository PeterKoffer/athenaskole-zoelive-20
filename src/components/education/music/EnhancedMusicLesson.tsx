
// @ts-nocheck
import { useState, useEffect } from 'react';
import { MusicUniverseWelcome } from './MusicUniverseWelcome';
import { StableQuizInterface } from '../components/activities/stable-quiz/StableQuizInterface';
import { unifiedQuestionGeneration } from '@/services/unifiedQuestionGeneration';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Music } from 'lucide-react';

interface EnhancedMusicLessonProps {
  onComplete: (score: number, responses: any[]) => void;
}

export const EnhancedMusicLesson = ({ onComplete }: EnhancedMusicLessonProps) => {
  const [showWelcome, setShowWelcome] = useState(true);
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const generateMusicQuestions = async () => {
    if (!user?.id) return;

    setLoading(true);
    setError(null);

    try {
      const musicQuestions = [];
      
      // Generate 5 engaging music questions
      for (let i = 0; i < 5; i++) {
        const config = {
          subject: 'music',
          skillArea: 'general_music',
          difficultyLevel: 2,
          userId: user.id,
          gradeLevel: 5,
          maxAttempts: 3
        };

        const result = await unifiedQuestionGeneration.generateQuestion(user.id, config);
        
        if (result.question) {
          musicQuestions.push({
            id: result.question.id,
            question: result.question.content.question,
            options: result.question.content.options,
            correctAnswer: result.question.content.correctAnswer,
            explanation: result.question.content.explanation,
            subject: 'music',
            skillArea: 'general_music'
          });
        }
      }

      setQuestions(musicQuestions);
    } catch (err) {
      console.error('Error generating music questions:', err);
      setError('Failed to generate music questions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleStartLesson = async () => {
    setShowWelcome(false);
    await generateMusicQuestions();
  };

  if (showWelcome) {
    return <MusicUniverseWelcome onStartLesson={handleStartLesson} />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <Card className="bg-black/20 backdrop-blur-lg border-purple-400/50">
          <CardContent className="p-12 text-center">
            <Music className="w-16 h-16 text-purple-400 mx-auto mb-4 animate-spin" />
            <h2 className="text-2xl font-bold text-white mb-4">
              🎵 Preparing Your Musical Adventure...
            </h2>
            <p className="text-purple-200 mb-6">
              Nelie is creating personalized music questions just for you!
            </p>
            <Loader2 className="w-8 h-8 text-cyan-400 mx-auto animate-spin" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <Card className="bg-red-900/20 backdrop-blur-lg border-red-400/50">
          <CardContent className="p-12 text-center">
            <h2 className="text-2xl font-bold text-red-200 mb-4">
              Oops! Something went wrong
            </h2>
            <p className="text-red-300 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg"
            >
              Try Again
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <Card className="bg-yellow-900/20 backdrop-blur-lg border-yellow-400/50">
          <CardContent className="p-12 text-center">
            <h2 className="text-2xl font-bold text-yellow-200 mb-4">
              No questions available
            </h2>
            <p className="text-yellow-300">Please try refreshing the page.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <StableQuizInterface
        questions={questions}
        onComplete={onComplete}
        subject="music"
        title="🎵 Musical Universe Adventure"
      />
    </div>
  );
};
