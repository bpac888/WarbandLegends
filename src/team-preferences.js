import {developedChampion} from './development.js?v=0.42.2';
export const teamName=(p,i)=>p.teamNames?.[i]||'Team '+(i+1);
export function normalizeTeamPreferences(p,collection){
 const list=k=>[...new Set((Array.isArray(p[k])?p[k]:[]).filter(id=>typeof id==='string'&&collection[id]))];
 return {teamNames:Array.from({length:4},(_,i)=>typeof p.teamNames?.[i]==='string'?p.teamNames[i].trim().slice(0,24)||'Team '+(i+1):'Team '+(i+1)),favorites:list('favorites'),lockedHeroes:list('lockedHeroes')};
}
export function toggleHeroPreference(p,id,key){if(!['favorites','lockedHeroes'].includes(key)||!p.collection[id])return p;const old=p[key]||[];return {...p,[key]:old.includes(id)?old.filter(x=>x!==id):[...old,id]};}
export function renameTeam(p,slot,name){if(!Number.isInteger(slot)||slot<0||slot>3||typeof name!=='string')return {profile:p,error:'Unknown team.'};const clean=name.trim().slice(0,24);if(!clean)return {profile:p,error:'Enter a team name.'};const names=Array.from({length:4},(_,i)=>teamName(p,i));names[slot]=clean;return {profile:{...p,teamNames:names}};}
export function teamPower(p,team,roster){return Math.round((team||[]).reduce((sum,id)=>{const c=roster.find(c=>c.id===id)||roster.find(c=>c.id===id.split('~')[0]);if(!c)return sum;const h=developedChampion({...c,id},p);return sum+h.atk+h.def+h.hp/4;},0));}
export const estimateNote='Estimated from developed stats; abilities and team synergy also matter.';
export function validTeamPreferences(p){if(p.teamNames!==undefined&&(!Array.isArray(p.teamNames)||p.teamNames.length!==4||p.teamNames.some(n=>typeof n!=='string'||!n.trim()||n.length>24)))return false;return ['favorites','lockedHeroes'].every(k=>p[k]===undefined||Array.isArray(p[k])&&new Set(p[k]).size===p[k].length&&p[k].every(id=>typeof id==='string'&&p.collection?.[id]));}
