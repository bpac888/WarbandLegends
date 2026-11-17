import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {defaultProfile,normalizeProfile,validateProfile} from '../src/progression.js';
import {championshipWins,recordChampionshipProgress,validChampionshipProgress} from '../src/championship-progress.js';
import {QUESTS,questProgress,claimQuest} from '../src/quests.js';import {questsPage} from '../src/quest-ui.js';
const roster=JSON.parse(fs.readFileSync(new URL('../data/champions.json',import.meta.url))),player='player-one',quest=id=>QUESTS.find(q=>q.id===id);
const dashboard=(week='2026-11-16',wins=0,tier=0,awards=[])=>({playerId:player,preview:false,week,standing:{attack_wins:wins,tier},awards});
const record=(p,data)=>recordChampionshipProgress(p,data,player);
test('verified season totals count once across retries, reloads, older snapshots and weekly resets',()=>{
 const original=defaultProfile();let p=record(original,dashboard('2026-11-16',5,1));assert.equal(championshipWins(original),0);assert.equal(championshipWins(p),5);assert.equal(record(p,dashboard('2026-11-16',5,1)),p);assert.equal(record(p,dashboard('2026-11-16',4,0)),p);
 p=record(p,dashboard('2026-11-16',7,2));p=record(normalizeProfile(p,roster),dashboard('2026-11-23',0,0));assert.equal(championshipWins(p),7);assert.equal(p.championshipProgress.highestTier,2);
 p=record(p,dashboard('2026-11-23',2,0,[{week:'2026-11-16',rank:20,snapshot:{attack_wins:6,tier:1}},{week:'2026-11-09',rank:15,snapshot:{attack_wins:3,tier:1}}]));assert.equal(championshipWins(p),12);assert.equal(p.championshipProgress.highestTier,2);assert.ok(validateProfile(p,roster));
 assert.deepEqual(normalizeProfile(JSON.parse(JSON.stringify(p)),roster),p);
});
test('practice data, unavailable dashboards, wrong accounts and invented result flags cannot add milestones',()=>{
 const p=defaultProfile(),data=dashboard('2026-11-16',100,3);for(const invalid of [{...data,preview:true},{...data,available:false},{...data,playerId:'someone-else'},{...data,week:'2026-02-30'},{playerId:player,victory:true}])assert.equal(record(p,invalid),p);assert.equal(recordChampionshipProgress(p,data,null),p);const sandbox={...p,openRoster:true};assert.equal(record(sandbox,data),sandbox);
});
test('weekly placement milestones require finalized awards; second and third are distinct achievements',()=>{
 let p=record(defaultProfile(),{...dashboard('2026-11-16',5,1),rank:1});assert.equal(questProgress(p,quest('championship-finish-1')),0);assert.equal(questProgress(p,quest('championship-podium-2')),0);
 p=record(p,dashboard('2026-11-23',0,0,[{week:'2026-11-16',rank:3,snapshot:{attack_wins:5,tier:1}}]));assert.equal(questProgress(p,quest('championship-podium-3')),1);assert.equal(questProgress(p,quest('championship-podium-2')),0);assert.equal(questProgress(p,quest('championship-finish-10')),1);
 p=record(p,dashboard('2026-11-30',0,0,[{week:'2026-11-23',rank:2}]));assert.equal(questProgress(p,quest('championship-podium-2')),1);p=record(p,dashboard('2026-12-07',0,0,[{week:'2026-11-30',rank:1}]));assert.equal(questProgress(p,quest('championship-finish-1')),1);assert.deepEqual(p.championshipProgress.podiumPlaces,[1,2,3]);
 const invalid=record(defaultProfile(),dashboard('2026-11-16',0,0,[{week:'2026-11-16',rank:1},{week:'bad-date',rank:2},{week:'2026-11-09',rank:0}]));assert.equal(invalid.championshipProgress.bestWeeklyRank,0);
});
test('all 16 Championship quests deliver their rewards once, including 500 and 1000 lifetime wins',()=>{
 let p=defaultProfile();for(let i=0;i<10;i++){const date=new Date(Date.UTC(2026,7,31+i*7)).toISOString().slice(0,10);p=record(p,dashboard(date,100,3));}p=record(p,dashboard('2026-11-16',0,0,[{week:'2026-11-09',rank:1},{week:'2026-11-02',rank:2},{week:'2026-10-26',rank:3}]));assert.equal(championshipWins(p),1000);
 const quests=QUESTS.filter(q=>q.category==='championships');assert.equal(quests.length,16);const before=structuredClone(p);for(const q of quests){assert.ok(questProgress(p,q)>=q.goal,q.id);const result=claimQuest(p,q.id,roster);assert.equal(result.error,undefined,q.id);assert.equal(result.profile.gems,p.gems+q.gems);assert.equal(result.profile.gold,p.gold+q.gold);assert.ok(claimQuest(result.profile,q.id,roster).error);p=result.profile;}assert.equal(before.claimed.length,0);assert.equal(p.claimed.length,16);assert.ok(validateProfile(p,roster));assert.ok(p.claimed.includes('championship-wins-500'));assert.ok(p.claimed.includes('championship-wins-1000'));
});
test('legacy profiles preserve resources; malformed counters are sanitized and all Continue actions lead to Championships',()=>{
 const p=defaultProfile();delete p.championshipProgress;const legacy=normalizeProfile(p,roster);assert.equal(legacy.gold,p.gold);assert.deepEqual(legacy.team,p.team);assert.equal(championshipWins(legacy),0);assert.ok(validateProfile(legacy,roster));
 const malformed={...legacy,championshipProgress:{winsByWeek:{'2026-11-16':-1,'2026-02-30':20,'2026-11-09':3},highestTier:99,bestWeeklyRank:-1,podiumPlaces:[2,2,99]}};assert.equal(validChampionshipProgress(malformed),false);const clean=normalizeProfile(malformed,roster);assert.equal(championshipWins(clean),3);assert.equal(clean.championshipProgress.highestTier,0);assert.deepEqual(clean.championshipProgress.podiumPlaces,[2]);assert.ok(validateProfile(clean,roster));
 const html=questsPage(legacy,{limit:200});assert.equal((html.match(/quest-category-championships/g)||[]).length,16);assert.equal((html.match(/data-page="championships"/g)||[]).length,16);assert.equal((html.match(/quest-championship-thumbnail/g)||[]).length,16);assert.ok(!html.includes('NaN'));
});
