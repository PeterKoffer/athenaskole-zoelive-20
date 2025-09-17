import type { AdventureGame, GameHandle } from './sdk';

const game: AdventureGame = {
  id:'allergen-advisor', title:'Allergen Advisor', subject:'Language Lab',
  async mount(el: HTMLElement): Promise<GameHandle> {
    let score = 0;
    el.innerHTML = `<div class="text-sm">Answer politely and safely about allergen questions.</div>
    <div class="flex gap-2 mt-2">
      <button class="bg-gray-800 text-white px-2 py-1" data-ok>Ingredients here — peanuts? No. / Cacahuetes: no.</button>
      <button class="bg-gray-800 text-white px-2 py-1">I don't know</button>
    </div>`;
    el.querySelector('[data-ok]')!.addEventListener('click',()=> score=100);
    return { 
      start(){}, 
      pause(){}, 
      resume(){}, 
      destroy(){ el.innerHTML=''; }, 
      async submit(){ return { ok:true, scoreDelta: score }; }, 
      on(){}, 
      getState(){ return { score } } 
    };
  }
};
export default game;