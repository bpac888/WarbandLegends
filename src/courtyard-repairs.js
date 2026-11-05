// Small world-space restorations of the two painted joins. Bounds are turns
// around the courtyard and world height; pixels elsewhere keep the original art.
export const COURTYARD_REPAIRS=Object.freeze([
 {id:'castle-altar',art:'./assets/courtyard/castle-altar-repair.webp',bounds:[.035,.145,-.5,16],regions:[
  {bounds:[.065,.122,8.2,15.6],feather:[.003,.25]},
  {bounds:[.074,.120,.05,9.7],feather:[.003,.25]},
 ]},
 {id:'altar-codex',art:'./assets/courtyard/altar-codex-repair.webp',bounds:[.145,.245,-.5,12.5],regions:[
  {bounds:[.181,.205,7.0,11.5],feather:[.0025,.3]},
  {bounds:[.180,.208,.05,7.9],feather:[.0025,.25]},
 ]},
]);
const smooth=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t);};
export function courtyardRepairWeight(u,y,repair){
 if(u<0||u>=1)u=((u%1)+1)%1;
 return Math.max(...repair.regions.map(({bounds:[l,r,b,t],feather:[x,h]})=>smooth((u-l)/x)*smooth((r-u)/x)*smooth((y-b)/h)*smooth((t-y)/h)));
}
