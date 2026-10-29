export const TEAM_SLOT_COUNT=4;
export const sameTeam=(a,b)=>Array.isArray(a)&&Array.isArray(b)&&a.length===b.length&&a.every((id,i)=>id===b[i]);
const teamShape=t=>Array.isArray(t)&&t.length===5&&new Set(t).size===5&&t.every(id=>typeof id==='string');
export function normalizeTeams(p,collection,roster=[]){
 const allowed=id=>!!collection[id]||p.openRoster===true&&roster.some(c=>c.id===id);
 const valid=t=>teamShape(t)&&t.every(allowed),current=valid(p.team)?[...p.team]:Object.keys(collection).slice(0,5);
 let teamSlots,activeTeamSlot;
 if(p.teamsVersion===1){teamSlots=Array.from({length:TEAM_SLOT_COUNT},(_,i)=>valid(p.teamSlots?.[i])?[...p.teamSlots[i]]:null);activeTeamSlot=Number.isInteger(p.activeTeamSlot)&&p.activeTeamSlot>=0&&p.activeTeamSlot<TEAM_SLOT_COUNT?p.activeTeamSlot:0;teamSlots[activeTeamSlot]=[...current];}
 else{teamSlots=[[...current]];for(const t of (Array.isArray(p.teamSlots)?p.teamSlots:[]).slice(0,3))if(valid(t)&&!teamSlots.some(old=>sameTeam(old,t)))teamSlots.push([...t]);while(teamSlots.length<TEAM_SLOT_COUNT)teamSlots.push(null);activeTeamSlot=0;}
 return {teamsVersion:1,activeTeamSlot,teamSlots};
}
export function validTeams(p){return p.teamsVersion===1&&Number.isInteger(p.activeTeamSlot)&&p.activeTeamSlot>=0&&p.activeTeamSlot<TEAM_SLOT_COUNT&&Array.isArray(p.teamSlots)&&p.teamSlots.length===TEAM_SLOT_COUNT&&p.teamSlots.every(t=>t===null||teamShape(t)&&t.every(id=>p.openRoster||p.collection[id]))&&sameTeam(p.team,p.teamSlots[p.activeTeamSlot]);}
export function saveTeam(p,slot,team,roster=[]){
 if(!Number.isInteger(slot)||slot<0||slot>=TEAM_SLOT_COUNT)return {profile:p,error:'Unknown team slot.'};
 if(!teamShape(team)||team.some(id=>!p.collection[id]&&!(p.openRoster&&roster.some(c=>c.id===id))))return {profile:p,error:'Choose five distinct available champions.'};
 const teamSlots=p.teamSlots.map(t=>t?[...t]:null);teamSlots[slot]=[...team];return {profile:{...p,teamSlots,...(slot===p.activeTeamSlot?{team:[...team]}:{})}};
}
export function activateTeam(p,slot){if(!Number.isInteger(slot)||slot<0||slot>=TEAM_SLOT_COUNT||!teamShape(p.teamSlots[slot])||!p.openRoster&&p.teamSlots[slot].some(id=>!p.collection[id]))return {profile:p,error:'Create this team first.'};return {profile:{...p,activeTeamSlot:slot,team:[...p.teamSlots[slot]]}};}
