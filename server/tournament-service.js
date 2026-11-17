import {validTournamentMonth,tournamentRule,tournamentTeamError} from '../src/tournaments.js';
import {championshipSnapshot,createChampionshipBattle,replayChampionship} from '../src/championship-battle.js';
const fail=(status,message)=>{const e=Error(message);e.status=status;throw e;};
export async function runTournamentRequest({action,input,user,upstream,configured,roster,randomUUID,randomInt}){
 if(!configured)fail(503,'Tournaments are being prepared.');if(action!=='tournament-dashboard'&&input.userId!==user.id)fail(409,'The signed-in account changed. Reload before continuing.');
 const query=async path=>{const r=await upstream(path,{admin:true});if(!r.ok)fail(503,'Tournaments are being prepared.');return r.data;};
 const rpc=async(name,body)=>{const r=await upstream('/rest/v1/rpc/'+name,{admin:true,method:'POST',body});if(!r.ok)fail(r.data?.code==='P0001'?409:503,r.data?.code==='P0001'?r.data.message:'Tournaments are being prepared.');return r.data;};
 const profile=async()=>{const rows=await query(`/rest/v1/player_saves?user_id=eq.${user.id}&select=profile,revision`);if(!rows[0])fail(409,'Save your progress before entering.');return rows[0].profile;};
 if(action==='tournament-dashboard'){if(input.month!==undefined&&!validTournamentMonth(input.month))fail(400,'Unknown tournament month.');return rpc('tournament_dashboard',{player:user.id,requested_month:input.month||null});}
 if(!validTournamentMonth(input.month))fail(400,'Unknown tournament month.');
 if(action==='tournament-signup'){
  const context=await rpc('tournament_context',{m:input.month});if(context.phase!=='signup')fail(409,'Tournament signups are closed.');const p=await profile(),ids=p.teamSlots?.[input.slot];if(!Number.isInteger(input.slot)||!ids)fail(400,'Choose a team from Teams.');const error=tournamentTeamError(ids,p,roster,input.month);if(error)fail(400,error);
  return rpc('tournament_signup',{m:input.month,player:user.id,player_name:p.name,defense:ids,snapshot:championshipSnapshot(p,ids,roster)});
 }
 if(action==='tournament-start'){
  if(!/^[0-9a-f-]{36}$/i.test(input.opponent||'')||input.opponent===user.id)fail(400,'Choose another player’s defense.');const context=await rpc('tournament_context',{m:input.month});if(context.phase!=='active')fail(409,'This tournament is not open for battles.');const p=await profile(),error=tournamentTeamError(p.team,p,roster,input.month);if(error)fail(400,error);
  const rows=await query(`/rest/v1/tournament_teams?month=eq.${input.month}&user_id=in.(${user.id},${input.opponent})&select=*`),own=rows.find(r=>r.user_id===user.id),rival=rows.find(r=>r.user_id===input.opponent);if(!own)fail(409,'You did not sign up for this tournament.');if(!rival)fail(409,'This opponent is unavailable.');
  const id=randomUUID(),state=createChampionshipBattle(roster,championshipSnapshot(p,p.team,roster),rival.defense_snapshot,randomInt(1,0x100000000),id);state.tournament={month:input.month,rule:tournamentRule(input.month).id};
  return rpc('tournament_start',{m:input.month,player:user.id,rival:input.opponent,battle_id:id,state,defense_updated:rival.updated_at});
 }
 if(action==='tournament-finish'){
  if(!/^[0-9a-f-]{36}$/i.test(input.id||''))fail(400,'Unknown battle.');const rows=await query(`/rest/v1/tournament_matches?id=eq.${input.id}&month=eq.${input.month}&attacker_id=eq.${user.id}&select=initial_state,status,outcome`),match=rows[0];if(!match)fail(404,'This battle does not belong to your account.');let won=false;
  if(match.status==='open'&&input.surrender!==true){let result;try{result=replayChampionship(match.initial_state,input.actions);}catch{fail(400,'This battle replay could not be verified.');}if(!['victory','defeat'].includes(result.phase))fail(400,'Finish the battle before submitting its result.');won=result.phase==='victory';}
  return rpc('tournament_complete',{player:user.id,battle_id:input.id,won,surrender:input.surrender===true});
 }
 if(action==='tournament-claim'){if(!Number.isSafeInteger(input.revision)||input.revision<0)fail(400,'Invalid tournament reward.');return rpc('tournament_claim',{player:user.id,reward_month:input.month,expected_revision:input.revision});}
 fail(404,'Unknown tournament action.');
}
