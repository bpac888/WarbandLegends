import {weeklyWindow} from './weekly.js?v=0.53.0';
import {CHAMPIONSHIP_TIERS,CHAMPIONSHIP_REWARDS,championshipReward} from './championship-catalog.js?v=0.53.0';
import {heroForId} from './hero-copies.js?v=0.53.0';
export {CHAMPIONSHIP_TIERS,CHAMPIONSHIP_REWARDS,championshipReward};
export const championshipWeek=now=>weeklyWindow(now);
export const championshipEsc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const PRACTICE_RIVALS=[{id:'practice-vanguard',name:'The Marble Vanguard',description:'A balanced practice defense',ids:['redknife_tavin','shieldmaiden_runa','grove_druid','ironwall_sniper','cursed_acolyte']},{id:'practice-wildgrove',name:'Thornwild Wardens',description:'Healing and enduring protection',ids:['barkskin_bruiser','grove_druid','thornveil_dryad','rimebow_tessa','rivet_mender_orsa']},{id:'practice-nightcourt',name:'The Crimson Standard',description:'Pressure, shadows and poison',ids:['blood_paladin','demon_witchblade','shade_prince','pale_matriarch','ghoul_scavenger']}];
export function previewChampionships(storage,profile,roster){
 let raw;try{raw=JSON.parse(storage.getItem('warband.championships.preview'));}catch{}
 const valid=ids=>Array.isArray(ids)&&ids.length===5&&new Set(ids).size===5&&ids.every(id=>heroForId(roster,id));
 return {preview:true,week:championshipWeek().key,closesAt:championshipWeek().reset.toISOString(),teams:{attack_ids:valid(raw?.attack_ids)?raw.attack_ids:[...profile.team],defense_ids:valid(raw?.defense_ids)?raw.defense_ids:[...profile.team]},standing:{score:0,tier:0,attack_wins:0,attack_losses:0,defense_wins:0,defense_losses:0,strikes:0},rankings:[],opponents:[],awards:[],history:[]};
}
