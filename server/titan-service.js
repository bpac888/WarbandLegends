import {createTitanBattle,verifyTitanDamage} from '../src/titan-battle.js';
import {validTitanMonth} from '../src/titan-catalog.js';
const fail=(status,message)=>{const e=Error(message);e.status=status;throw e;};
export async function runTitanRequest({action,input,user,upstream,configured,roster,randomUUID,randomInt}){
 if(!configured)fail(503,'Titan hunts are being prepared.');if(action!=='titan-dashboard'&&input.userId!==user.id)fail(409,'The signed-in account changed. Reload before continuing.');
 const query=async path=>{const r=await upstream(path,{admin:true});if(!r.ok)fail(503,'Titan hunts are being prepared.');return r.data;};const rpc=async(name,body)=>{const r=await upstream('/rest/v1/rpc/'+name,{admin:true,method:'POST',body});if(!r.ok)fail(r.data?.code==='P0001'?409:503,r.data?.code==='P0001'?r.data.message:'Titan hunts are being prepared.');return r.data;};
 if(action==='titan-dashboard')return rpc('titan_dashboard',{player:user.id});
 if(action==='titan-start'){
  const event=await rpc('titan_context',{}),rows=await query(`/rest/v1/player_saves?user_id=eq.${user.id}&select=profile,revision`);if(!rows[0])fail(409,'Save your progress before attacking.');const p=rows[0].profile,id=randomUUID();let state;try{state=createTitanBattle(roster,p,event,randomInt(1,0x100000000),id);}catch(e){fail(400,e.message);}return rpc('titan_start',{player:user.id,player_name:p.name,battle_id:id,m:event.month,state});
 }
 if(action==='titan-finish'){
  if(!/^[0-9a-f-]{36}$/i.test(input.id||''))fail(400,'Unknown Titan attack.');const rows=await query(`/rest/v1/titan_attacks?id=eq.${input.id}&user_id=eq.${user.id}&select=initial_state,status,damage`),attack=rows[0];if(!attack)fail(404,'This attack does not belong to your account.');let damage=0;
  if(attack.status==='open'){try{damage=verifyTitanDamage(attack.initial_state,input.actions,{retreat:input.surrender===true}).damage;}catch(e){fail(400,e.message);}}
  return rpc('titan_complete',{player:user.id,battle_id:input.id,amount:damage});
 }
 if(action==='titan-claim'){if(!validTitanMonth(input.month)||!Number.isSafeInteger(input.revision)||input.revision<0)fail(400,'Invalid Titan reward.');return rpc('titan_claim',{player:user.id,reward_month:input.month,expected_revision:input.revision});}
 fail(404,'Unknown Titan action.');
}
