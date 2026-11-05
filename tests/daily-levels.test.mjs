import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {defaultProfile,normalizeProfile,validateProfile,awardVictory} from '../src/progression.js';
import {bumpPath,pathStatus,claimPath,playerDate} from '../src/keeper.js';
import {addHeroXp,xpForLevel} from '../src/development.js';
import {heroForId} from '../src/hero-copies.js';
import {makeBackup,parseBackup} from '../src/save-files.js';
const roster=JSON.parse(fs.readFileSync(new URL('../data/champions.json',import.meta.url))),now=new Date('2026-12-02T12:00:00Z');
const heroes=roster.filter(c=>c.rarity==='rare').slice(0,2);
function seed(){const p=defaultProfile();for(const c of heroes)p.collection[c.id]=1;return p;}
test('daily growth accumulates for the same character, not pooled across heroes or copies',()=>{
 const [a,b]=heroes;let p=seed();
 p=addHeroXp(p,a,xpForLevel(a,3),now);assert.equal(pathStatus(p,now).levels,2);
 p=addHeroXp(p,b,xpForLevel(b,3),now);assert.equal(pathStatus(p,now).levels,2);
 const copy=heroForId(roster,a.id+'~1');p.collection[copy.id]=1;p.copySequence=1;p=addHeroXp(p,copy,xpForLevel(copy,2),now);assert.equal(pathStatus(p,now).levels,2);
 p=addHeroXp(p,a,xpForLevel(a,4)-p.heroXp[a.id],now);assert.equal(pathStatus(p,now).levels,3);
 assert.equal(p.pathHeroLevels[a.id],3);assert.equal(p.pathHeroLevels[b.id],2);assert.equal(p.pathHeroLevels[copy.id],1);
 assert.ok(validateProfile(p,roster));assert.deepEqual(normalizeProfile(p,roster),p);assert.deepEqual(parseBackup(JSON.stringify(makeBackup(p,null)),roster).profile,p);
});
test('growth resets at the Los Angeles day boundary, and clock rollback cannot add progress',()=>{
 const [c]=heroes,p=addHeroXp(seed(),c,xpForLevel(c,4),now);
 assert.equal(pathStatus(p,new Date('2026-12-03T07:59:59Z')).levels,3);
 assert.equal(pathStatus(p,new Date('2026-12-03T08:00:00Z')).levels,0);
 const next=addHeroXp(p,c,xpForLevel(c,5)-p.heroXp[c.id],new Date('2026-12-03T08:00:00Z'));
 assert.equal(pathStatus(next,new Date('2026-12-03T08:00:00Z')).levels,1);
 assert.equal(bumpPath(next,{heroId:c.id,levels:1},now),next);
 assert.equal(bumpPath(p,{heroId:c.id,levels:-1},now),p);
});
test('the daily chest needs all four objectives, awards once, and retains completed growth if the hero is later consumed',()=>{
 const [c]=heroes;let p=bumpPath(seed(),{wins:2,gems:150,summons:1},now);assert.ok(claimPath(p,now).error);
 p=addHeroXp(p,c,xpForLevel(c,4),now);delete p.collection[c.id];delete p.heroXp[c.id];
 assert.ok(validateProfile(p,roster));assert.equal(normalizeProfile(p,roster).pathHeroLevels[c.id],3);
 const result=claimPath(p,now);assert.equal(result.error,undefined);assert.equal(result.profile.accountXp,p.accountXp+50);assert.equal(result.profile.gold,p.gold+400);assert.equal(result.profile.gems,p.gems+125);
 assert.equal(claimPath(result.profile,now).profile,result.profile);
});
test('battle XP records actual levels gained and cannot be credited again for the same victory',()=>{
 const p=defaultProfile(),c=heroForId(roster,p.team[0]),battle={id:'daily-level-win',stageId:'ashen-gate',phase:'victory',progression:true,heroes:[{id:c.id}]};
 p.heroXp[c.id]=xpForLevel(c,2)-1;
 const won=awardVictory(p,battle,roster,now.getTime());assert.equal(won.pathDate,playerDate(now));assert.ok(won.pathHeroLevels[c.id]>=1);
 assert.equal(awardVictory(won,battle,roster,now.getTime()),won);
 const capped=addHeroXp(won,c,Number.MAX_SAFE_INTEGER,now),again=addHeroXp(capped,c,1,now);assert.equal(again,capped);
});
test('invalid growth fields are rejected and normalized safely; older profiles start at zero',()=>{
 for(const pathHeroLevels of [[],null,{missing:3},{[heroes[0].id]:-1},{[heroes[0].id]:4},{[heroes[0].id]:1.5}]){const p={...seed(),pathHeroLevels};assert.equal(validateProfile(p,roster),false);assert.ok(validateProfile(normalizeProfile(p,roster),roster));}
 const legacy=seed();delete legacy.pathHeroLevels;assert.ok(validateProfile(legacy,roster));assert.deepEqual(normalizeProfile(legacy,roster).pathHeroLevels,{});
});
