import type { AdventureGame, GameHandle } from './sdk';

const game: AdventureGame = {
  id:'bom-builder', title:'BOM Builder', subject:'Entrepreneurship',
  async mount(el: HTMLElement): Promise<GameHandle> {
    let items = [ 
      { name:'Fridge', qty:1, price:2200 }, 
      { name:'Sink', qty:1, price:800 }, 
      { name:'Pan', qty:2, price:120 } 
    ];
    el.innerHTML = `<div class="text-sm">Choose parts for your truck. Keep within budget.</div><ul class="text-xs mt-2"></ul>`;
    const ul = el.querySelector('ul')!; 
    items.forEach(i=>{ 
      const li=document.createElement('li'); 
      li.textContent = `${i.qty}× ${i.name} — ${i.price} kr`; 
      ul.appendChild(li); 
    });
    const total = items.reduce((s,i)=> s+i.qty*i.price,0);
    return { 
      start(){}, 
      pause(){}, 
      resume(){}, 
      destroy(){ el.innerHTML=''; }, 
      async submit(){ return { ok:true, scoreDelta: Math.max(0, 100 - Math.max(0, total-5000)/50), data:{ total, items } }; }, 
      on(){}, 
      getState(){ return { total, items } } 
    };
  }
};
export default game;