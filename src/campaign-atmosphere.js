// Deterministic decorative particles; no timers, battle state or input handlers.
export function campaignAtmosphere(difficulty){
 const count=difficulty==='hard'?18:12;
 const particles=Array.from({length:count},(_,i)=>`<i class="map-mote" style="--x:${(i*37+11)%100};--y:${(i*29+7)%100};--delay:${-(i*1.7)}s;--duration:${14+i%7*1.7}s;--size:${i%3+1}px"></i>`).join('');
 const embers=difficulty==='hard'?Array.from({length:6},(_,i)=>`<i class="map-ember" style="--x:${(i*19+14)%100};--y:${35+i*10};--delay:${-i*2.3}s;--duration:${12+i*1.5}s"></i>`).join(''):'';
 return `<div class="campaign-atmosphere atmosphere-${difficulty}" aria-hidden="true">${particles}${embers}</div>`;
}
