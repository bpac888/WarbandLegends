import {defaultProfile,normalizeProfile,awardVictory} from './progression.js';
export {defaultProfile,STARTER_TEAM} from './progression.js';
import {validateSave,STAGES,createBattle} from './engine.js';
import {encounterAppearance} from './encounters.js';
export const PROFILE_KEY='legends.runes.profile.v2', BATTLE_KEY='legends.runes.battle.v4';
export const PREVIOUS_BATTLE_KEY='legends.runes.battle.v2';
export const LEGACY_BATTLE_KEY='legends.runes.battle.v1';
export function loadProfile(storage,roster){try{return normalizeProfile(JSON.parse(storage.getItem(PROFILE_KEY)),roster);}catch{return defaultProfile();}}
export function loadBattle(storage,roster,{currentOnly=false}={}){try{
  const raw=storage.getItem(BATTLE_KEY);
  if(raw){const state=JSON.parse(raw);if(!validateSave(state,roster))return null;const byId=new Map(roster.map(c=>[c.id,c]));for(const u of [...state.heroes,...state.enemies]){const source=byId.get(u.id);for(const key of ['name','portrait','special','passive','ability_name','color','role','rarity','manaSpeed'])u[key]=structuredClone(source[key]);}return encounterAppearance(state);}
  if(currentOnly)return null;
  const previous=JSON.parse(storage.getItem(PREVIOUS_BATTLE_KEY));
  if(previous?.version===2){
    const updated=structuredClone(previous);updated.version=3;const byId=new Map(roster.map(c=>[c.id,c]));
    const units=[...updated.heroes,...updated.enemies],guards=[];
    for(const u of units){const source=byId.get(u.id);if(!source)return null;for(const key of ['special','passive','name','portrait','ability_name','manaSpeed','color','role','rarity'])u[key]=structuredClone(source[key]);if(u.effects.taunt){guards.push(u.effects.taunt);delete u.effects.taunt;}}
    for(const e of guards){const source=units.find(u=>u.uid===e.source);if(source?.hp>0&&(!source.effects.guard||source.effects.guard.turns<e.turns))source.effects.guard=structuredClone(e);}
    if(!validateSave(updated,roster))return null;updated.updatedStatusRules=true;return updated;
  }
  const old=JSON.parse(storage.getItem(LEGACY_BATTLE_KEY));
  if(!old||old.version!==1||!STAGES.some(s=>s.id===old.stageId)||!Array.isArray(old.heroes)||old.heroes.length!==5||!['playing','victory','defeat'].includes(old.phase)||typeof old.id!=='string')return null;
  const state=createBattle(roster,old.heroes.map(h=>h.id),old.stageId,Number.isInteger(old.rng)?old.rng:1);
  if(old.phase==='playing'){state.id+='-rules2';state.restartedForRules=true;}
  else{state.id=old.id;state.phase=old.phase;for(const u of old.phase==='victory'?state.enemies:state.heroes){u.hp=0;u.mana=0;}}
  return state;
}catch{return null;}}
export function save(storage,key,value){try{storage.setItem(key,JSON.stringify(value));return true;}catch{return false;}}
export function recordVictory(profile,battle,roster){return awardVictory(profile,battle,roster);}
