import {validateSave,STAGES} from './engine.js';
export const PROFILE_KEY='legends.runes.profile.v1', BATTLE_KEY='legends.runes.battle.v1';
export const STARTER_TEAM=['dragonmage','shieldmaiden_runa','steel_oracle','dune_queen_zaya','shade_prince'];
export function defaultProfile(){return {team:[...STARTER_TEAM],unlocked:0,wins:0,cleared:[],recorded:[],speed:1,helpSeen:false};}
export function loadProfile(storage,roster){
  const defaults=defaultProfile(),ids=new Set(roster.map(c=>c.id));
  try{const p=JSON.parse(storage.getItem(PROFILE_KEY));if(!p||typeof p!=='object')return defaults;
    return {...defaults,team:Array.isArray(p.team)&&p.team.length===5&&new Set(p.team).size===5&&p.team.every(id=>ids.has(id))?p.team:defaults.team,unlocked:Math.max(0,Math.min(STAGES.length-1,Number.isInteger(p.unlocked)?p.unlocked:0)),wins:Number.isInteger(p.wins)&&p.wins>=0?p.wins:0,cleared:Array.isArray(p.cleared)?p.cleared.filter(id=>STAGES.some(s=>s.id===id)):[],recorded:Array.isArray(p.recorded)?p.recorded.filter(id=>typeof id==='string').slice(-200):[],speed:p.speed===2?2:1,helpSeen:p.helpSeen===true};
  }catch{return defaults;}
}
export function loadBattle(storage,roster){try{const state=JSON.parse(storage.getItem(BATTLE_KEY));if(!validateSave(state,roster))return null;const byId=new Map(roster.map(c=>[c.id,c]));for(const u of [...state.heroes,...state.enemies]){const source=byId.get(u.id);u.name=source.name;u.portrait=source.portrait;u.kit=source.kit;u.passive=source.passive;u.ability_name=source.ability_name;}return state;}catch{return null;}}
export function save(storage,key,value){try{storage.setItem(key,JSON.stringify(value));return true;}catch{return false;}}
export function recordVictory(profile,battle){
  if(battle.phase!=='victory'||profile.recorded.includes(battle.id))return profile;
  const index=STAGES.findIndex(s=>s.id===battle.stageId);
  return {...profile,wins:profile.wins+1,unlocked:Math.max(profile.unlocked,Math.min(STAGES.length-1,index+1)),cleared:[...new Set([...profile.cleared,battle.stageId])],recorded:[...profile.recorded,battle.id].slice(-200)};
}
