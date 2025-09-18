import type { AdventureGame, GameHandle } from './sdk';

const game: AdventureGame = {
  id:'allergen-advisor', 
  title:'Allergen Advisor', 
  subject:'Language Lab',
  async mount(el: HTMLElement): Promise<GameHandle> {
    let score = 0;
    el.innerHTML = `<div class="text-sm">Svar høfligt og sikkert på allergenspørgsmål.</div>
    <div class="flex gap-2 mt-2">
      <button class="bg-gray-800 text-white px-2 py-1" data-ok>Ingredienser står her — peanuts? No. / Cacahuetes: no.</button>
      <button class="bg-gray-800 text-white px-2 py-1">Det ved jeg ikke</button>
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