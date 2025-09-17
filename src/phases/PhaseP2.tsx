import { GameHost } from '@/components/GameHost';
import { seedFromId } from '@/games/utils';
import '@/games';

export function PhaseP2({ adventureId, studentLevel, coreCompleted }: any){
  return (
    <GameHost
      gameId="budget-breaker"
      allowStart={coreCompleted}
      opts={{ seed: seedFromId(adventureId, 2), timeboxSec: 900, studentLevel }}
      onComplete={(r)=> console.log('p2 game score', r.score)}
    />
  );
}