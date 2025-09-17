import type { AdventureGame, GameHandle, GameStartOptions } from './sdk';
const game: AdventureGame = {
  id: 'poster-layout', title: 'Poster Layout', subject: 'Creative Arts',
  async mount(el: HTMLElement, opts: GameStartOptions): Promise<GameHandle> {
    let score = 50; // starter midt, justeres af valg
    el.innerHTML = `
      <div class="text-sm">Placér elementer på et simpelt grid. Ingen tekst på billedet.</div>
      <div class="grid grid-cols-3 gap-2 mt-2">
        <button class="bg-gray-800 text-white p-2" data-w="rule">Rule-of-thirds</button>
        <button class="bg-gray-800 text-white p-2" data-w="contrast">Farvekontrast</button>
        <button class="bg-gray-800 text-white p-2" data-w="clutter">Mindre rod</button>
      </div>`;
    el.querySelectorAll('button').forEach(b=> b.addEventListener('click', (e)=>{
      const v = (e.target as HTMLButtonElement).dataset.w;
      if (v==='clutter') score+=10; else score+=8;
    }));
    return {
      start(){}, pause(){}, resume(){}, destroy(){ el.innerHTML=''; },
      async submit(){ return { ok:true, scoreDelta: Math.min(100, score) }; },
      on(){}, getState(){ return { score } }
    };
  }
};
export default game;