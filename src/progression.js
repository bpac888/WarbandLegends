// Local game-loop foundation. No purchases, original-game accounts or shared economy.
import {addHeroXp,xpForLevel,levelCap} from './development.js';
export const PROFILE_VERSION=5;
export const CAMPAIGN_REWARDS=Object.freeze({
 'ashen-gate':{xp:80,gold:50},'frozen-pass':{xp:120,gold:75},'veil-sanctum':{xp:180,gold:100},
});
export const SEAL_INTERVAL=5;
export const STARTER_TEAM=['dragonmage','shieldmaiden_runa','steel_oracle','dune_queen_zaya','wraith_archer'];
export const SUMMON_ODDS=[{rarity:'common',chance:50},{rarity:'rare',chance:35},{rarity:'legendary',chance:13},{rarity:'mythical',chance:2}];
export const QUESTS=[
 {id:'first-summon',name:'An answer from beyond',text:'Summon a champion at the portal.',goal:1,metric:'summons',gold:100,seals:1},
 {id:'first-victory',name:'Across the broken gate',text:'Win your first campaign encounter.',goal:1,metric:'wins',gold:200,seals:2},
 {id:'ten-champions',name:'A growing legend',text:'Collect ten different champions.',goal:10,metric:'collection',gold:500,seals:3},
];
export function defaultProfile(){return {profileVersion:PROFILE_VERSION,name:'Rune Keeper',team:[...STARTER_TEAM],unlocked:0,wins:0,cleared:[],recorded:[],speed:1,helpSeen:false,gold:500,seals:5,collection:Object.fromEntries(STARTER_TEAM.map(id=>[id,1])),summons:0,history:[],claimed:[],heroXp:{},openRoster:false,reducedMotion:false};}
const safeInt=(v,fallback,max=999999999)=>Number.isSafeInteger(v)&&v>=0&&v<=max?v:fallback;
export function normalizeProfile(raw,roster){
 const base=defaultProfile();if(raw?.profileVersion!==PROFILE_VERSION)return base;const ids=new Set(roster.map(c=>c.id)),p=raw&&typeof raw==='object'&&!Array.isArray(raw)?raw:{};
 const team=Array.isArray(p.team)&&p.team.length===5&&new Set(p.team).size===5&&p.team.every(id=>ids.has(id))?[...p.team]:base.team;
 const cleared=Array.isArray(p.cleared)?[...new Set(p.cleared.filter(id=>['ashen-gate','frozen-pass','veil-sanctum'].includes(id)))]:[];
 const collection={};for(const [id,n]of Object.entries(p.collection&&typeof p.collection==='object'&&!Array.isArray(p.collection)?p.collection:{}))if(ids.has(id)&&Number.isSafeInteger(n)&&n>0&&n<=99999)collection[id]=n;
 for(const id of STARTER_TEAM)if(ids.has(id)&&!collection[id])collection[id]=1;
 const heroXp={};for(const [id,n]of Object.entries(p.heroXp&&typeof p.heroXp==='object'&&!Array.isArray(p.heroXp)?p.heroXp:{})){const c=roster.find(c=>c.id===id);if(c&&collection[id]&&Number.isSafeInteger(n)&&n>=0)heroXp[id]=Math.min(n,xpForLevel(c,levelCap(c)));}
 const openRoster=p.openRoster===true;
 let selected=team;if(!openRoster&&selected.some(id=>!collection[id]))selected=[...selected.filter(id=>collection[id]),...Object.keys(collection).filter(id=>!selected.includes(id))].slice(0,5);
 return {...base,name:typeof p.name==='string'&&p.name.trim()?p.name.trim().slice(0,24):base.name,team:selected,unlocked:safeInt(p.unlocked,0,2),wins:safeInt(p.wins,0),cleared,recorded:Array.isArray(p.recorded)?p.recorded.filter(id=>typeof id==='string'&&id.length<150).slice(-200):[],speed:p.speed===2?2:1,helpSeen:p.helpSeen===true,gold:safeInt(p.gold,500),seals:safeInt(p.seals,5,999999),collection,summons:safeInt(p.summons,0),history:Array.isArray(p.history)?p.history.filter(h=>h&&ids.has(h.championId)&&Number.isSafeInteger(h.sequence)&&h.sequence>0&&typeof h.at==='string'&&Number.isFinite(Date.parse(h.at))).slice(-20):[],heroXp,claimed:Array.isArray(p.claimed)?[...new Set(p.claimed.filter(id=>QUESTS.some(q=>q.id===id)))]:[],openRoster,reducedMotion:p.reducedMotion===true};
}
export function canUse(profile,id){return profile.openRoster||!!profile.collection[id];}
export function setOpenRoster(profile,enabled){const next={...profile,openRoster:enabled};if(!enabled&&next.team.some(id=>!profile.collection[id]))next.team=[...next.team.filter(id=>profile.collection[id]),...Object.keys(profile.collection).filter(id=>!next.team.includes(id))].slice(0,5);return next;}
export function summon(profile,roster,random,at=new Date().toISOString()){
 if(profile.seals<1)return {profile,error:'You need a Summon Seal. Earn more through campaign first clears, quests and every five campaign victories.'};
 const roll=random();if(!Number.isFinite(roll)||roll<0||roll>=1)throw Error('Invalid summon roll');
 let cumulative=0,rarity;for(const option of SUMMON_ODDS){cumulative+=option.chance/100;if(roll<cumulative){rarity=option.rarity;break;}}
 const pool=roster.filter(c=>c.rarity===rarity);if(!pool.length)throw Error('Summon pool unavailable');
 const pick=random();if(!Number.isFinite(pick)||pick<0||pick>=1)throw Error('Invalid summon selection');
 const champion=pool[Math.floor(pick*pool.length)],sequence=profile.summons+1,previous=profile.collection[champion.id]||0;
 if(previous>=99999)return {profile,error:'This champion has reached the collection copy limit.'};
 const next={...profile,seals:profile.seals-1,summons:sequence,collection:{...profile.collection,[champion.id]:previous+1},history:[...profile.history,{sequence,championId:champion.id,at}].slice(-20)};
 return {profile:next,champion,isNew:previous===0,sequence};
}
export function questProgress(profile,quest){return quest.metric==='collection'?Object.keys(profile.collection).length:profile[quest.metric]||0;}
export function claimQuest(profile,id){const q=QUESTS.find(q=>q.id===id);if(!q||profile.claimed.includes(id)||questProgress(profile,q)<q.goal)return {profile,error:'This quest is not ready to claim.'};return {profile:{...profile,gold:Math.min(999999999,profile.gold+q.gold),seals:Math.min(999999,profile.seals+q.seals),claimed:[...profile.claimed,id]}};}
export function victoryRewards(profile,battle){
 const reward=CAMPAIGN_REWARDS[battle.stageId];if(!reward||battle.phase!=='victory'||battle.sandbox)return {gold:0,seals:0,xp:0};
 const first=!profile.cleared.includes(battle.stageId),milestone=(profile.wins+1)%SEAL_INTERVAL===0;
 return {gold:first?500:reward.gold,seals:(first?1:0)+(milestone?1:0),xp:Math.round(reward.xp*(first?1.5:1)),first,milestone};
}
export function awardVictory(profile,battle,roster=[]){
 if(battle.phase!=='victory'||battle.sandbox||profile.recorded.includes(battle.id))return profile;
 const index=['ashen-gate','frozen-pass','veil-sanctum'].indexOf(battle.stageId);if(index<0)return profile;
 const reward=victoryRewards(profile,battle);let grown=profile;
 if(battle.progression)for(const id of new Set((battle.heroes||[]).map(h=>h.id))){const c=roster.find(c=>c.id===id);if(c)grown=addHeroXp(grown,c,reward.xp);}
 return {...grown,wins:Math.min(999999999,profile.wins+1),unlocked:Math.max(profile.unlocked,Math.min(2,index+1)),cleared:[...new Set([...profile.cleared,battle.stageId])],recorded:[...profile.recorded,battle.id].slice(-200),gold:Math.min(999999999,profile.gold+reward.gold),seals:Math.min(999999,profile.seals+reward.seals)};
}
export function validateProfile(p,roster){
 const ids=new Set(roster.map(c=>c.id));if(!p||p.profileVersion!==PROFILE_VERSION||typeof p.name!=='string'||!p.name.trim()||p.name.length>24||!Array.isArray(p.team)||p.team.length!==5||new Set(p.team).size!==5||p.team.some(id=>!ids.has(id)))return false;
 for(const [key,max]of [['gold',999999999],['seals',999999],['summons',999999999],['wins',999999999],['unlocked',2]])if(!Number.isSafeInteger(p[key])||p[key]<0||p[key]>max)return false;
 if(!p.collection||typeof p.collection!=='object'||Array.isArray(p.collection)||Object.keys(p.collection).length<5||Object.entries(p.collection).some(([id,n])=>!ids.has(id)||!Number.isSafeInteger(n)||n<1||n>99999))return false;
 if(!p.heroXp||typeof p.heroXp!=='object'||Array.isArray(p.heroXp)||Object.entries(p.heroXp).some(([id,n])=>!p.collection[id]||!ids.has(id)||!Number.isSafeInteger(n)||n<0||n>xpForLevel(roster.find(c=>c.id===id),levelCap(roster.find(c=>c.id===id)))))return false;
 if(typeof p.openRoster!=='boolean'||typeof p.reducedMotion!=='boolean'||![1,2].includes(p.speed)||typeof p.helpSeen!=='boolean'||!p.openRoster&&p.team.some(id=>!p.collection[id]))return false;
 if(!Array.isArray(p.cleared)||p.cleared.some(id=>!['ashen-gate','frozen-pass','veil-sanctum'].includes(id))||!Array.isArray(p.recorded)||p.recorded.length>200||p.recorded.some(id=>typeof id!=='string'||id.length>150)||!Array.isArray(p.claimed)||p.claimed.some(id=>!QUESTS.some(q=>q.id===id)))return false;
 return Array.isArray(p.history)&&p.history.length<=20&&p.history.every(h=>h&&ids.has(h.championId)&&Number.isSafeInteger(h.sequence)&&h.sequence>0&&typeof h.at==='string'&&Number.isFinite(Date.parse(h.at)));
}
