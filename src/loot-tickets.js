import {getEncounter,entryError} from './encounters.js?v=0.45.2';
import {energyCost,energyStatus,spendEnergy} from './keeper.js?v=0.45.2';
import {victoryRewards,awardVictory} from './progression.js?v=0.45.2';
import {heroForId} from './hero-copies.js?v=0.45.2';
export function lootTicketQuote(profile,stageId,roster,now=new Date()){
 const stage=getEncounter(stageId),uses=profile.lootTicketUses??0,tickets=profile.lootTickets??0,cost=energyCost(stage);
 const error=stage?.mode!=='campaign'?'Loot Tickets can only clear campaign stages.':profile.openRoster?'Leave playtesting to use Loot Tickets.':!profile.cleared.includes(stageId)?'Clear this stage on this difficulty before using a Loot Ticket.':entryError(profile,stageId,now)||(!Number.isSafeInteger(tickets)||tickets<1?'You need a Loot Ticket.':!Number.isSafeInteger(uses)||uses<0||uses>=999999999?'Loot Ticket use limit reached.':energyStatus(profile,now).current<cost?`Need ${cost} Energy for this stage.`:profile.team.length!==5||new Set(profile.team).size!==5||profile.team.some(id=>!profile.collection[id]||!heroForId(roster,id))?'Choose five collected champions for the replay rewards.':null);
 return {stage,cost,tickets,uses,error,reward:stage?.mode==='campaign'?victoryRewards(profile,{stageId,phase:'victory',sandbox:false}):null};
}
export function useLootTicket(profile,stageId,roster,{expectedUses,activeBattle=false,now=new Date()}={}){
 if(activeBattle)return {profile,error:'Finish or leave the current battle before using a Loot Ticket.'};
 const q=lootTicketQuote(profile,stageId,roster,now);if(q.error)return {profile,error:q.error};
 if(expectedUses!==q.uses)return {profile,error:'This Loot Ticket confirmation has expired. Review the stage again.'};
 const id=`loot:${q.uses+1}:${stageId}`;if(profile.recorded.includes(id))return {profile,error:'This instant clear has already been rewarded.'};
 const paid=spendEnergy(profile,q.stage,now);if(paid.error)return {profile,error:paid.error};
 const receipt={id,stageId,phase:'victory',sandbox:false,progression:true,heroes:profile.team.map(id=>({id}))};
 const next=awardVictory(paid.profile,receipt,roster);if(next===paid.profile)return {profile,error:'The stage could not be cleared. No ticket or Energy was spent.'};
 const result={...next,lootTickets:q.tickets-1,lootTicketUses:q.uses+1};
 const reward={...q.reward,gold:result.gold-profile.gold,gems:result.gems-profile.gems,accountXp:result.accountXp-profile.accountXp,materials:Object.fromEntries(Object.keys(q.reward.materials).map(id=>[id,(result.materials[id]||0)-(profile.materials[id]||0)]))};
 return {profile:result,stage:q.stage,cost:q.cost,reward};
}
