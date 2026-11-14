import {validWeeklyState} from './weekly-combat.js?v=0.50.1';
// Pure calendar and catalogs. Five Trial/boss pairs repeat on a five-week cycle.
export const WEEKLY_REWARDS={trial:{gold:500,gems:100},encounter:{gold:750,gems:150}};
export const WEEKLY_TRIALS=[
 ['The Runesmith’s Test','Forge & activate Blast + Prismatic Runes to break the seal.','runesmith','runesmith'],
 ['Rares Only','Five Rare champions.','rares_only','rares-only'],
 ['The Borrowed Warband','Loaned team · Lv. 40. New combination each return.','borrowed','borrowed-warband'],
 ['The Final Volley','Fixed board · charged Specials. Win within 3 moves.','volley','final-volley'],
 ['Twofold Trial','Featured elements only. Include both.','twofold','twofold']
];
export const WEEKLY_BOSSES=[
 ['The Mirror Mage','Copies your latest Special at its next attack.','mirror','mirror-mage',['redknife_tavin','pale_matriarch','cursed_acolyte']],
 ['The Twin Tyrants','Defeat both Tyrants before the enemy phase, or one revives.','twins','twin-tyrants',['necropolis_titan','cursed_acolyte','necropolis_titan']],
 ['The Mana Collector','Break crystals to reclaim stolen mana. Every third move, stored mana heals the boss.','collector','mana-collector',['voltaic_priest','umbral_hierarch','voltaic_priest']],
 ['The Eclipse Beast','Armor alternates every 2 moves: −75% tile damage, then −75% Special damage.','eclipse','eclipse-beast',['shadow_thrall','yshmir_worldwound','cursed_acolyte']],
 ['The Venom Regent','Starts shielded & charged. First Special: 2-turn ATK Up, DEF Up & team Poison.','regent','venom-regent',['redknife_tavin','voltaic_priest','cursed_acolyte']]
];
export const LOAN_TEAMS=[
 ['shieldmaiden_runa','ravel','jade_archer_linh','grove_druid','cursed_acolyte'],
 ['redknife_tavin','rimebow_tessa','plague_doctor','ironwall_sniper','shade_prince'],
 ['berserker_ulf','ice_shaman_sigrid','thornweaver_seraph','blood_paladin','umbral_hierarch'],
 ['demon_witchblade','jade_archer_linh','rivet_mender_orsa','pale_matriarch','caravan_warden_samira'],
 ['ravel','rimebow_tessa','grove_druid','ironwall_sniper','cursed_acolyte'],
 ['redknife_tavin','shieldmaiden_runa','thornveil_dryad','blood_paladin','shade_prince']
];
const elements=['red','blue','green','yellow','purple'],mod=(n,d)=>(n%d+d)%d;
export const ELEMENT_PAIRS=elements.flatMap((a,i)=>elements.slice(i+1).map(b=>[a,b]));
export const WEEKLY_CHALLENGES=[...WEEKLY_TRIALS.map(([name,description,rule,art],rotation)=>({id:`weekly-trial-${rotation}`,mode:'weekly',weeklyKind:'trial',rotation,name,description,weeklyRule:rule,restriction:rule==='rares_only'?'rares_only':rule==='twofold'?'twofold':null,enemyIds:['redknife_tavin','bronze_juggernaut','cursed_acolyte'],difficulty:'normal',number:1,hp:1,atk:1,countdown:3,stats:rule==='volley'?[480,120,100]:[720,230,200],bossHp:rule==='runesmith'?2:1.3,boss:true,art:`assets/weekly/${art}.webp`,portrait:`assets/weekly/${art}.webp`,rewards:{gold:0,xp:0}})),...WEEKLY_BOSSES.map(([name,description,rule,art,enemyIds],rotation)=>({id:`weekly-encounter-${rotation}`,mode:'weekly',weeklyKind:'encounter',rotation,name,description,weeklyRule:rule,restriction:null,enemyIds,difficulty:'normal',number:1,hp:1,atk:1,countdown:3,stats:[1000,300,260],bossHp:1.3,boss:true,art:`assets/weekly/${art}.webp`,portrait:`assets/weekly/${art}.webp`,rewards:{gold:0,xp:0}}))];
export const WEEKLY_STAGES=WEEKLY_CHALLENGES.flatMap(c=>[1,2,3].map(round=>({...c,id:c.id+'-battle-'+round,challengeId:c.id,round,challengeDescription:c.description,name:c.name+' · Battle '+round+'/3',challengeName:c.name,...(c.weeklyKind==='encounter'&&round<3?{enemyIds:round===1?['pit_grunt','redknife_tavin','cursed_acolyte']:['ironwall_sniper','shieldmaiden_runa','grove_druid'],stats:round===1?[650,220,190]:[850,270,230],boss:false,description:'Defeat the advance guard. '+c.name+' awaits in battle 3.'}:c.weeklyKind==='trial'&&round<3?{enemyIds:round===1?['redknife_tavin','shellback_brukk','rimebow_tessa']:['ghoul_scavenger','pale_matriarch','cursed_acolyte'],...(c.weeklyRule==='runesmith'?{description:round===1?'Forge and activate a Blast Rune to break the guardian’s seal.':'Forge and activate a Prismatic Rune to break the guardian’s seal.'}:{})}:{} )})));
export function weeklyClears(profile,key){const r=profile.weeklyRecords?.[key];return r?.completed?3:r?.clearedStages||0;}
export function nextWeeklyStage(profile,stage,weekKey){const clear=weeklyClears(profile,weekKey+':'+stage.weeklyKind);return WEEKLY_STAGES.find(s=>s.challengeId===stage.challengeId&&s.round===Math.min(3,clear+1));}
export function weeklyDetails(stage,key){const week=Math.floor((Date.parse(key.slice(0,10)+'T00:00:00Z')-Date.UTC(2026,10,9))/604800000),appearance=Math.floor(week/5);return {...stage,...(stage.weeklyRule==='twofold'?{allowedElements:ELEMENT_PAIRS[mod(appearance,10)]}:{}),...(['borrowed','volley'].includes(stage.weeklyRule)?{loanTeam:LOAN_TEAMS[stage.weeklyRule==='volley'?0:mod(appearance,LOAN_TEAMS.length)],loanLevel:40}:{})};}
function localMidnight(date){const [y,m,d]=date.split('-').map(Number);let t=Date.UTC(y,m-1,d,8);for(let i=0;i<3;i++){const parts=new Intl.DateTimeFormat('en-US',{timeZone:'America/Los_Angeles',hourCycle:'h23',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit'}).formatToParts(new Date(t));const get=k=>Number(parts.find(p=>p.type===k).value);t+=Date.UTC(y,m-1,d)-Date.UTC(get('year'),get('month')-1,get('day'),get('hour'),get('minute'));}return new Date(t);}
export function weeklyWindow(now=new Date()){
 const parts=new Intl.DateTimeFormat('en-CA',{timeZone:'America/Los_Angeles',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(now),get=k=>Number(parts.find(p=>p.type===k).value),day=new Date(Date.UTC(get('year'),get('month')-1,get('day')));day.setUTCDate(day.getUTCDate()-(day.getUTCDay()+6)%7);const key=day.toISOString().slice(0,10),week=Math.floor((+day-Date.UTC(2026,10,9))/604800000),rotation=mod(week,5),encounterRotation=mod(week,5);day.setUTCDate(day.getUTCDate()+7);return {key,rotation,encounterRotation,reset:localMidnight(day.toISOString().slice(0,10)),stages:WEEKLY_STAGES.filter(e=>e.round===1&&e.rotation===(e.weeklyKind==='trial'?rotation:encounterRotation)).map(e=>weeklyDetails(e,key))};
}
export function weeklyTeamError(stage,heroes,key=weeklyWindow().key){
 if(stage.loanTeam||['borrowed','volley'].includes(stage.weeklyRule))return null;
 if(!Array.isArray(heroes)||heroes.length!==5||heroes.some(h=>!h))return 'Choose five champions.';
 if(stage.restriction==='rares_only'&&heroes.some(h=>h.rarity!=='rare'))return 'This Trial allows Rare champions only.';
 if(stage.restriction==='twofold'){const pair=stage.allowedElements||weeklyDetails(stage,key).allowedElements,colors=new Set(heroes.map(h=>h.color));if(colors.size!==2||heroes.some(h=>!pair.includes(h.color)))return 'Use only '+pair.join(' + ')+', with both elements represented.';}
 return null;
}
export function validWeeklyKey(key){if(typeof key!=='string'||!/^\d{4}-\d{2}-\d{2}:(trial|encounter)$/.test(key))return false;const d=new Date(key.slice(0,10)+'T00:00:00Z');return Number.isFinite(+d)&&d.toISOString().slice(0,10)===key.slice(0,10)&&d.getUTCDay()===1;}
export function normalizeWeekly(p){const records={};for(const [key,r]of Object.entries(p.weeklyRecords&&typeof p.weeklyRecords==='object'&&!Array.isArray(p.weeklyRecords)?p.weeklyRecords:{}).sort())if(validWeeklyKey(key)&&r&&(r.completed===true||Number.isInteger(r.clearedStages)&&r.clearedStages>=1&&r.clearedStages<=2))records[key]={completed:r.completed===true,claimed:r.completed===true&&r.claimed===true,bestMoves:Number.isSafeInteger(r.bestMoves)&&r.bestMoves>=0?r.bestMoves:0,...(r.clearedStages!==undefined?{clearedStages:r.completed?3:r.clearedStages,totalMoves:Number.isSafeInteger(r.totalMoves)&&r.totalMoves>=0?r.totalMoves:0}:{})};const e=p.weeklyEntry;return {weeklyRecords:records,weeklyEntry:e&&typeof e.battleId==='string'&&e.battleId.length<=120&&validWeeklyKey(e.key)&&WEEKLY_STAGES.some(s=>s.id===e.stageId&&s.weeklyKind===e.key.split(':')[1])?{battleId:e.battleId,key:e.key,stageId:e.stageId}:null};}
export function completeWeekly(p,battle,stage){const entry=p.weeklyEntry;if(!validWeeklyBattle(battle,stage)||battle.phase!=='victory'||battle.sandbox||!entry||entry.battleId!==battle.id||entry.stageId!==battle.stageId||entry.key!==battle.weeklyKey||!validWeeklyKey(entry.key))return p;const old=p.weeklyRecords?.[entry.key],clears=weeklyClears(p,entry.key);if(!old?.completed&&stage.round!==clears+1)return p;const total=(old?.totalMoves||0)+battle.moves,record=old?.completed?old:{completed:stage.round===3,claimed:false,bestMoves:stage.round===3?total:0,clearedStages:stage.round,totalMoves:total};return {...p,weeklyRecords:{...p.weeklyRecords,[entry.key]:record},weeklyEntry:null,recorded:[...p.recorded.filter(id=>id!==battle.id),battle.id].slice(-200)};}
export function claimWeekly(p,key,now=new Date()){const r=p.weeklyRecords?.[key];if(!validWeeklyKey(key)||key.slice(0,10)>weeklyWindow(now).key||!r?.completed||r.claimed)return {profile:p,error:'No weekly reward is ready.'};const reward=WEEKLY_REWARDS[key.split(':')[1]];return {profile:{...p,gold:Math.min(999999999,p.gold+reward.gold),gems:Math.min(999999999,p.gems+reward.gems),weeklyRecords:{...p.weeklyRecords,[key]:{...r,claimed:true}}},reward};}

export function validWeeklyBattle(battle,stage){
 if(battle.weeklyKey===undefined)return stage.mode!=='weekly';
 if(stage.mode!=='weekly'||!validWeeklyKey(battle.weeklyKey)||!battle.weeklyKey.endsWith(':'+stage.weeklyKind))return false;
 const current=weeklyWindow(new Date(battle.weeklyKey.slice(0,10)+'T12:00:00Z')).stages.find(s=>s.challengeId===stage.challengeId);
 if(!current||weeklyTeamError(current,battle.heroes,battle.weeklyKey))return false;
 if(current.loanTeam&&JSON.stringify(battle.heroes?.map(h=>h.id))!==JSON.stringify(current.loanTeam))return false;
 return validWeeklyState(battle)&&battle.weekly.rule===stage.weeklyRule&&battle.weekly.round===stage.round;
}
export function validWeeklyProfile(p){const n=normalizeWeekly(p);return (p.weeklyRecords===undefined||JSON.stringify(Object.entries(p.weeklyRecords).sort())===JSON.stringify(Object.entries(n.weeklyRecords).sort()))&&(p.weeklyEntry===undefined||JSON.stringify(p.weeklyEntry)===JSON.stringify(n.weeklyEntry));}
