import type { AdventureGame, GameHandle } from './sdk';

const game: AdventureGame = {
  id:'cold-chain', title:'Cold Chain Check', subject:'Science',
  async mount(el: HTMLElement): Promise<GameHandle> {
    let score = 0; 
    const scenarios = [
      { q:'Chicken 3h without cooling?', ok:'Throw away' },
      { q:'Mayo in 32°C sun?', ok:'Cool to 4°C' }
    ];
    el.innerHTML = `<div class="space-y-2">${scenarios.map((s,i)=>`
      <div class="text-sm">${i+1}) ${s.q}</div>
      <div class="flex gap-2">
        <button class="bg-gray-800 text-white px-2 py-1" data-a="ok">${s.ok}</button>
        <button class="bg-gray-800 text-white px-2 py-1" data-a="bad">Alternative</button>
      </div>`).join('')}</div>`;
    el.querySelectorAll('button').forEach(b=> b.addEventListener('click',(e)=>{ 
      const a=(e.target as HTMLButtonElement).dataset.a; 
      score += a==='ok'? 15:0; 
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