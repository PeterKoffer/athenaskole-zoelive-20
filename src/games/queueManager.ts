import type { AdventureGame, GameHandle } from './sdk';

const game: AdventureGame = {
  id:'queue-manager', title:'Queue Manager', subject:'Cross',
  async mount(el: HTMLElement): Promise<GameHandle> {
    let score = 50;
    el.innerHTML = `<div class="text-sm">Adjust price and staffing to keep the queue down.</div>
    <div class="flex gap-2 mt-2">
      <button class="bg-gray-800 text-white px-2 py-1" data-a="price-up">Price +5</button>
      <button class="bg-gray-800 text-white px-2 py-1" data-a="staff-up">Extra helper</button>
    </div>`;
    el.querySelectorAll('button').forEach(b=> b.addEventListener('click',(e)=>{ 
      const a=(e.target as HTMLButtonElement).dataset.a; 
      score += a==='staff-up'? 10:5; 
    }));
    return { 
      start(){}, 
      pause(){}, 
      resume(){}, 
      destroy(){ el.innerHTML=''; }, 
      async submit(){ return { ok:true, scoreDelta: Math.min(100, score) }; }, 
      on(){}, 
      getState(){ return { score } } 
    };
  }
};
export default game;