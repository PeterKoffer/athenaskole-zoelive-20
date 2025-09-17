import type { AdventureGame, GameHandle, GameStartOptions } from './sdk';
import { emitGameEvent } from './telemetry';

const game: AdventureGame = {
  id: 'budget-breaker', title: 'Budget Breaker', subject: 'Mathematics',
  async mount(el: HTMLElement, opts: GameStartOptions): Promise<GameHandle> {
    let score = 0, actions = 0;
    el.innerHTML = `
      <div class="space-y-2">
        <div class="text-sm">Choose the best discounts and reach the goal.</div>
        <button id="a" class="px-2 py-1 rounded bg-gray-800 text-white">25% off 120 kr</button>
        <button id="b" class="px-2 py-1 rounded bg-gray-800 text-white">3/4 of 20</button>
        <div id="log" class="text-xs text-gray-400"></div>
      </div>`;
    const log = el.querySelector('#log')! as HTMLDivElement;
    const add = (points:number, msg:string) => { 
      score = Math.min(100, score + points); 
      actions++; 
      log.innerText = `${msg} → score ${score}`; 
      emitGameEvent({ type:'game:telemetry', id:'budget-breaker', t:Date.now(), payload:{ points, score, actions } }); 
    };
    el.querySelector('#a')!.addEventListener('click', () => add(12, 'Correct: 90 kr'));
    el.querySelector('#b')!.addEventListener('click', () => add(8, 'Correct: 15'));
    return { 
      start(){}, 
      pause(){}, 
      resume(){}, 
      destroy(){ el.innerHTML=''; }, 
      async submit(){ return { ok:true, scoreDelta: score, data:{ actions } }; }, 
      on(){}, 
      getState(){ return { score, actions } } 
    };
  }
};
export default game;