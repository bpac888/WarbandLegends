import {championshipSnapshot,championshipTeamError,createChampionshipBattle,replayChampionship} from '../src/championship-battle.js';
const fail=(status,message)=>{const error=Error(message);error.status=status;throw error;};
export async function runChampionshipRequest({action,input,user,upstream,configured,roster,randomUUID,randomInt}){
 if(!configured)fail(503,'Ranked Championships are not connected yet. You can explore the practice grounds.');
 if(action!=='championship-dashboard'&&input.userId!==user.id)fail(409,'The signed-in account changed. Reload before continuing.');
 const query=async path=>{const r=await upstream(path,{admin:true});if(!r.ok)fail(503,'The Championships are not ready yet. Please check the database setup.');return r.data;};
 const rpc=async(name,body)=>{const r=await upstream('/rest/v1/rpc/'+name,{admin:true,method:'POST',body});if(!r.ok)fail(r.data?.code==='P0001'?409:503,r.data?.code==='P0001'?r.data.message:'The Championships are not ready yet. Please check the database setup.');return r.data;};
 const getProfile=async()=>{const rows=await query(`/rest/v1/player_saves?user_id=eq.${user.id}&select=profile,revision`);if(!rows[0])fail(409,'Save your game progress before entering.');return rows[0];};
 if(action==='championship-dashboard')return rpc('championship_dashboard',{player:user.id});
 if(action==='championship-team'){
  const {profile}=await getProfile(),kind=input.kind;if(!['attack','defense'].includes(kind))fail(400,'Choose an attack or defense team.');
  const error=championshipTeamError(input.ids,profile,roster);if(error)fail(400,error);
  const rows=await query(`/rest/v1/championship_teams?user_id=eq.${user.id}&select=*`),old=rows[0];
  const attack=kind==='attack'?input.ids:old?.attack_ids||profile.team,defense=kind==='defense'?input.ids:old?.defense_ids||profile.team;
  // An attack edit never silently republishes a changed defense snapshot.
  const snapshot=kind==='defense'||!old?championshipSnapshot(profile,defense,roster):old.defense_snapshot;
  return rpc('championship_publish',{player:user.id,player_name:profile.name,attack,defense,snapshot});
 }
 if(action==='championship-start'){
  if(!/^[0-9a-f-]{36}$/i.test(input.opponent||'')||input.opponent===user.id)fail(400,'Choose another player’s defense.');
  const {profile}=await getProfile(),rows=await query(`/rest/v1/championship_teams?user_id=in.(${user.id},${input.opponent})&select=*`),own=rows.find(t=>t.user_id===user.id),rival=rows.find(t=>t.user_id===input.opponent);
  if(!own||!rival)fail(409,'Save your attack and defense teams, then refresh the field.');
  const error=championshipTeamError(own.attack_ids,profile,roster);if(error)fail(409,error);
  const attack=championshipSnapshot(profile,own.attack_ids,roster),id=randomUUID(),state=createChampionshipBattle(roster,attack,rival.defense_snapshot,randomInt(1,0x100000000),id);
  return rpc('championship_start',{player:user.id,rival:input.opponent,battle_id:id,state,defense_updated:rival.updated_at});
 }
 if(action==='championship-finish'){
  if(!/^[0-9a-f-]{36}$/i.test(input.id||''))fail(400,'Unknown battle.');
  const matches=await query(`/rest/v1/championship_matches?id=eq.${input.id}&attacker_id=eq.${user.id}&select=initial_state,status,outcome`),match=matches[0];if(!match)fail(404,'This battle does not belong to your account.');
  let won=false;
  if(match.status==='open'&&input.surrender!==true){
   let result;try{result=replayChampionship(match.initial_state,input.actions);}catch{fail(400,'This battle replay could not be verified.');}
   if(!['victory','defeat'].includes(result.phase))fail(400,'Finish the battle before submitting its result.');won=result.phase==='victory';
  }
  return rpc('championship_complete',{player:user.id,battle_id:input.id,won,surrender:input.surrender===true});
 }
 if(action==='championship-claim'){
  if(!/^\d{4}-\d{2}-\d{2}$/.test(input.week||'')||!Number.isSafeInteger(input.revision)||input.revision<0)fail(400,'Invalid weekly reward.');
  return rpc('championship_claim',{player:user.id,reward_week:input.week,expected_revision:input.revision});
 }
 fail(404,'Unknown Championships action.');
}
