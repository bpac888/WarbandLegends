import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {FIRST_TOURNAMENT_MONTH,TOURNAMENT_RULES,tournamentCalendar,tournamentRule,tournamentTeamError} from '../src/tournaments.js';
import {defaultProfile} from '../src/progression.js';
const roster=JSON.parse(fs.readFileSync(new URL('../data/champions.json',import.meta.url))),base=defaultProfile(),all={...base,collection:Object.fromEntries(roster.map(c=>[c.id,1]))};
test('first signup opens January 30 Pacific, battles February 1, with exact boundaries',()=>{
 assert.equal(FIRST_TOURNAMENT_MONTH,'2027-02-01');for(const [time,phase]of [['2027-01-30T07:59:59Z','upcoming'],['2027-01-30T08:00:00Z','signup'],['2027-02-01T07:59:59Z','signup'],['2027-02-01T08:00:00Z','active']]){const c=tournamentCalendar(new Date(time));assert.equal(c.month,FIRST_TOURNAMENT_MONTH);assert.equal(c.phase,phase);assert.equal(c.startsAt,'2027-02-01T08:00:00.000Z');}
 assert.equal(tournamentCalendar(new Date('2027-03-01T08:00:00Z'),'2027-02-01').phase,'closed');
});
test('all eleven rule sets rotate monthly and Pacific daylight saving is respected',()=>{
 assert.equal(TOURNAMENT_RULES.length,11);for(let i=0;i<22;i++){const m=new Date(Date.UTC(2027,1+i,1)).toISOString().slice(0,10);assert.equal(tournamentRule(m).id,TOURNAMENT_RULES[i%11].id);}
 const april=tournamentCalendar(new Date('2027-03-31T07:00:00Z'),'2027-04-01');assert.equal(april.signupOpensAt,'2027-03-30T07:00:00.000Z');assert.equal(april.startsAt,'2027-04-01T07:00:00.000Z');
 assert.throws(()=>tournamentRule('2027-01-01'));assert.throws(()=>tournamentRule('2027-02-02'));
});
test('each rule accepts only the specified rarities and colors, including champion copies',()=>{
 for(let i=0;i<11;i++){const month=new Date(Date.UTC(2027,1+i,1)).toISOString().slice(0,10),rule=TOURNAMENT_RULES[i],allowed=c=>(!rule.rarities||rule.rarities.includes(c.rarity))&&!rule.bannedRarities?.includes(c.rarity)&&(!rule.colors||rule.colors.includes(c.color))&&!rule.bannedColors?.includes(c.color),eligible=roster.filter(allowed).slice(0,5).map(c=>c.id),bad=roster.find(c=>!allowed(c));assert.equal(tournamentTeamError(eligible,all,roster,month),null,rule.id);assert.match(tournamentTeamError([bad.id,...eligible.slice(1)],all,roster,month),/does not follow/,rule.id);}
 const rare=roster.find(c=>c.rarity==='rare'),ids=[rare.id+'~1',...roster.filter(c=>c.rarity==='rare'&&c.id!==rare.id).slice(0,4).map(c=>c.id)],p={...all,collection:{...all.collection,[rare.id+'~1']:1}};assert.equal(tournamentTeamError(ids,p,roster,'2027-02-01'),null);assert.match(tournamentTeamError(ids,all,roster,'2027-02-01'),/collection/);
});
test('ownership, five distinct heroes and normal play are required for tournament teams',()=>{
 const rare=roster.filter(c=>c.rarity==='rare').slice(0,5).map(c=>c.id);assert.match(tournamentTeamError(rare.slice(1),all,roster,'2027-02-01'),/five/);assert.match(tournamentTeamError(Array(5).fill(rare[0]),all,roster,'2027-02-01'),/five/);assert.match(tournamentTeamError(rare,base,roster,'2027-02-01'),/collection/);assert.match(tournamentTeamError(rare,{...all,openRoster:true},roster,'2027-02-01'),/playtesting/);
});
