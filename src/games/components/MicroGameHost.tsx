import { useState, useEffect } from 'react';
import { GameDefinition } from '../types';
import { loadGame } from '../registry';
import { submitScore } from '@/services/leaderboard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Clock, Target, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { logEvent } from '@/services/telemetry/events';

interface MicroGameHostProps {
  gameId: string;
  params?: any;
  onComplete?: (score: number) => void;
  onClose?: () => void;
}

interface SubmitScorePanelProps {
  score: number;
  gameId: string;
  meta: any;
  onSubmitted?: () => void;
  onClose?: () => void;
}

function SubmitScorePanel({ score, gameId, meta, onSubmitted, onClose }: SubmitScorePanelProps) {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async () => {
    if (!user) return;
    
    setSubmitting(true);
    
    try {
      const success = await submitScore(gameId, score, meta);
      
      if (success) {
        setSubmitted(true);
        await logEvent('game_score_submitted', { gameId, score, meta });
        onSubmitted?.();
      } else {
        console.error('Failed to submit score');
      }
    } catch (error) {
      console.error('Error submitting score:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5" />
          Game Complete!
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="text-3xl font-bold">{score} points</div>
          {meta.accuracy && (
            <div className="text-sm opacity-90">Accuracy: {Math.round(meta.accuracy * 100)}%</div>
          )}
          {meta.durationMs && (
            <div className="text-sm opacity-90 flex items-center justify-center gap-1">
              <Clock className="w-3 h-3" />
              Time: {Math.round(meta.durationMs / 1000)}s
            </div>
          )}
        </div>
        
        <div className="flex gap-2">
          {!submitted && (
            <Button
              onClick={handleSubmit}
              disabled={submitting || !user}
              className="flex-1 bg-white text-orange-600 hover:bg-gray-100"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Trophy className="w-4 h-4 mr-2" />
                  Submit Score
                </>
              )}
            </Button>
          )}
          
          {submitted && (
            <div className="flex-1 text-center text-sm">
              ✅ Score submitted to leaderboard!
            </div>
          )}
          
          {onClose && (
            <Button
              onClick={onClose}
              variant="outline"
              className="bg-white/20 border-white/50 text-white hover:bg-white/30"
            >
              Close
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function MicroGameHost({ gameId, params, onComplete, onClose }: MicroGameHostProps) {
  const [gameDef, setGameDef] = useState<GameDefinition | null>(null);
  const [gameState, setGameState] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    let mounted = true;
    
    (async () => {
      try {
        const def = await loadGame(gameId);
        
        if (!mounted) return;
        
        if (!def) {
          setError(`Game "${gameId}" not found`);
          setLoading(false);
          return;
        }
        
        const seed = Math.floor(Math.random() * 1e9);
        const initialState = def.init(seed, params);
        
        setGameDef(def);
        setGameState(initialState);
        setLoading(false);
        
        await logEvent('game_started', { gameId, seed, params });
      } catch (err) {
        if (!mounted) return;
        
        console.error('Failed to load game:', err);
        setError('Failed to load game');
        setLoading(false);
      }
    })();
    
    return () => { mounted = false; };
  }, [gameId, params]);

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <Loader2 className="w-8 h-8 animate-spin mr-2" />
          Loading game...
        </CardContent>
      </Card>
    );
  }

  if (error || !gameDef || !gameState) {
    return (
      <Card>
        <CardContent className="text-center p-8">
          <div className="text-red-500 mb-4">{error || 'Failed to load game'}</div>
          {onClose && (
            <Button onClick={onClose} variant="outline">
              Close
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  const dispatch = (action: any) => {
    setGameState((currentState: any) => gameDef.reducer(currentState, action));
  };

  const finished = gameDef.isFinished(gameState);
  const currentScore = gameDef.score(gameState);
  const progress = gameDef.getProgress ? gameDef.getProgress(gameState) : 0;

  const handleScoreSubmitted = () => {
    onComplete?.(currentScore);
  };

  return (
    <div className="space-y-4">
      {/* Game Header */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">{gameDef.title}</CardTitle>
              <div className="text-sm text-muted-foreground">{gameDef.subject}</div>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Target className="w-4 h-4" />
                Score: {currentScore}
              </div>
              {!finished && progress > 0 && (
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${Math.min(100, progress * 100)}%` }}
                  />
                </div>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Game Content */}
      <div>
        {gameDef.render(gameState, dispatch)}
      </div>

      {/* Score Submission Panel */}
      {finished && (
        <SubmitScorePanel
          score={currentScore}
          gameId={gameDef.id}
          meta={{
            durationMs: Date.now() - startTime,
            params,
            ...gameState.meta
          }}
          onSubmitted={handleScoreSubmitted}
          onClose={onClose}
        />
      )}
    </div>
  );
}