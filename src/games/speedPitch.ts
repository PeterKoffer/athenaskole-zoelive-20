import type { AdventureGame, GameHandle, GameStartOptions } from './sdk';

const game: AdventureGame = {
  id:'speed-pitch', 
  title:'Speed Pitch', 
  subject:'Entrepreneurship',
  async mount(el: HTMLElement, opts: GameStartOptions): Promise<GameHandle> {
    let score = 0;
    el.innerHTML = `<div class="text-sm">Hold en 60 sek pitch: slogan + 2 argumenter.</div>
    <div class="text-xs mt-2">Når du er klar, klik: "Jeg har pitchet"</div>
    <button class="bg-gray-800 text-white px-2 py-1 mt-2" id="done">Jeg har pitchet</button>`;
    el.querySelector('#done')!.addEventListener('click',()=> score=100);
    return { 
      start(){}, 
      pause(){}, 
      resume(){}, 
      destroy(){ el.innerHTML=''; }, 
      async submit(){ return { ok:true, scoreDelta: score, data:{ pitched: score===100 } }; }, 
      on(){}, 
      getState(){ return { score } } 
    };
  }
};

export default game;