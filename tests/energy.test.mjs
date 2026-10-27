import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {defaultProfile,normalizeProfile,validateProfile,awardVictory} from '../src/progression.js';
import {energyCap,energyStatus,refreshEnergy,spendEnergy,energyCost,addAccountXp,accountThreshold,playerDate} from '../src/keeper.js';
import {getEncounter,ENCOUNTERS} from '../src/encounters.js';
import {reserveEntry} from '../src/mode-progression.js';
import {ASCENSION_CAPS} from '../src/ascension.js';
import {xpForLevel} from '../src/development.js';
import {makeBackup,parseBackup} from '../src/save-files.js';
const roster=JSON.parse(await readFile(new URL('../data/champions.json',import.meta.url)));
const now=new Date('2026-12-02T12:00:00Z');
const fresh=()=>({...defaultProfile(),energyDate:playerDate(now)});
test('energy starts full, grows with profile level, caps at 150, and never overfills',()=>{
 const p=fresh();assert.equal(p.energy,51);assert.equal(energyCap(p),51);
 assert.equal(energyCap({...p,accountXp:accountThreshold(50)}),100);
 const max=addAccountXp({...p,energy:0},999999999);assert.equal(max.energy,150);assert.equal(energyCap(max),150);
 assert.equal(refreshEnergy({...p,energy:999},now).energy,51);
 assert.equal(refreshEnergy({...p,energy:-1},now).energy,51);
});
test('a daily refill is all at once at midnight, only once per day, with no gradual regeneration',()=>{
 const p={...fresh(),energy:2,energyDate:'2026-12-01'};
 assert.equal(energyStatus(p,new Date('2026-12-02T07:59:59Z')).current,2);
 const reset=refreshEnergy(p,new Date('2026-12-02T08:00:00Z'));assert.equal(reset.energy,51);assert.equal(reset.energyDate,'2026-12-02');
 const spent=spendEnergy(reset,getEncounter('ashen-gate'),now).profile;assert.equal(refreshEnergy(spent,new Date('2026-12-03T07:59:59Z')).energy,50);
 assert.equal(refreshEnergy(spent,new Date('2026-12-01T12:00:00Z')).energy,50);
 assert.equal(refreshEnergy(spent,new Date('2026-12-10T12:00:00Z')).energy,51);
 const summer={...p,energyDate:'2026-10-19'};assert.equal(energyStatus(summer,new Date('2026-10-20T06:59:59Z')).current,2);assert.equal(energyStatus(summer,new Date('2026-10-20T07:00:00Z')).current,51);
});
test('profile level-ups refill immediately, including multi-level gains, but ordinary XP does not',()=>{
 const p={...fresh(),energy:0};const partial=addAccountXp(p,50);assert.equal(partial.energy,0);
 const level2=addAccountXp(partial,50);assert.equal(level2.energy,52);
 const level50=addAccountXp(p,accountThreshold(50));assert.equal(level50.energy,100);
});
test('campaign and dungeon costs are 1/2/3, Arena is 1, and event energy is always zero',()=>{
 for(const mode of ['campaign','dungeon'])for(const [difficulty,cost]of [['normal',1],['hard',2],['nightmare',3]]){
  const e=ENCOUNTERS.find(e=>e.mode===mode&&e.difficulty===difficulty);assert.equal(energyCost(e),cost);
  assert.equal(spendEnergy(fresh(),e,now).profile.energy,51-cost);
  const low={...fresh(),energy:cost-1},r=spendEnergy(low,e,now);assert.ok(r.error);assert.deepEqual(r.profile,low);
 }
 assert.equal(energyCost(ENCOUNTERS.find(e=>e.mode==='arena')),1);
 const free=spendEnergy({...fresh(),energy:0},ENCOUNTERS.find(e=>e.mode==='event'),now);assert.ok(!free.error);assert.equal(free.profile.energy,0);
});
test('entry is charged once, even if reserved twice; quitting, losses and playtesting grant no refund',()=>{
 const b={id:'energy-entry',stageId:'ashen-gate',phase:'playing',sandbox:false};const r=reserveEntry(fresh(),b,now);assert.equal(r.profile.energy,50);assert.equal(r.battle.energySpent,1);
 assert.equal(reserveEntry(r.profile,r.battle,now).profile.energy,50);
 const sandbox=reserveEntry(fresh(),{...b,id:'playtest',sandbox:true},now);assert.equal(sandbox.profile.energy,50);
 const low=reserveEntry({...fresh(),energy:0},b,now);assert.ok(low.error);assert.equal(low.profile.energy,0);
});
test('old profiles receive full energy without losing progress; saves persist current energy and reject invalid current fields',()=>{
 const old={...fresh(),profileVersion:12,accountXp:accountThreshold(50),gold:2345};delete old.energy;delete old.energyDate;
 const migrated=normalizeProfile(old,roster);assert.equal(migrated.energy,100);assert.equal(migrated.gold,2345);assert.deepEqual(migrated.team,old.team);assert.ok(validateProfile(migrated,roster));
 const spent={...migrated,energy:7};assert.deepEqual(parseBackup(JSON.stringify(makeBackup(spent,null)),roster).profile,spent);
 for(const patch of [{energy:-1},{energy:101},{energy:1.5},{energyDate:'bad'}])assert.equal(validateProfile({...migrated,...patch},roster),false);
 assert.equal(parseBackup(JSON.stringify(makeBackup(old,null)),roster).profile.energy,100);
});

test('version-12 migration preserves both Limit Breaks, ascension tiers and earned hero XP',()=>{
 const p=fresh(),c=roster.find(c=>c.id===p.team[0]),tier=ASCENSION_CAPS[c.rarity].length-1,xp=xpForLevel(c,ASCENSION_CAPS[c.rarity].at(-1)+10);
 const old={...p,profileVersion:12,ascensions:{[c.id]:tier},awakenings:{[c.id]:2},heroXp:{[c.id]:xp}};delete old.energy;delete old.energyDate;
 const next=normalizeProfile(old,roster);assert.equal(next.awakenings[c.id],2);assert.equal(next.heroXp[c.id],xp);assert.equal(next.ascensions[c.id],tier);assert.ok(validateProfile(next,roster));
});

test('a victory on the last Energy still awards rewards and a level-up refill',()=>{
 const p={...fresh(),accountXp:99,energy:1},r=reserveEntry(p,{id:'last-energy-win',stageId:'ashen-gate',phase:'playing',sandbox:false},now);
 assert.equal(r.profile.energy,0);const won=awardVictory(r.profile,{...r.battle,phase:'victory'},roster);assert.equal(won.energy,52);assert.ok(won.gems>p.gems);assert.ok(won.recorded.includes('last-energy-win'));
});
