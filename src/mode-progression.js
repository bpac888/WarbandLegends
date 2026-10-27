import {heroForId,uniqueHeroCount} from './hero-copies.js';
import {addAccountXp,accountBattleXp,bumpPath} from './keeper.js';
import {GEM_LIMIT} from './economy.js';
import {SPECIAL_EVENTS,eventWindow,eventAttemptsLeft,EVENT_ATTEMPTS} from './modes.js';
import {getEncounter} from './encounters.js';
import {addHeroXp} from './development.js';
const cap=n=>Math.min(999999999,Math.max(0,n));
const safe=(n,f=0,max=999999999)=>Number.isSafeInteger(n)&&n>=0&&n<=max?n:f;
export function defaultModes(){return {arenaRating:1000,arenaTokens:0,arenaWins:0,arenaLosses:0,eventWins:0,eventAttempts:{},eventTokens:Object.fromEntries(SPECIAL_EVENTS.map(e=>[e.token,0])),eventEntry:null};}
export function validEventKey(key){return typeof key==='string'&&SPECIAL_EVENTS.some(e=>key.startsWith(e.id+':'))&&/^\w+:\d{4}-(0[1-9]|1[0-2])$/.test(key);}
export function normalizeModes(p){const base=defaultModes(),eventAttempts={};for(const [key,n]of Object.entries(p.eventAttempts&&typeof p.eventAttempts==='object'&&!Array.isArray(p.eventAttempts)?p.eventAttempts:{}))if(validEventKey(key)&&Number.isSafeInteger(n)&&n>=0&&n<=EVENT_ATTEMPTS)eventAttempts[key]=n;
 const entry=p.eventEntry&&typeof p.eventEntry==='object'&&!Array.isArray(p.eventEntry)&&typeof p.eventEntry.battleId==='string'&&p.eventEntry.battleId.length<=120&&validEventKey(p.eventEntry.key)&&eventAttempts[p.eventEntry.key]>0?{battleId:p.eventEntry.battleId,key:p.eventEntry.key}:null;
 return {...base,...Object.fromEntries(['arenaRating','arenaTokens','arenaWins','arenaLosses','eventWins'].map(k=>[k,safe(p[k],base[k])])),eventAttempts,eventTokens:Object.fromEntries(SPECIAL_EVENTS.map(e=>[e.token,safe(p.eventTokens?.[e.token])])),eventEntry:entry};
}
export function validateModes(p){if(['arenaRating','arenaTokens','arenaWins','arenaLosses','eventWins'].some(k=>!Number.isSafeInteger(p[k])||p[k]<0||p[k]>999999999))return false;
 if(!p.eventAttempts||typeof p.eventAttempts!=='object'||Array.isArray(p.eventAttempts)||Object.entries(p.eventAttempts).some(([key,n])=>!validEventKey(key)||!Number.isSafeInteger(n)||n<0||n>EVENT_ATTEMPTS))return false;
 if(!p.eventTokens||typeof p.eventTokens!=='object'||Array.isArray(p.eventTokens)||SPECIAL_EVENTS.some(e=>!Number.isSafeInteger(p.eventTokens[e.token])||p.eventTokens[e.token]<0||p.eventTokens[e.token]>999999999))return false;
 return p.eventEntry===null||!!(p.eventEntry&&typeof p.eventEntry==='object'&&!Array.isArray(p.eventEntry)&&typeof p.eventEntry.battleId==='string'&&p.eventEntry.battleId.length<=120&&validEventKey(p.eventEntry.key)&&p.eventAttempts[p.eventEntry.key]>0);
}
export function reserveEntry(profile,battle,now=new Date()){
 const e=getEncounter(battle.stageId);if(!e)return {profile,error:'Unknown encounter.'};
 if(e.mode!=='event'||battle.sandbox)return {profile:{...profile,eventEntry:null},battle};
 const window=eventWindow(e.eventId,now);if(!window.active)return {profile,error:'This event is outside its monthly window.'};
 // Pay on entry, before any battle playback. Leaving or losing does not refund an attempt.
 if(profile.eventEntry?.battleId===battle.id&&profile.eventEntry.key===window.key)return {profile,battle:{...battle,eventWindow:window.key}};
 if(eventAttemptsLeft(profile,e.eventId,now)<1)return {profile,error:'No attempts remain in this event window.'};
 const next={...profile,eventAttempts:{...profile.eventAttempts,[window.key]:(profile.eventAttempts[window.key]||0)+1},eventEntry:{battleId:battle.id,key:window.key}};
 return {profile:next,battle:{...battle,eventWindow:window.key}};
}
export function modeReward(profile,battle){const e=getEncounter(battle.stageId),won=battle.phase==='victory';
 if(!e||battle.sandbox||!['victory','defeat'].includes(battle.phase))return {gold:0,gems:0,xp:0};
 if(e.mode==='arena')return {gold:won?e.rewards.gold:0,gems:0,xp:0,accountXp:accountBattleXp(e,won),arenaTokens:won?e.arenaTokens:0,rating:won?18:-12};
 if(e.mode==='event'&&profile.eventEntry?.battleId===battle.id&&profile.eventEntry?.key===battle.eventWindow&&battle.eventWindow?.startsWith(e.eventId+':')){const first=won&&!profile.cleared.includes(e.id);return {gold:won?(first?450:150):0,gems:won?(first?100:25):0,xp:won?Math.round(e.rewards.xp*(first?1.5:1)):0,accountXp:accountBattleXp(e,won),eventToken:e.eventToken,eventTokens:won?8:0,first};}
 return {gold:0,gems:0,xp:0};
}
export function settleMode(profile,battle,roster){if(battle.sandbox||!['victory','defeat'].includes(battle.phase)||profile.recorded.includes(battle.id))return profile;const e=getEncounter(battle.stageId);if(!['arena','event'].includes(e?.mode))return profile;
 const reward=modeReward(profile,battle),win=battle.phase==='victory';if(e.mode==='event'&&!reward.eventToken)return profile;
 let next=profile;if(reward.xp&&battle.progression)for(const id of new Set(battle.heroes.map(h=>h.id))){const c=heroForId(roster,id);if(c)next=addHeroXp(next,c,reward.xp);}
 next=bumpPath(addAccountXp(next,accountBattleXp(e,win)),{wins:win?1:0,gems:reward.gems});
 next={...next,gold:cap(profile.gold+reward.gold),gems:Math.min(GEM_LIMIT,profile.gems+reward.gems),recorded:[...profile.recorded,battle.id].slice(-200)};
 if(e.mode==='arena')return {...next,arenaRating:cap(profile.arenaRating+reward.rating),arenaTokens:cap(profile.arenaTokens+reward.arenaTokens),arenaWins:cap(profile.arenaWins+(win?1:0)),arenaLosses:cap(profile.arenaLosses+(win?0:1))};
 return {...next,eventWins:cap(profile.eventWins+(win?1:0)),eventTokens:{...profile.eventTokens,[e.eventToken]:cap(profile.eventTokens[e.eventToken]+reward.eventTokens)},eventEntry:null,cleared:win?[...new Set([...profile.cleared,e.id])]:profile.cleared};
}
export const EXCHANGE_OFFERS=[{id:'arena-gems',name:'100 Gems',currency:'arenaTokens',label:'Arena Tokens',cost:40,gems:100},{id:'arena-gold',name:'Training Gold',currency:'arenaTokens',label:'Arena Tokens',cost:20,gold:500},...SPECIAL_EVENTS.map(e=>({id:e.id+'-gems',name:'100 Gems',currency:e.token,label:e.tokenName,cost:24,gems:100}))];
export function exchange(profile,id){const offer=EXCHANGE_OFFERS.find(o=>o.id===id);if(!offer)return {profile,error:'Unknown exchange.'};const balance=offer.currency==='arenaTokens'?profile.arenaTokens:profile.eventTokens[offer.currency]||0;
 if(balance<offer.cost)return {profile,error:'Earn more tokens before making this exchange.'};if(offer.gems&&profile.gems+offer.gems>GEM_LIMIT||offer.gold&&profile.gold+offer.gold>999999999)return {profile,error:'That resource is already at its storage limit.'};
 const next={...profile,gems:Math.min(GEM_LIMIT,profile.gems+(offer.gems||0)),gold:cap(profile.gold+(offer.gold||0))};if(offer.currency==='arenaTokens')next.arenaTokens=balance-offer.cost;else next.eventTokens={...profile.eventTokens,[offer.currency]:balance-offer.cost};return {profile:bumpPath(next,{gems:offer.gems||0}),offer};}
