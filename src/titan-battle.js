import {createBattle} from './engine.js?v=0.53.6';
import {championshipSnapshot,replayChampionship} from './championship-battle.js?v=0.53.6';
import {heroForId} from './hero-copies.js?v=0.53.6';
import {TITANS,TITAN_STAGES} from './titan-catalog.js?v=0.53.6';
export function createTitanBattle(roster,profile,event,seed,id){
 if(!Number.isInteger(event.titan_index)||!TITANS[event.titan_index]||!Number.isSafeInteger(event.hp)||event.hp<=0||event.hp>event.max_hp)throw Error('This Titan is not available.');
 const snap=championshipSnapshot(profile,profile.team,roster),copies=profile.team.filter(id=>!roster.some(c=>c.id===id)).map(id=>heroForId(roster,id)),state=createBattle([...roster,...copies],profile.team,TITAN_STAGES[event.titan_index].id,seed,{...snap,progression:true,matchId:id,titanMonth:event.month,titanHp:event.hp,titanMaxHp:event.max_hp});state.id=id;return state;
}
export function verifyTitanDamage(initial,actions,{retreat=false}={}){
 if(!initial.titan||initial.enemies.length!==1)throw Error('Unknown Titan attack.');const result=replayChampionship(initial,actions);if(result.phase==='playing'&&!retreat)throw Error('Finish the attack or retreat before submitting damage.');
 const damage=Math.max(0,Math.min(initial.enemies[0].hp,Math.floor(initial.enemies[0].hp-result.enemies[0].hp)));return {damage,state:result};
}
