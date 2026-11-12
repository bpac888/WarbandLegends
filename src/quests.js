import {TUTORIAL_QUESTS,tutorialProgress,tutorialQuestAvailable} from './tutorial.js?v=0.44.1';
import {nextCopyId} from './hero-copies.js?v=0.44.1';
import {heroForId,uniqueHeroCount} from './hero-copies.js?v=0.44.1';
import {addAccountXp,accountDevelopment,bumpPath} from './keeper.js?v=0.44.1';
import {addHeroXp} from './development.js?v=0.44.1';
import {addMaterials} from './ascension.js?v=0.44.1';
import {GEM_LIMIT} from './economy.js?v=0.44.1';
export const QUEST_CATEGORIES=[['all','All quests'],['campaign','Campaign'],['dungeons','Dungeons'],['arena','Arena'],['events','Events'],['collection','Collection'],['growth','Growth']];
const q=(id,name,category,metric,goal,text,rewards)=>({id,name,category,metric,goal,text,gold:0,gems:0,xp:0,items:{},...rewards,accountXp:rewards.accountXp??50});
export const QUESTS=[
 q('first-summon','An Answer from Beyond','collection','summons',1,'Summon your first champion.',{gems:150,gold:100,xp:50,championReward:'cult_zealot',championRewardName:'Cult Zealot · Common training copy'}),
 q('first-victory','Across the Broken Gate','campaign','wins',1,'Win your first campaign encounter.',{gems:300,gold:200,items:{'star-thread':2}}),
 q('ten-champions','A Growing Legend','collection','collection',10,'Collect ten different champions.',{gems:350,gold:500,xp:100}),
 ...[[5,200,500],[10,250,1000],[15,300,1500],[25,500,3000]].map(([goal,gems,gold])=>q('normal-'+goal,'The Rune Road · '+goal,'campaign','normal',goal,`Clear Normal campaign stage ${goal}.`,{gems,gold,xp:goal*10,items:{'star-thread':Math.ceil(goal/5)}})),
 q('hard-five','Beyond the Ashes','campaign','hard',5,'Clear Hard campaign stage 5.',{gems:250,gold:2000,items:{'aether-crystal':3},xp:300}),
 q('hard-complete','A World Reclaimed','campaign','hard',25,'Clear all 25 Hard campaign stages.',{gems:500,gold:5000,items:{'sovereign-crown':2},xp:750}),
 q('nightmare-complete','Light in the Nightmare','campaign','nightmare',25,'Clear all 25 Nightmare stages.',{gems:750,gold:6000,items:{'astral-heart':2,'awakened-ember':3},xp:1000}),
 ...[[1,75,250],[5,125,750],[15,200,1500],[30,300,3000]].map(([goal,gems,gold])=>q('dungeon-wins-'+goal,'Into the Depths · '+goal,'dungeons','dungeonWins',goal,`Win ${goal} dungeon battle${goal===1?'':'s'}.`,{gems,gold,xp:goal*10,items:{'aether-crystal':Math.ceil(goal/5)}})),
 q('seven-vaults','Keeper of the Vaults','dungeons','dungeonTypes',7,'Clear all seven dungeons on any difficulty.',{gems:350,gold:2000,items:{'sovereign-crown':2},xp:400}),
 ...[[1,50,300],[5,100,1000],[20,250,3000]].map(([goal,gems,gold])=>q('arena-wins-'+goal,'Arena Contender · '+goal,'arena','arenaWins',goal,`Win ${goal} Arena battle${goal===1?'':'s'}.`,{gems,gold,xp:goal*10})),
 ...[[1,100,500],[3,150,1200],[10,300,3000]].map(([goal,gems,gold])=>q('event-wins-'+goal,'When Legends Gather · '+goal,'events','eventWins',goal,`Win ${goal} Special Event battle${goal===1?'':'s'}.`,{gems,gold,items:{'awakened-ember':goal===10?3:1},xp:goal*25})),
 ...[[10,150,500],[30,250,1500],[100,500,4000]].map(([goal,gems,gold])=>q('summons-'+goal,'Voices through the Gate · '+goal,'collection','summons',goal,`Summon ${goal} champions in total.`,{gems,gold,xp:100})),
 ...[[20,200,1000],[40,350,2500],[80,500,5000]].map(([goal,gems,gold])=>q('collection-'+goal,'Hall of Legends · '+goal,'collection','collection',goal,`Collect ${goal} different champions.`,{gems,gold,items:{'star-thread':4},xp:200})),
 ...[[500,75,300],[5000,150,1000],[25000,250,2500]].map(([goal,gems,gold])=>q('growth-xp-'+goal,'Strength in the Making · '+goal,'growth','totalXp',goal,`Build ${goal.toLocaleString()} total champion XP through battles, training or quests.`,{gems,gold,items:{'star-thread':3},xp:goal===500?75:250})),
 q('first-ascension','Rise Beyond the Limit','growth','ascensions',1,'Ascend a champion once.',{gems:250,gold:1000,items:{'aether-crystal':2},xp:150}),
 q('five-ascensions','A Rising Warband','growth','ascensions',5,'Complete five ascensions across your roster.',{gems:300,gold:2500,items:{'sovereign-crown':1},xp:400}),
 ...Array.from({length:10},(_,i)=>{const level=(i+1)*10,tier=i+1;return q('keeper-'+level,'Keeper Milestone · '+level,'growth','accountLevel',level,`Reach profile level ${level}.`,{gems:(8+tier*4)*5,gold:200+tier*150+level*8,items:level>=50?{'awakened-ember':tier}:{'aether-crystal':tier},accountXp:0});}),
 q('first-awakening','Beyond the Limit','growth','awakenings',1,'Limit Break a champion for the first time.',{gems:400,gold:3000,items:{'astral-heart':1,'awakened-ember':2},xp:500}),
 // Additional milestones use existing lifetime progress, with one-time rewards.
 ...[[10,200,2200],[15,250,3000]].map(([goal,gems,gold])=>q('hard-road-'+goal,'Through the Cinders · '+goal,'campaign','hard',goal,`Clear Hard campaign stage ${goal}.`,{gems,gold,xp:200,accountXp:75})),
 ...[[5,200,2500],[10,250,3500],[15,300,4500]].map(([goal,gems,gold])=>q('nightmare-road-'+goal,'Nightmare Vanguard · '+goal,'campaign','nightmare',goal,`Clear Nightmare campaign stage ${goal}.`,{gems,gold,xp:300,accountXp:100})),
 ...[[25,100,1000],[75,150,2500]].map(([goal,gems,gold])=>q('campaign-wins-'+goal,'Return to the Road · '+goal,'campaign','wins',goal,`Win ${goal} campaign battles in total, including replays.`,{gems,gold,xp:150,accountXp:75})),
 q('dungeon-wins-60','Veteran of the Depths','dungeons','dungeonWins',60,'Win 60 dungeon battles.',{gems:200,gold:4000,xp:350,items:{'aether-crystal':4},accountXp:100}),
 q('arena-wins-50','Laurels of the Arena','arena','arenaWins',50,'Win 50 Arena battles.',{gems:200,gold:4000,xp:300,accountXp:100}),
 q('event-wins-25','Witness of Wonders','events','eventWins',25,'Win 25 Special Event battles.',{gems:200,gold:4000,xp:350,items:{'awakened-ember':2},accountXp:100}),
 q('summons-200','The Gate Remembers','collection','summons',200,'Summon 200 champions in total.',{gems:250,gold:3000,xp:250,accountXp:100}),
 ...[[120,250,4000],[160,350,6000]].map(([goal,gems,gold])=>q('collection-'+goal,'A Living Chronicle · '+goal,'collection','collection',goal,`Collect ${goal} different champions.`,{gems,gold,xp:300,items:{'star-thread':4},accountXp:100})),
 q('growth-xp-75000','A Warband Forged','growth','totalXp',75000,'Build 75,000 total champion XP through battles, training or quests.',{gems:200,gold:4000,xp:400,accountXp:100}),
 ...[[15,200,3500],[30,250,5000]].map(([goal,gems,gold])=>q('ascensions-'+goal,'Beyond Every Horizon · '+goal,'growth','ascensions',goal,`Complete ${goal} ascensions across your roster.`,{gems,gold,xp:350,items:{'sovereign-crown':2},accountXp:100})),
 q('awakenings-5','Five Brilliant Sparks','growth','awakenings',5,'Complete five Limit Breaks across your roster.',{gems:250,gold:5000,xp:500,items:{'astral-heart':2},accountXp:125}),

 ...TUTORIAL_QUESTS.map(t=>q(t.id,t.name,'growth','tutorial',['resources','combat'].includes(t.metric)?3:1,t.text,{gold:t.gold,gems:t.gems,requires:t.requires,tutorialPage:t.page,accountXp:25})),
];
export function questProgress(profile,quest){if(quest.metric==='tutorial')return tutorialProgress(profile,quest.id);const sum=o=>Object.values(o||{}).reduce((n,v)=>n+v,0);switch(quest.metric){case 'accountLevel':return accountDevelopment(profile.accountXp).level;case 'collection':return uniqueHeroCount(profile);case 'normal':case 'hard':case 'nightmare':return profile.campaignProgress[quest.metric]||0;case 'dungeonTypes':return new Set(Object.keys(profile.dungeonClears).map(id=>id.replace(/-(normal|hard|nightmare)$/,''))).size;case 'totalXp':return sum(profile.heroXp);case 'ascensions':return sum(profile.ascensions);case 'awakenings':return sum(profile.awakenings);default:return profile[quest.metric]||0;}}
export function claimQuest(profile,id,roster=[]){const quest=QUESTS.find(q=>q.id===id);if(!quest||!tutorialQuestAvailable(profile,id)||profile.claimed.includes(id)||questProgress(profile,quest)<quest.goal)return {profile,error:'This quest is not ready to claim.'};let next=addMaterials({...profile,gold:Math.min(999999999,profile.gold+quest.gold),gems:Math.min(GEM_LIMIT,profile.gems+quest.gems),claimed:[...profile.claimed,id]},quest.items);const growth=[];for(const id of new Set(profile.team)){const c=heroForId(roster,id);if(c&&profile.collection[id]&&quest.xp){const before=next.heroXp[id]||0;next=addHeroXp(next,c,quest.xp);growth.push({id,xp:(next.heroXp[id]||0)-before});}}if(quest.championReward&&roster.some(c=>c.id===quest.championReward)){const copy=nextCopyId(next,quest.championReward);next={...next,copySequence:copy.sequence,collection:{...next.collection,[copy.id]:1}};}return {profile:bumpPath(addAccountXp(next,quest.accountXp),{gems:quest.gems}),quest,growth};}
