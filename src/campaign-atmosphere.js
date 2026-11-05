// Deterministic decorative particles; no timers, battle state or input handlers.
export function campaignAtmosphere(difficulty){
 const count=difficulty==='hard'?90:72;
 const particles=Array.from({length:count},(_,i)=>`<i class="map-mote" style="--x:${(i*37+11)%100};--y:${(i*29+7)%100};--delay:${-(i*1.7)}s;--duration:${7+i%7*.8}s;--size:${i%4+3}px"></i>`).join('');
 const embers=difficulty==='hard'?Array.from({length:18},(_,i)=>`<i class="map-ember" style="--x:${(i*19+14)%100};--y:${(i*17+9)%100};--delay:${-i*2.3}s;--duration:${7+i%6*.9}s"></i>`).join(''):'';
 const leaves=difficulty==='normal'?Array.from({length:14},(_,i)=>`<i class="map-leaf" style="--x:${(i*23+9)%100};--y:${(i*31+5)%100};--delay:${-i*1.3}s;--duration:${9+i%5}s"></i>`).join(''):'';
 return `<div class="campaign-atmosphere atmosphere-${difficulty}" aria-hidden="true">${particles}${embers}${leaves}</div>`;
}
