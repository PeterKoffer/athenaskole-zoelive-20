import { useState, useEffect } from 'react';
import { GameDefinition } from '../types';
import { getGame } from '../registry';
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
  // Temporarily disabled - use GameHost component instead for new game system
  return (
    <div className="p-4 text-center text-muted-foreground">
      <p>Use GameHost component for new adventure games</p>
      {onClose && (
        <Button onClick={onClose} className="mt-4">Close</Button>
      )}
    </div>
  );
}