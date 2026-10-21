import {baseHeroId,validCopyId,heroForId,battleRoster,nextCopyId,splitLegacyCopies} from './hero-copies.js';
import {defaultKeeper,normalizeKeeper,validKeeper,addAccountXp,accountBattleXp,bumpPath} from './keeper.js';
import {GEM_LIMIT,INITIAL_GEMS,SUMMON_COST,TEN_SUMMON_COST,GEM_INTERVAL} from './economy.js';
import {QUESTS,questProgress,claimQuest} from './quests.js';
export {QUESTS,questProgress,claimQuest,GEM_INTERVAL};
import {ASCENSION_CAPS,MATERIALS,MATERIAL_LIMIT,currentLevelCap,materialDrops,addMaterials,validateAscension} from './ascension.js';
import {defaultModes,normalizeModes,validateModes,modeReward,settleMode} from './mode-progression.js';
import {ENCOUNTERS,DIFFICULTIES,getEncounter,entryError} from './encounters.js';
// Local game-loop foundation. No purchases, original-game accounts or shared economy.
import {addHeroXp,xpForLevel,levelCap} from './development.js';
export const PROFILE_VERSION=12;
export const CAMPAIGN_REWARDS=Object.freeze(Object.fromEntries(ENCOUNTERS.map(e=>[e.id,e.rewards])));
export const STARTER_TEAM=['nima_dewthread','ravel','plague_doctor_mors','gallows_marksman_oren','cult_zealot'];
export const SUMMON_ODDS=[{rarity:'common',chance:50},{rarity:'rare',chance:30},{rarity:'legendary',chance:7.5},{rarity:'mythical',chance:1.5},{rarity:'double_common',chance:11}];
export function defaultProfile(){return {...defaultModes(),...defaultKeeper(),profileVersion:PROFILE_VERSION,copySequence:0,name:'Rune Keeper',team:[...STARTER_TEAM],unlocked:0,wins:0,cleared:[],recorded:[],speed:1,helpSeen:false,gold:500,gems:INITIAL_GEMS,collection:Object.fromEntries(STARTER_TEAM.map(id=>[id,1])),summons:0,history:[],claimed:[],heroXp:{},ascensions:{},awakenings:{},materials:{},campaignProgress:{normal:0,hard:0,nightmare:0},dungeonClears:{},dungeonWins:0,openRoster:false,reducedMotion:false};}
const safeInt=(v,fallback,max=999999999)=>Number.isSafeInteger(v)&&v>=0&&v<=max?v:fallback;
export function normalizeProfile(raw,roster){
 const base=defaultProfile();if(raw?.profileVersion===9)raw=splitLegacyCopies(raw,roster);if(![10,11,PROFILE_VERSION].includes(raw?.profileVersion))return base;const catalogue=roster;roster=battleRoster(raw,roster);const ids=new Set(roster.map(c=>c.id)),p=raw&&typeof raw==='object'&&!Array.isArray(raw)?raw:{};
 const team=Array.isArray(p.team)&&p.team.length===5&&new Set(p.team).size===5&&p.team.every(id=>ids.has(id))?[...p.team]:base.team;
 const cleared=Array.isArray(p.cleared)?[...new Set(p.cleared.filter(id=>!!getEncounter(id)))]:[];
 const collection={};for(const [id,n]of Object.entries(p.collection&&typeof p.collection==='object'&&!Array.isArray(p.collection)?p.collection:{}))if(validCopyId(id,catalogue)&&n===1)collection[id]=1;
 if(Object.keys(collection).length<5)return base;
 const heroXp={};for(const [id,n]of Object.entries(p.heroXp&&typeof p.heroXp==='object'&&!Array.isArray(p.heroXp)?p.heroXp:{})){const c=roster.find(c=>c.id===id);if(c&&collection[id]&&Number.isSafeInteger(n)&&n>=0)heroXp[id]=Math.min(n,xpForLevel(c,levelCap(c)));}
 const ascensions={},awakenings={},materials={};
 for(const c of roster)if(collection[c.id]){
  const caps=ASCENSION_CAPS[c.rarity];
  
  const rawTier=p.ascensions?.[c.id];const tier=Number.isSafeInteger(rawTier)&&rawTier>=0&&rawTier<caps.length?rawTier:0;
  if(tier)ascensions[c.id]=tier;
  const rank=p.awakenings?.[c.id],normal=caps.at(-1);if(tier===caps.length-1&&c.rarity!=='common'&&Number.isSafeInteger(rank)&&rank>0&&heroXp[c.id]>=xpForLevel(c,normal)){
   if(p.profileVersion<PROFILE_VERSION)awakenings[c.id]=1;
   else if(rank<=2&&heroXp[c.id]>=xpForLevel(c,normal+(rank-1)*5))awakenings[c.id]=rank;
  }
  if(heroXp[c.id]!==undefined)heroXp[c.id]=Math.min(heroXp[c.id],xpForLevel(c,caps[tier]+(awakenings[c.id]||0)*5));
 }
 for(const m of MATERIALS){const n=p.materials?.[m.id];if(Number.isSafeInteger(n)&&n>=0&&n<=MATERIAL_LIMIT)materials[m.id]=n;}
 const campaignProgress=Object.fromEntries(DIFFICULTIES.map(d=>[d.id,safeInt(p.campaignProgress?.[d.id],0,25)]));

 const dungeonClears={};for(const [id,n]of Object.entries(p.dungeonClears&&typeof p.dungeonClears==='object'&&!Array.isArray(p.dungeonClears)?p.dungeonClears:{}))if(getEncounter(id)?.mode==='dungeon'&&Number.isSafeInteger(n)&&n>0&&n<=999999999)dungeonClears[id]=n;
 const openRoster=p.openRoster===true;
 let selected=team;if(!openRoster&&selected.some(id=>!collection[id]))selected=[...selected.filter(id=>collection[id]),...Object.keys(collection).filter(id=>!selected.includes(id))].slice(0,5);
 return {...base,...normalizeModes(p),...normalizeKeeper(p,collection),copySequence:Math.max(safeInt(p.copySequence,0),...Object.keys(collection).map(id=>Number(id.split('~')[1])||0)),name:typeof p.name==='string'&&p.name.trim()?p.name.trim().slice(0,24):base.name,team:selected,unlocked:safeInt(p.unlocked,0,2),wins:safeInt(p.wins,0),cleared,recorded:Array.isArray(p.recorded)?p.recorded.filter(id=>typeof id==='string'&&id.length<150).slice(-200):[],speed:p.speed===2?2:1,helpSeen:p.helpSeen===true,gold:safeInt(p.gold,500),gems:safeInt(p.gems,INITIAL_GEMS,GEM_LIMIT),collection,campaignProgress,dungeonClears,dungeonWins:safeInt(p.dungeonWins,0),summons:safeInt(p.summons,0),history:Array.isArray(p.history)?p.history.filter(h=>h&&ids.has(h.championId)&&Number.isSafeInteger(h.sequence)&&h.sequence>0&&typeof h.at==='string'&&Number.isFinite(Date.parse(h.at))).slice(-20):[],heroXp,ascensions,awakenings,materials,claimed:Array.isArray(p.claimed)?[...new Set(p.claimed.filter(id=>QUESTS.some(q=>q.id===id)))]:[],openRoster,reducedMotion:p.reducedMotion===true};
}
export function canUse(profile,id){return profile.openRoster||!!profile.collection[id];}
export function setOpenRoster(profile,enabled){const next={...profile,openRoster:enabled};if(!enabled&&next.team.some(id=>!profile.collection[id]))next.team=[...next.team.filter(id=>profile.collection[id]),...Object.keys(profile.collection).filter(id=>!next.team.includes(id))].slice(0,5);return next;}
export function summon(profile,roster,random,at=new Date().toISOString()){
 if(!Number.isSafeInteger(profile.gems)||profile.gems<SUMMON_COST)return {profile,error:'You need 100 Gems. Earn Gems from first clears, dungeons, Special Events and quests.'};
 const result=drawChampion(profile,roster,random,at);if(result.error)return {profile,error:result.error};return {...result,...result.results[0],profile:{...result.profile,gems:profile.gems-SUMMON_COST}};
}
function drawChampion(profile,roster,random,at,forcedRarity=null){
 if(profile.summons>999999997)return {profile,error:'The summon history counter is full.'};
 const roll=random();if(!Number.isFinite(roll)||roll<0||roll>=1)throw Error('Invalid summon roll');
 let cumulative=0,rarity;for(const option of SUMMON_ODDS){cumulative+=option.chance/100;if(roll<cumulative){rarity=option.rarity;break;}}
 if(forcedRarity&&['common','double_common'].includes(rarity))rarity=forcedRarity;
 const twin=rarity==='double_common',pool=roster.filter(c=>c.rarity===(twin?'common':rarity));if(!pool.length)throw Error('Summon pool unavailable');
 let next=profile;const results=[];
 for(let i=0;i<(twin?2:1);i++){
  const pick=random();if(!Number.isFinite(pick)||pick<0||pick>=1)throw Error('Invalid summon selection');
  const champion=pool[Math.floor(pick*pool.length)],sequence=next.summons+1,previous=Object.keys(next.collection).filter(id=>baseHeroId(id)===champion.id).length,copy=nextCopyId(next,champion.id);
  if(previous>=99999)return {profile,error:'This champion has reached the collection copy limit.'};
  next={...next,summons:sequence,copySequence:copy.sequence,collection:{...next.collection,[copy.id]:1},history:[...next.history,{sequence,championId:champion.id,at}].slice(-20)};
  results.push({champion,isNew:previous===0,sequence,copyId:copy.id,twin});
 }
 return {profile:bumpPath(next,{summons:results.length},new Date(at)),results,rarity};
}
export function victoryRewards(profile,battle){
 if(['arena','event'].includes(getEncounter(battle.stageId)?.mode))return modeReward(profile,battle);
 const encounter=getEncounter(battle.stageId),reward=encounter?.rewards;if(!reward||battle.phase!=='victory'||battle.sandbox)return {gold:0,gems:0,xp:0};
 const first=!profile.cleared.includes(battle.stageId),milestone=encounter.mode==='campaign'&&(profile.wins+1)%GEM_INTERVAL===0;
 return {gold:first?(encounter.mode==='campaign'?500:reward.gold*3):reward.gold,gems:(first?(encounter.mode==='campaign'?200:100):encounter.mode==='dungeon'?10:0)+(milestone?50:0),xp:Math.round(reward.xp*(first?1.5:1)),accountXp:accountBattleXp(encounter,true),first,milestone,materials:materialDrops(encounter)};
}
export function awardVictory(profile,battle,roster=[]){
 if(['arena','event'].includes(getEncounter(battle.stageId)?.mode))return settleMode(profile,battle,roster);
 if(battle.phase!=='victory'||battle.sandbox||profile.recorded.includes(battle.id)||entryError(profile,battle.stageId))return profile;
 const e=getEncounter(battle.stageId);if(!e)return profile;
 const reward=victoryRewards(profile,battle);let grown=profile;
 if(battle.progression)for(const id of new Set((battle.heroes||[]).map(h=>h.id))){const c=heroForId(roster,id);if(c)grown=addHeroXp(grown,c,reward.xp);}
 const campaignProgress={...profile.campaignProgress},dungeonClears={...profile.dungeonClears};
 if(e.mode==='campaign')campaignProgress[e.difficulty]=Math.max(campaignProgress[e.difficulty]||0,e.number);else dungeonClears[e.id]=Math.min(999999999,(dungeonClears[e.id]||0)+1);
 return {...bumpPath(addAccountXp(addMaterials(grown,reward.materials),accountBattleXp(e,true)),{wins:1,gems:reward.gems}),campaignProgress,dungeonClears,wins:Math.min(999999999,profile.wins+(e.mode==='campaign'?1:0)),dungeonWins:Math.min(999999999,(profile.dungeonWins||0)+(e.mode==='dungeon'?1:0)),unlocked:Math.min(2,campaignProgress.normal),cleared:[...new Set([...profile.cleared,battle.stageId])],recorded:[...profile.recorded,battle.id].slice(-200),gold:Math.min(999999999,profile.gold+reward.gold),gems:Math.min(GEM_LIMIT,profile.gems+reward.gems)};
}
export function validateProfile(p,roster){
 const catalogue=roster;if(p)roster=battleRoster(p,roster);const ids=new Set(roster.map(c=>c.id));if(!p||![PROFILE_VERSION].includes(p.profileVersion)||typeof p.name!=='string'||!p.name.trim()||p.name.length>24||!Array.isArray(p.team)||p.team.length!==5||new Set(p.team).size!==5||p.team.some(id=>!ids.has(id)))return false;
 if(!Number.isSafeInteger(p.copySequence)||p.copySequence<0||p.copySequence>999999999||Object.keys(p.collection||{}).some(id=>id.includes('~')&&Number(id.split('~')[1])>p.copySequence))return false;
 for(const [key,max]of [['gold',999999999],['gems',GEM_LIMIT],['summons',999999999],['wins',999999999],['unlocked',2]])if(!Number.isSafeInteger(p[key])||p[key]<0||p[key]>max)return false;
 if(!p.collection||typeof p.collection!=='object'||Array.isArray(p.collection)||Object.keys(p.collection).length<5||Object.entries(p.collection).some(([id,n])=>!validCopyId(id,catalogue)||n!==1))return false;
 if(!p.heroXp||typeof p.heroXp!=='object'||Array.isArray(p.heroXp)||Object.entries(p.heroXp).some(([id,n])=>!p.collection[id]||!ids.has(id)||!Number.isSafeInteger(n)||n<0||n>xpForLevel(roster.find(c=>c.id===id),levelCap(roster.find(c=>c.id===id)))))return false;
 if(typeof p.openRoster!=='boolean'||typeof p.reducedMotion!=='boolean'||![1,2].includes(p.speed)||typeof p.helpSeen!=='boolean'||!p.openRoster&&p.team.some(id=>!p.collection[id]))return false;
 if(!Array.isArray(p.cleared)||p.cleared.some(id=>!!!getEncounter(id))||!Array.isArray(p.recorded)||p.recorded.length>200||p.recorded.some(id=>typeof id!=='string'||id.length>150)||!Array.isArray(p.claimed)||p.claimed.some(id=>!QUESTS.some(q=>q.id===id)))return false;
 if(p.profileVersion>=6){if(!p.campaignProgress||typeof p.campaignProgress!=='object'||Array.isArray(p.campaignProgress)||DIFFICULTIES.some(d=>!Number.isSafeInteger(p.campaignProgress[d.id])||p.campaignProgress[d.id]<0||p.campaignProgress[d.id]>25)||!Number.isSafeInteger(p.dungeonWins)||p.dungeonWins<0||p.dungeonWins>999999999||!p.dungeonClears||typeof p.dungeonClears!=='object'||Array.isArray(p.dungeonClears)||Object.entries(p.dungeonClears).some(([id,n])=>getEncounter(id)?.mode!=='dungeon'||!Number.isSafeInteger(n)||n<1||n>999999999))return false;}
 if(p.profileVersion>=7&&!validateModes(p))return false;
 if(p.profileVersion>=8){
  if(!validKeeper(p)||!validateAscension(p,roster))return false;
  for(const [id,n]of Object.entries(p.awakenings))if(n>0){const c=roster.find(c=>c.id===id),normal=ASCENSION_CAPS[c.rarity].at(-1);if((p.heroXp[id]||0)<xpForLevel(c,normal+(n-1)*5))return false;}
  for(const [id,xp]of Object.entries(p.heroXp)){const c=roster.find(c=>c.id===id);if(xp>xpForLevel(c,currentLevelCap(p,c)))return false;}
 }
 return Array.isArray(p.history)&&p.history.length<=20&&p.history.every(h=>h&&ids.has(h.championId)&&Number.isSafeInteger(h.sequence)&&h.sequence>0&&typeof h.at==='string'&&Number.isFinite(Date.parse(h.at)));
}

// A ten-call ritual is one atomic purchase; only its final completed profile is saved.
export function summonBatch(profile,roster,random,count=1,at=new Date().toISOString()){
 if(![1,10].includes(count))return {profile,error:'Choose one or ten portal calls.'};const cost=count===10?TEN_SUMMON_COST:SUMMON_COST;
 if(!Number.isSafeInteger(profile.gems)||profile.gems<cost)return {profile,error:`You need ${cost} Gems for this ritual.`};
 if(profile.summons>999999999-count*2)return {profile,error:'The summon history counter is full.'};
 let next={...profile,gems:profile.gems-cost},results=[],rarities=[];
 for(let i=0;i<count;i++){
  const guarantee=count===10&&i===9&&rarities.every(r=>['common','double_common'].includes(r));
  const r=drawChampion(next,roster,random,at,guarantee?'rare':null);if(r.error)return {profile,error:r.error};next=r.profile;results.push(...r.results);rarities.push(r.rarity);
 }
 const ranks={common:1,rare:2,legendary:3,mythical:4},best=results.reduce((a,b)=>ranks[b.champion.rarity]>ranks[a.champion.rarity]?b:a);
 return {profile:next,results,...best,count,cost,twinCount:rarities.filter(r=>r==='double_common').length};
}
