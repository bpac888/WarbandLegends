import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {CHAMPIONSHIP_TIERS,championshipStanding,championshipReward} from '../src/championship-catalog.js';
import {championshipWeek,emptyChampionships} from '../src/championships.js';
import {championshipTeamError,championshipSnapshot,createChampionshipBattle,replayChampionship} from '../src/championship-battle.js';
import {levelCap} from '../src/development.js';
import {defaultProfile} from '../src/progression.js';import {validMoves,swap} from '../src/engine.js';import {applyAutoAction} from '../src/auto-battle.js';
const roster=JSON.parse(fs.readFileSync(new URL('../data/champions.json',import.meta.url))),profile=defaultProfile();
test('Championship promotions require active wins; passive wins never promote',()=>{
 let s={score:110,tier:0};s=championshipStanding(s,'defense-win');assert.equal(s.tier,0);assert.equal(s.score,110);s=championshipStanding(s,'attack-win');assert.equal(s.tier,1);assert.equal(s.score,140);assert.equal(s.strikes,undefined);
});
test('defense defeats cost one point and tiers follow their point thresholds',()=>{
 let s={score:123,tier:1,strikes:2};for(let i=0;i<4;i++){s=championshipStanding(s,'defense-loss');assert.equal(s.score,122-i);assert.equal(s.tier,i===3?0:1);assert.equal(s.strikes,undefined);}assert.equal(s.defenseLosses,4);
 assert.equal(championshipStanding({score:600,tier:3},'defense-loss').tier,2);
});
test('active defeats cost ten points; all losses clamp at zero and cannot promote',()=>{
 assert.equal(championshipStanding({score:120,tier:1},'attack-loss').score,110);
 for(const event of ['attack-loss','defense-loss']){assert.equal(championshipStanding({score:999,tier:0},event).tier,0);assert.equal(championshipStanding({score:0,tier:0},event).score,0);}
});
test('weekly reward bands cover exactly places 1–50 without overlap',()=>{for(let i=1;i<=50;i++)assert.ok(championshipReward(i));assert.equal(championshipReward(4).from,4);assert.equal(championshipReward(25).to,25);assert.equal(championshipReward(26).from,26);assert.equal(championshipReward(51),null);assert.equal(championshipReward(0),null);assert.equal(CHAMPIONSHIP_TIERS.length,4);});
test('weekly cutoff follows Monday midnight Pacific through daylight savings',()=>{
 for(const [date,key,reset] of [['2026-11-16T07:59:59Z','2026-11-09','2026-11-16T08:00:00.000Z'],['2026-11-16T08:00:00Z','2026-11-16','2026-11-23T08:00:00.000Z'],['2027-03-15T06:59:59Z','2027-03-08','2027-03-15T07:00:00.000Z']]){const w=championshipWeek(new Date(date));assert.equal(w.key,key);assert.equal(w.reset.toISOString(),reset);}
});
test('team validation rejects unowned, repeated and missing heroes without changing campaign team',()=>{
 const before=JSON.stringify(profile);assert.equal(championshipTeamError(profile.team,profile,roster),null);assert.match(championshipTeamError(profile.team.slice(1),profile,roster),/five/);assert.match(championshipTeamError(Array(5).fill(profile.team[0]),profile,roster),/five/);assert.match(championshipTeamError([...profile.team.slice(1),'yshmir_worldwound'],profile,roster),/collection/);championshipSnapshot(profile,profile.team,roster);assert.equal(JSON.stringify(profile),before);
});
test('five saved defense heroes retain real stats, upgrades, lanes, Specials and faction bonuses',()=>{
 const snapshot=championshipSnapshot(profile,profile.team,roster),state=createChampionshipBattle(roster,snapshot,snapshot,441,'ranked-match');assert.equal(state.enemies.length,5);assert.deepEqual(state.heroes.map(h=>h.hp),state.enemies.map(h=>h.hp));assert.deepEqual(state.enemies.flatMap(e=>e.lanes),[0,1,2,3,4,5,6]);assert.ok(state.enemies.every(e=>e.special&&e.championshipDefender));assert.ok(state.enemies.every(e=>e.level===1));assert.equal(state.championship.practice,false);
 const loan=championshipSnapshot(profile,profile.team,roster,{loan:true}),practice=createChampionshipBattle(roster,loan,snapshot,441,'loan',{practice:true});assert.ok(practice.heroes.every(h=>h.level===Math.min(40,levelCap(h))));assert.ok(practice.heroes[0].hp>state.heroes[0].hp);
});
test('replays reproduce actual seeded actions and reject invented or post-terminal actions',()=>{
 const snapshot=championshipSnapshot(profile,profile.team,roster),initial=createChampionshipBattle(roster,snapshot,snapshot,412,'verified'),[a,b]=validMoves(initial.board)[0],action={kind:'swap',a,b};assert.deepEqual(replayChampionship(initial,[action]),applyAutoAction(initial,action).state);assert.throws(()=>replayChampionship(initial,[{kind:'award-victory'}]));assert.throws(()=>replayChampionship(initial,[{kind:'swap',a:-1,b:100}]));assert.throws(()=>replayChampionship({...initial,phase:'victory'},[action]));assert.throws(()=>replayChampionship(initial,Array(601).fill(action)));
});
test('unavailable Championships contain no practice teams, rivals or standings',()=>{
 const state=emptyChampionships();assert.equal(state.available,false);assert.deepEqual(state.rankings,[]);assert.deepEqual(state.opponents,[]);assert.deepEqual(state.standing,{});assert.equal(state.teams,undefined);
});
test('a five-champion defense receives its own Magic faction bonuses',()=>{
 const ids=[...roster.filter(c=>c.faction==='magic').slice(0,3).map(c=>c.id),...profile.team.slice(0,2)],s=championshipSnapshot(profile,ids,roster,{loan:true}),state=createChampionshipBattle(roster,s,s,318,'faction-defense');assert.ok(state.enemies.every(e=>e.factionManaBonus===.15));assert.deepEqual(state.heroes.map(h=>[h.hp,h.atk,h.def,h.factionTier]),state.enemies.map(h=>[h.hp,h.atk,h.def,h.factionTier]));
});
