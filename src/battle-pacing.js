// Presentation timings only; combat outcomes and Auto decisions stay in the engine.
export function battleTiming(kind,{speed=1,reduced=false,special=false}={}){
 const rate=speed===2?2:1;
 // Specials retain a readable beat even at double speed.
 const fxRate=special&&rate===2?1.65:rate;
 const base={swap:220,match:900,fall:380,enemy:950,upkeep:500,skill:1900,mechanic:1700,passive:1350,shuffle:700,settled:70,result:650}[kind]||350;
 return {rate:fxRate,duration:reduced?(special?650:50):(special?Math.max(base,1900):base)/fxRate,impact:reduced?0:(kind==='match'?560:special?780:160)/fxRate};
}
