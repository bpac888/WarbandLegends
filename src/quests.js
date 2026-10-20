import {addAccountXp,accountDevelopment,bumpPath} from './keeper.js';
import {addHeroXp} from './development.js';
import {addMaterials} from './ascension.js';
import {GEM_LIMIT} from './economy.js';
export const QUEST_CATEGORIES=[['all','All quests'],['campaign','Campaign'],['dungeons','Dungeons'],['arena','Arena'],['events','Events'],['collection','Collection'],['growth','Growth']];
const q=(id,name,category,metric,goal,text,rewards)=>({id,name,category,metric,goal,text,gold:0,gems:0,xp:0,items:{},...rewards,accountXp:rewards.accountXp??50});
export const QUESTS=[
 q('first-summon','An answer from beyond','collection','summons',1,'Summon your first champion.',{gems:100,gold:100,xp:50}),
 q('first-victory','Across the broken gate','campaign','wins',1,'Win your first campaign encounter.',{gems:200,gold:200,items:{'star-thread':2}}),
 q('ten-champions','A growing legend','collection','collection',10,'Collect ten different champions.',{gems:300,gold:500,xp:100}),
 ...[[5,100,500],[10,150,1000],[15,200,1500],[25,400,3000]].map(([goal,gems,gold])=>q('normal-'+goal,'The rune road · '+goal,'campaign','normal',goal,`Clear Normal campaign stage ${goal}.`,{gems,gold,xp:goal*10,items:{'star-thread':Math.ceil(goal/5)}})),
 q('hard-five','Beyond the ashes','campaign','hard',5,'Clear Hard campaign stage 5.',{gems:250,gold:2000,items:{'aether-crystal':3},xp:300}),
 q('hard-complete','A world reclaimed','campaign','hard',25,'Clear all 25 Hard campaign stages.',{gems:500,gold:5000,items:{'sovereign-crown':2},xp:750}),
 q('nightmare-complete','Light in the nightmare','campaign','nightmare',25,'Clear all 25 Nightmare stages.',{gems:750,gold:6000,items:{'astral-heart':2,'awakened-ember':3},xp:1000}),
 ...[[1,75,250],[5,125,750],[15,200,1500],[30,300,3000]].map(([goal,gems,gold])=>q('dungeon-wins-'+goal,'Into the depths · '+goal,'dungeons','dungeonWins',goal,`Win ${goal} dungeon battle${goal===1?'':'s'}.`,{gems,gold,xp:goal*10,items:{'aether-crystal':Math.ceil(goal/5)}})),
 q('seven-vaults','Keeper of the vaults','dungeons','dungeonTypes',7,'Clear all seven dungeons on any difficulty.',{gems:350,gold:2000,items:{'sovereign-crown':2},xp:400}),
 ...[[1,50,300],[5,100,1000],[20,250,3000]].map(([goal,gems,gold])=>q('arena-wins-'+goal,'Arena contender · '+goal,'arena','arenaWins',goal,`Win ${goal} Arena battle${goal===1?'':'s'}.`,{gems,gold,xp:goal*10})),
 ...[[1,100,500],[3,150,1200],[10,300,3000]].map(([goal,gems,gold])=>q('event-wins-'+goal,'When legends gather · '+goal,'events','eventWins',goal,`Win ${goal} Special Event battle${goal===1?'':'s'}.`,{gems,gold,items:{'awakened-ember':goal===10?3:1},xp:goal*25})),
 ...[[10,150,500],[30,250,1500],[100,500,4000]].map(([goal,gems,gold])=>q('summons-'+goal,'Voices through the gate · '+goal,'collection','summons',goal,`Summon ${goal} champions in total.`,{gems,gold,xp:100})),
 ...[[20,200,1000],[40,350,2500],[80,500,5000]].map(([goal,gems,gold])=>q('collection-'+goal,'Hall of legends · '+goal,'collection','collection',goal,`Collect ${goal} different champions.`,{gems,gold,items:{'star-thread':4},xp:200})),
 ...[[500,75,300],[5000,150,1000],[25000,250,2500]].map(([goal,gems,gold])=>q('growth-xp-'+goal,'Strength in the making · '+goal,'growth','totalXp',goal,`Build ${goal.toLocaleString()} total champion XP through battles, training or quests.`,{gems,gold,items:{'star-thread':3},xp:goal===500?75:250})),
 q('first-ascension','Rise beyond the limit','growth','ascensions',1,'Ascend a champion once.',{gems:150,gold:1000,items:{'aether-crystal':2},xp:150}),
 q('five-ascensions','A rising warband','growth','ascensions',5,'Complete five ascensions across your roster.',{gems:300,gold:2500,items:{'sovereign-crown':1},xp:400}),
 ...Array.from({length:10},(_,i)=>{const level=(i+1)*10,tier=i+1;return q('keeper-'+level,'Keeper milestone · '+level,'growth','accountLevel',level,`Reach account level ${level}.`,{gems:(8+tier*4)*5,gold:200+tier*150+level*8,items:level>=50?{'awakened-ember':tier}:{'aether-crystal':tier},accountXp:0});}),
 q('first-awakening','The power within','growth','awakenings',1,'Awaken a champion for the first time.',{gems:400,gold:3000,items:{'astral-heart':1,'awakened-ember':2},xp:500})
];
export function questProgress(profile,quest){const sum=o=>Object.values(o||{}).reduce((n,v)=>n+v,0);switch(quest.metric){case 'accountLevel':return accountDevelopment(profile.accountXp).level;case 'collection':return Object.keys(profile.collection).length;case 'normal':case 'hard':case 'nightmare':return profile.campaignProgress[quest.metric]||0;case 'dungeonTypes':return new Set(Object.keys(profile.dungeonClears).map(id=>id.replace(/-(normal|hard|nightmare)$/,''))).size;case 'totalXp':return sum(profile.heroXp);case 'ascensions':return sum(profile.ascensions);case 'awakenings':return sum(profile.awakenings);default:return profile[quest.metric]||0;}}
export function claimQuest(profile,id,roster=[]){const quest=QUESTS.find(q=>q.id===id);if(!quest||profile.claimed.includes(id)||questProgress(profile,quest)<quest.goal)return {profile,error:'This quest is not ready to claim.'};let next=addMaterials({...profile,gold:Math.min(999999999,profile.gold+quest.gold),gems:Math.min(GEM_LIMIT,profile.gems+quest.gems),claimed:[...profile.claimed,id]},quest.items);const growth=[];for(const id of new Set(profile.team)){const c=roster.find(c=>c.id===id);if(c&&profile.collection[id]&&quest.xp){const before=next.heroXp[id]||0;next=addHeroXp(next,c,quest.xp);growth.push({id,xp:(next.heroXp[id]||0)-before});}}return {profile:bumpPath(addAccountXp(next,quest.accountXp),{gems:quest.gems}),quest,growth};}
