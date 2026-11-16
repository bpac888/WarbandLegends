import {createBattle} from './engine.js?v=0.53.3';
import {heroForId} from './hero-copies.js?v=0.53.3';
import {heroDevelopment} from './development.js?v=0.53.3';
import {applyAutoAction} from './auto-battle.js?v=0.53.3';
import {CHAMPIONSHIP_STAGE,CHAMPIONSHIP_RULES} from './championship-catalog.js?v=0.53.3';
export function championshipTeamError(ids,profile,roster){
 if(!Array.isArray(ids)||ids.length!==5||new Set(ids).size!==5)return 'Choose five different champions.';
 if(ids.some(id=>typeof id!=='string'||!profile.collection?.[id]||!heroForId(roster,id)))return 'Choose champions from your collection.';
 if(profile.openRoster)return 'Turn off playtesting to enter The Championships.';
 return null;
}
export function championshipSnapshot(profile,ids,roster,{loan=false}={}){
 const error=loan?(ids.length!==5||new Set(ids).size!==5?'Choose five different champions.':null):championshipTeamError(ids,profile,roster);if(error)throw Error(error);
 return {ids:[...ids],levels:Object.fromEntries(ids.map(id=>[id,loan?40:heroDevelopment(profile,heroForId(roster,id)).level])),ascensions:loan?{}:Object.fromEntries(ids.map(id=>[id,profile.ascensions?.[id]||0])),awakenings:loan?{}:Object.fromEntries(ids.map(id=>[id,profile.awakenings?.[id]||0]))};
}
export function createChampionshipBattle(roster,attack,defense,seed,id,{practice=false}={}){
 const copies=[...new Set([...attack.ids,...defense.ids])].map(id=>heroForId(roster,id));if(copies.some(c=>!c))throw Error('Unknown champion in this defense.');
 const fullRoster=[...roster,...copies.filter(c=>!roster.some(r=>r.id===c.id))];
 const state=createBattle(fullRoster,attack.ids,CHAMPIONSHIP_STAGE.id,seed,{...attack,progression:true,defense,matchId:id,practice});
 state.id=id;return state;
}
export function replayChampionship(initial,actions){
 if(!Array.isArray(actions)||actions.length>CHAMPIONSHIP_RULES.maxActions)throw Error('Invalid battle replay.');
 let state=structuredClone(initial);
 for(const action of actions){
  if(!action||!['swap','cast','activate'].includes(action.kind)||state.phase!=='playing')throw Error('Invalid battle replay.');
  if(action.kind==='cast'&&(!state.heroes.some(h=>h.uid===action.actor)||typeof action.target!=='string'||!Number.isInteger(action.level)))throw Error('Invalid Special in replay.');
  const result=applyAutoAction(state,action,{frames:false});if(result.error)throw Error(result.error);state=result.state;
 }
 return state;
}
