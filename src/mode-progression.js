import {weeklyWindow,weeklyTeamError,weeklyClears} from './weekly.js?v=0.49.3';
import {boostedGold} from './premium-items.js?v=0.49.3';
import {LOOT_TICKET_LIMIT} from './loot-ticket-item.js?v=0.49.3';
import {heroForId,uniqueHeroCount} from './hero-copies.js?v=0.49.3';
import {addAccountXp,accountBattleXp,bumpPath,spendEnergy,energyCost,refreshEnergy,energyStatus} from './keeper.js?v=0.49.3';
import {GEM_LIMIT} from './economy.js?v=0.49.3';
import {SPECIAL_EVENTS,eventWindow,eventAttemptsLeft,EVENT_ATTEMPTS} from './modes.js?v=0.49.3';
import {getEncounter} from './encounters.js?v=0.49.3';
import {addHeroXp} from './development.js?v=0.49.3';
const cap=n=>Math.min(999999999,Math.max(0,n));
const safe=(n,f=0,max=999999999)=>Number.isSafeInteger(n)&&n>=0&&n<=max?n:f;
export function defaultModes(){return {lootTickets:0,lootTicketUses:0,arenaRating:1000,arenaTokens:0,arenaWins:0,arenaLosses:0,eventWins:0,eventAttempts:{},eventTokens:Object.fromEntries(SPECIAL_EVENTS.map(e=>[e.token,0])),eventEntry:null};}
export function validEventKey(key){return typeof key==='string'&&SPECIAL_EVENTS.some(e=>key.startsWith(e.id+':'))&&/^\w+:\d{4}-(0[1-9]|1[0-2])$/.test(key);}
export function normalizeModes(p){const base=defaultModes(),eventAttempts={};for(const [key,n]of Object.entries(p.eventAttempts&&typeof p.eventAttempts==='object'&&!Array.isArray(p.eventAttempts)?p.eventAttempts:{}))if(validEventKey(key)&&Number.isSafeInteger(n)&&n>=0&&n<=EVENT_ATTEMPTS)eventAttempts[key]=n;
 const entry=p.eventEntry&&typeof p.eventEntry==='object'&&!Array.isArray(p.eventEntry)&&typeof p.eventEntry.battleId==='string'&&p.eventEntry.battleId.length<=120&&validEventKey(p.eventEntry.key)&&eventAttempts[p.eventEntry.key]>0?{battleId:p.eventEntry.battleId,key:p.eventEntry.key}:null;
 return {...base,lootTickets:safe(p.lootTickets,0,LOOT_TICKET_LIMIT),lootTicketUses:safe(p.lootTicketUses),...Object.fromEntries(['arenaRating','arenaTokens','arenaWins','arenaLosses','eventWins'].map(k=>[k,safe(p[k],base[k])])),eventAttempts,eventTokens:Object.fromEntries(SPECIAL_EVENTS.map(e=>[e.token,safe(p.eventTokens?.[e.token])])),eventEntry:entry};
}
export function validateModes(p){if(p.lootTickets!==undefined&&(!Number.isSafeInteger(p.lootTickets)||p.lootTickets<0||p.lootTickets>LOOT_TICKET_LIMIT)||p.lootTicketUses!==undefined&&(!Number.isSafeInteger(p.lootTicketUses)||p.lootTicketUses<0||p.lootTicketUses>999999999))return false;
 if(['arenaRating','arenaTokens','arenaWins','arenaLosses','eventWins'].some(k=>!Number.isSafeInteger(p[k])||p[k]<0||p[k]>999999999))return false;
 if(!p.eventAttempts||typeof p.eventAttempts!=='object'||Array.isArray(p.eventAttempts)||Object.entries(p.eventAttempts).some(([key,n])=>!validEventKey(key)||!Number.isSafeInteger(n)||n<0||n>EVENT_ATTEMPTS))return false;
 if(!p.eventTokens||typeof p.eventTokens!=='object'||Array.isArray(p.eventTokens)||SPECIAL_EVENTS.some(e=>!Number.isSafeInteger(p.eventTokens[e.token])||p.eventTokens[e.token]<0||p.eventTokens[e.token]>999999999))return false;
 return p.eventEntry===null||!!(p.eventEntry&&typeof p.eventEntry==='object'&&!Array.isArray(p.eventEntry)&&typeof p.eventEntry.battleId==='string'&&p.eventEntry.battleId.length<=120&&validEventKey(p.eventEntry.key)&&p.eventAttempts[p.eventEntry.key]>0);
}
export function reserveEntry(profile,battle,now=new Date()){
 const e=getEncounter(battle.stageId);if(!e)return {profile,error:'Unknown encounter.'};
 if(e.mode==='weekly'){const w=weeklyWindow(now),error=weeklyTeamError(e,battle.heroes,w.key);if(!w.stages.some(s=>s.challengeId===e.challengeId))return {profile,error:'This challenge has rotated.'};if(error)return {profile,error};const key=w.key+':'+e.weeklyKind;if(battle.weeklyKey!==key)return {profile,error:'This challenge has rotated.'};const clears=weeklyClears(profile,key);if(clears<3&&e.round!==clears+1)return {profile,error:'Complete the previous weekly battle first.'};return {profile:{...profile,weeklyEntry:{battleId:battle.id,key,stageId:e.id}},battle:{...battle,weeklyKey:key,energySpent:0}};}
 if(e.mode!=='event'&&battle.energySpent===energyCost(e))return {profile:{...refreshEnergy(profile,now),eventEntry:null},battle};
 if(e.mode!=='event'||battle.sandbox){const paid=spendEnergy(profile,e,now);return paid.error?paid:{profile:{...paid.profile,eventEntry:null},battle:{...battle,energySpent:paid.cost}};}
 const window=eventWindow(e.eventId,now);if(!window.active)return {profile,error:'This event is outside its monthly window.'};
 // Pay on entry, before any battle playback. Leaving or losing does not refund an attempt.
 if(profile.eventEntry?.battleId===battle.id&&profile.eventEntry.key===window.key)return {profile,battle:{...battle,eventWindow:window.key}};
 if(eventAttemptsLeft(profile,e.eventId,now)<1)return {profile,error:'No attempts remain in this event window.'};
 const next={...profile,eventAttempts:{...profile.eventAttempts,[window.key]:(profile.eventAttempts[window.key]||0)+1},eventEntry:{battleId:battle.id,key:window.key}};
 return {profile:next,battle:{...battle,eventWindow:window.key}};
}
export function modeReward(profile,battle,now=Date.now()){const e=getEncounter(battle.stageId),won=battle.phase==='victory';
 if(!e||battle.sandbox||!['victory','defeat'].includes(battle.phase))return {gold:0,gems:0,xp:0};
 if(e.mode==='arena')return {gold:won?boostedGold(profile,e.rewards.gold,now):0,gems:0,xp:0,accountXp:accountBattleXp(e,won),arenaTokens:won?e.arenaTokens:0,rating:won?18:-12};
 if(e.mode==='event'&&profile.eventEntry?.battleId===battle.id&&profile.eventEntry?.key===battle.eventWindow&&battle.eventWindow?.startsWith(e.eventId+':')){const first=won&&!profile.cleared.includes(e.id);return {gold:won?boostedGold(profile,first?450:150,now):0,gems:won?(first?100:25):0,xp:won?Math.round(e.rewards.xp*(first?1.5:1)):0,accountXp:accountBattleXp(e,won),eventToken:e.eventToken,eventTokens:won?8:0,first};}
 return {gold:0,gems:0,xp:0};
}
export function settleMode(profile,battle,roster,now=Date.now()){if(battle.sandbox||!['victory','defeat'].includes(battle.phase)||profile.recorded.includes(battle.id))return profile;const e=getEncounter(battle.stageId);if(!['arena','event'].includes(e?.mode))return profile;
 const reward=modeReward(profile,battle,now),win=battle.phase==='victory';if(e.mode==='event'&&!reward.eventToken)return profile;
 let next=profile;if(reward.xp&&battle.progression)for(const id of new Set(battle.heroes.map(h=>h.id))){const c=heroForId(roster,id);if(c)next=addHeroXp(next,c,reward.xp,new Date(now));}
 next=bumpPath(addAccountXp(next,accountBattleXp(e,win)),{wins:win?1:0,gems:reward.gems},new Date(now));
 next={...next,gold:cap(profile.gold+reward.gold),gems:Math.min(GEM_LIMIT,profile.gems+reward.gems),recorded:[...profile.recorded,battle.id].slice(-200)};
 if(e.mode==='arena')return {...next,arenaRating:cap(profile.arenaRating+reward.rating),arenaTokens:cap(profile.arenaTokens+reward.arenaTokens),arenaWins:cap(profile.arenaWins+(win?1:0)),arenaLosses:cap(profile.arenaLosses+(win?0:1))};
 return {...next,eventWins:cap(profile.eventWins+(win?1:0)),eventTokens:{...profile.eventTokens,[e.eventToken]:cap(profile.eventTokens[e.eventToken]+reward.eventTokens)},eventEntry:null,cleared:win?[...new Set([...profile.cleared,e.id])]:profile.cleared};
}
export const EXCHANGE_OFFERS=[{id:'arena-energy-refill',name:'Energy Refill',currency:'arenaTokens',label:'Arena Tokens',cost:20,energyRefill:true},...SPECIAL_EVENTS.map(e=>({id:e.id+'-energy-refill',name:'Energy Refill',currency:e.token,label:e.tokenName,cost:12,energyRefill:true})),{id:'arena-loot-tickets',name:'5 Loot Tickets',currency:'arenaTokens',label:'Arena Tokens',cost:10,lootTickets:5},...SPECIAL_EVENTS.map(e=>({id:e.id+'-loot-tickets',name:'5 Loot Tickets',currency:e.token,label:e.tokenName,cost:6,lootTickets:5})),{id:'arena-gems',name:'100 Gems',currency:'arenaTokens',label:'Arena Tokens',cost:20,gems:100},{id:'arena-gold',name:'Gold',currency:'arenaTokens',label:'Arena Tokens',cost:10,gold:500},...SPECIAL_EVENTS.map(e=>({id:e.id+'-gems',name:'100 Gems',currency:e.token,label:e.tokenName,cost:12,gems:100}))];
export function exchange(profile,id,now=new Date()){const offer=EXCHANGE_OFFERS.find(o=>o.id===id);if(!offer)return {profile,error:'Unknown exchange.'};const balance=offer.currency==='arenaTokens'?profile.arenaTokens:profile.eventTokens[offer.currency]||0;
 const energy=offer.energyRefill?energyStatus(profile,now):null;
 if(energy&&energy.current>=energy.max)return {profile,error:'Energy is already full.'};
 if(offer.lootTickets&&(profile.lootTickets??0)+offer.lootTickets>LOOT_TICKET_LIMIT)return {profile,error:'Loot Ticket storage is full.'};
 if(balance<offer.cost)return {profile,error:'Earn more tokens before making this exchange.'};if(offer.gems&&profile.gems+offer.gems>GEM_LIMIT||offer.gold&&profile.gold+offer.gold>999999999)return {profile,error:'That resource is already at its storage limit.'};
 const next={...profile,...(energy?{energy:energy.max,energyDate:energy.date}:{}),...(offer.lootTickets?{lootTickets:(profile.lootTickets??0)+offer.lootTickets}:{}),gems:Math.min(GEM_LIMIT,profile.gems+(offer.gems||0)),gold:cap(profile.gold+(offer.gold||0))};if(offer.currency==='arenaTokens')next.arenaTokens=balance-offer.cost;else next.eventTokens={...profile.eventTokens,[offer.currency]:balance-offer.cost};return {profile:bumpPath(next,{gems:offer.gems||0}),offer};}
