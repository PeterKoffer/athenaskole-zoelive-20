import type { AdventureGame, GameHandle, GameStartOptions } from './sdk';
const game: AdventureGame = {
  id: 'phrase-builder', title: 'Phrase Builder', subject: 'Language Lab',
  async mount(el: HTMLElement, opts: GameStartOptions): Promise<GameHandle> {
    let score = 0; el.innerHTML = `<div class="text-sm">Saml en høflig sætning til en turist (ES/IT).</div>
    <div class="flex gap-2 mt-2">
      <button class="bg-gray-800 text-white px-2 py-1" data-ok>¡Bienvenidos! ¿Tiene alergias?</button>
      <button class="bg-gray-800 text-white px-2 py-1">Hola! Menu?</button>
    </div>`;
    el.querySelector('[data-ok]')!.addEventListener('click',()=> score=100);
    return { start(){}, pause(){}, resume(){}, destroy(){ el.innerHTML=''; }, async submit(){ return { ok:true, scoreDelta: score }; }, on(){}, getState(){ return { score } } };
  }
};
export default game;