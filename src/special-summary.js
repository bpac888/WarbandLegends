import {EFFECTS} from './effects.js?v=0.49.3';
const join=parts=>parts.length<2?parts[0]||'':parts.slice(0,-1).join(', ')+' and '+parts.at(-1);
const scope=(id,spec)=>({self:'the caster',ally:'one ally',allies:'all allies',other_allies:'other allies',enemies:'all enemies',enemy:spec.target==='enemy'?'one enemy':'the lowest-HP enemy'}[id]||'the target');
const capitalize=s=>s?s[0].toUpperCase()+s.slice(1):s;
function utility(e,spec){const target=scope(e.scope,spec);switch(e.id){
 case 'remove_debuffs':return `removes ailments from ${target}`;
 case 'dispel':return `removes buffs from ${target}`;
 case 'shield':return `grants a Barrier to ${target}`;
 case 'inc_atk':return `raises Attack for ${target}`;
 case 'inc_def':return `raises Defense for ${target}`;
 case 'dec_atk':return `lowers Attack for ${target}`;
 case 'dec_def':return `lowers Defense for ${target}`;
 case 'block_debuffs':return `protects ${target} from new ailments`;
 case 'block_buffs':return `prevents new buffs on ${target}`;
 case 'mana_raise':return `gives instant mana to ${target}`;
 case 'mana_surge':return `increases mana generation for ${target}`;
 case 'mana_slow':return `slows mana generation for ${target}`;
 case 'mana_block':return `blocks mana gain for ${target}`;
 case 'heal':return `grants ongoing healing to ${target}`;
 case 'strengthen':return `reduces direct damage taken by ${target}`;
 case 'weaken':return `increases direct damage taken by ${target}`;
 case 'tile_boost':return `boosts rune damage for ${target}`;
 default:return `applies ${EFFECTS[e.id]?.name||e.id.replaceAll('_',' ')} to ${target}`;
}}
// A short orientation, not a replacement for the full resolution order below it.
// Use the selected charge's data; no character-specific copies that can drift from combat.
export function specialSummary(spec){
 const main=[];
 if(spec.damage)main.push(`strikes ${spec.aoe?'all enemies':scope('enemy',spec)}${spec.pierce?', ignoring part of their Defense':''}`);
 if(spec.healing)main.push(`restores health to ${scope(spec.healScope,spec)}`);
 const effects=(spec.effects||[]).filter(e=>!['aoe','ignore_def'].includes(e.id));
 const rank=e=>['remove_debuffs','dispel'].includes(e.id)?3:e.scope==='allies'||e.scope==='enemies'||e.scope==='other_allies'?2:1;
 const highlights=effects.map((e,index)=>({e,index})).sort((a,b)=>rank(b.e)-rank(a.e)||a.index-b.index).slice(0,2).map(({e})=>utility(e,spec));
 return [main.length?capitalize(join(main))+'.':'',highlights.length?capitalize(join(highlights))+'.':''].filter(Boolean).join(' ')||'Empowers the caster.';
}
