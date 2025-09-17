import type { AdventureGame, GameHandle } from './sdk';

const game: AdventureGame = {
  id:'poster-layout', title:'Poster Layout', subject:'Creative Arts',
  async mount(el: HTMLElement): Promise<GameHandle> {
    let score = 50;
    el.innerHTML = `
      <div class="text-sm">Place elements on a simple grid. No text on the image.</div>
      <div class="grid grid-cols-3 gap-2 mt-2">
        <button class="bg-gray-800 text-white p-2" data-w="rule">Rule-of-thirds</button>
        <button class="bg-gray-800 text-white p-2" data-w="contrast">Color contrast</button>
        <button class="bg-gray-800 text-white p-2" data-w="clutter">Less clutter</button>
      </div>`;
    el.querySelectorAll('button').forEach(b=> b.addEventListener('click',(e)=>{ 
      const v=(e.target as HTMLButtonElement).dataset.w; 
      score += v==='clutter'?10:8; 
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