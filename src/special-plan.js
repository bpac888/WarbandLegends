import {BUFFS,DEBUFFS,EFFECTS,effectName} from './effects.js';

// The resolver and ability views consume the same order. Never sort only the UI.
export function specialPlan(spec){
 const effects=spec.effects||[];
 return [
  ...effects.filter(e=>e.id==='remove_debuffs').map(effect=>({kind:'cleanse',effect})),
  ...effects.filter(e=>e.id==='dispel').map(effect=>({kind:'dispel',effect})),
  ...effects.filter(e=>BUFFS.has(e.id)).map(effect=>({kind:'buff',effect})),
  ...(spec.healing?[{kind:'heal',scope:spec.healScope,amount:spec.healing}]:[]),
  ...effects.filter(e=>e.id==='mana_raise').map(effect=>({kind:'mana',effect})),
  ...effects.filter(e=>DEBUFFS.has(e.id)).map(effect=>({kind:'debuff',effect})),
  ...(spec.damage?[{kind:'damage',amount:spec.damage,aoe:spec.aoe,pierce:spec.pierce}]:[]),
 ];
}
const scopes={self:'Caster',ally:'Selected ally',allies:'All living allies',other_allies:'Other living allies',enemies:'All living enemies'};
export function enemyTargetLabel(spec){return spec.target==='enemy'?'Selected enemy':'Lowest-HP living enemy';}
export function scopeLabel(scope,spec){return scope==='enemy'?enemyTargetLabel(spec):scopes[scope]||scope;}
export function describeSpecial(spec,extras={}){
 return specialPlan(spec).map((step,index)=>{
  if(step.kind==='heal')return {kind:step.kind,order:index+1,name:'Restore health',scope:scopeLabel(step.scope,spec),description:`Restore ${Math.round(step.amount*100)}% of each recipient’s max HP, up to their normal maximum.`,duration:0};
  if(step.kind==='damage')return {kind:step.kind,order:index+1,name:'Direct damage',scope:spec.aoe?'All living enemies':enemyTargetLabel(spec),description:`Deal ${Math.round(step.amount*100)}% ATK damage${step.pierce?', ignoring 25% of effective DEF':''}. Element, defense and active effects modify the final damage.`,duration:0};
  const e=step.effect,rule=EFFECTS[e.id]||extras[e.id]||{};
  return {kind:step.kind,order:index+1,id:e.id,name:effectName(e.id),scope:scopeLabel(e.scope,spec),description:rule.desc||'',duration:e.turns,timed:!!rule.timed,periodic:['heal','poison','burn','frostbite','bleed'].includes(e.id)};
 });
}
export function specialTargeting(spec){
 const targets=spec.target==='self'?'Casts immediately on the caster.':spec.target==='ally'?'Choose a living ally.':'Choose a living enemy.';
 const automatic=(spec.damage&&!spec.aoe&&spec.target!=='enemy')||spec.effects.some(e=>e.scope==='enemy'&&spec.target!=='enemy');
 const single=(!spec.aoe&&spec.damage)||spec.effects.some(e=>e.scope==='enemy');
 return targets+(spec.aoe?' Area damage hits every living enemy.':'')+(automatic?' The lowest current-HP living enemy is chosen automatically for enemy-targeted actions.':'')+(single?' Taunt can redirect the single enemy target; rune lanes stay unchanged.':'');
}
