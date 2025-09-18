export type GameEvent =
  | { type:'game:start'; id:string; seed:string; t0:number }
  | { type:'game:telemetry'; id:string; t:number; payload:any }
  | { type:'game:checkpoint'; id:string; t:number; payload?:any }
  | { type:'game:complete'; id:string; score:number; t:number; data?:any };

const BUS = new EventTarget();

export function onGameEvent(cb:(e:GameEvent)=>void) { 
  BUS.addEventListener('nelie:game',(ev)=>cb((ev as CustomEvent).detail)); 
}

export function emitGameEvent(evt: GameEvent) { 
  BUS.dispatchEvent(new CustomEvent('nelie:game',{detail:evt})); 
}

export function postToServer(evt: GameEvent) { 
  /* TODO: fetch('/api/game-telemetry',{method:'POST',body:JSON.stringify(evt)}); */ 
}