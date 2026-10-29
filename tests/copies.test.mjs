import test from 'node:test';import assert from 'node:assert/strict';import {readFile} from 'node:fs/promises';
import {defaultProfile,normalizeProfile,validateProfile,summon,awardVictory} from '../src/progression.js';
import {heroForId,battleRoster,ownedHeroes,uniqueHeroCount} from '../src/hero-copies.js';
import {addHeroXp,developedChampion,development,heroDevelopment,levelCap} from '../src/development.js';
import {feedingQuote,consumeHeroes} from '../src/feeding.js';
import {makeBackup,parseBackup} from '../src/save-files.js';
import {createBattle,validateSave} from '../src/engine.js';
import {questProgress,QUESTS} from '../src/quests.js';
const roster=JSON.parse(await readFile(new URL('../data/champions.json',import.meta.url)));
const summonCommon=p=>summon(p,roster,()=>0);
test('duplicate copies have independent XP, can fight together, and survive a saved battle',()=>{
 let p=defaultProfile();p.gems=5000;const a=summonCommon(p);p=a.profile;const b=summonCommon(p);p=b.profile;
 assert.notEqual(a.copyId,b.copyId);assert.equal(uniqueHeroCount(p),6);assert.equal(ownedHeroes(p,roster).length,7);
 const original=heroForId(roster,a.copyId),duplicate=heroForId(roster,b.copyId);p=addHeroXp({...p},original,1000);
 assert.ok(developedChampion(original,p).level>1);assert.equal(developedChampion(duplicate,p).level,1);
 p.team=[a.copyId,b.copyId,...p.team.slice(0,3)];p.teamSlots[0]=[...p.team];assert.ok(validateProfile(p,roster));
 const available=battleRoster(p,roster),fight=createBattle(available,p.team,'ashen-gate',43,{progression:true,levels:Object.fromEntries(p.team.map(id=>[id,development(heroForId(roster,id),p.heroXp[id]).level]))});
 assert.equal(fight.heroes[0].id,a.copyId);assert.equal(fight.heroes[1].id,b.copyId);assert.ok(fight.heroes[0].atk>fight.heroes[1].atk);assert.ok(validateSave(fight,available));
 assert.deepEqual(parseBackup(JSON.stringify(makeBackup(p,fight)),roster),{profile:p,battle:fight});
 fight.phase='victory';fight.enemies.forEach(e=>e.hp=0);const won=awardVictory(p,fight,roster);
 assert.ok(won.heroXp[a.copyId]>p.heroXp[a.copyId]);assert.ok(won.heroXp[b.copyId]>0);assert.equal(questProgress(won,QUESTS.find(q=>q.id==='ten-champions')),6);
});
test('Common feeding costs gold, applies color bonus, and consumes only selected spare copies',()=>{
 let p=defaultProfile();p.gems=5000;const a=summonCommon(p),b=summonCommon(a.profile),donor=b.copyId,target=heroForId(roster,p.team[0]);p=b.profile;
 const profileBefore=structuredClone(p),q=feedingQuote(p,target,[donor],roster);assert.ok(!q.error);assert.equal(q.gold,25);assert.ok(q.gained>0);
 const r=consumeHeroes(p,target,[donor],roster,{expectedXp:0});assert.ok(!r.error);assert.equal(r.profile.gold,p.gold-25);assert.equal(r.profile.collection[donor],undefined);assert.equal(r.profile.collection[a.copyId],1);assert.equal(r.profile.heroXp[target.id],q.gained);assert.deepEqual(p,profileBefore);assert.ok(validateProfile(r.profile,roster));
 assert.ok(consumeHeroes(r.profile,target,[donor],roster,{expectedXp:q.gained}).error);
});
test('Common feeding protects active and saved heroes, rejects stale or repeated selections and preserves five heroes',()=>{
 let p=defaultProfile();p.gems=5000;const c=summonCommon(p);p=c.profile;const target=heroForId(roster,p.team[0]),donor=c.copyId;
 assert.ok(feedingQuote(p,target,[p.team[1]],roster).error);assert.ok(feedingQuote(p,target,[donor,donor],roster).error);
 p.teamSlots[0]=[donor,...p.team.slice(0,4)];assert.ok(feedingQuote(p,target,[donor],roster).error);p.teamSlots[0]=null;
 const b=createBattle(battleRoster(p,roster),[donor,...p.team.slice(0,4)],'ashen-gate',4,{progression:true});assert.ok(feedingQuote(p,target,[donor],roster,{battle:b}).error);
 assert.ok(consumeHeroes(p,target,[donor],roster,{expectedXp:99}).error);
 const only={...p,collection:Object.fromEntries(Object.entries(p.collection).filter(([id])=>id!==p.team[4]))};assert.ok(feedingQuote(only,target,[donor],roster).error);
});
test('schema 9 saves migrate counted copies without sharing further growth',()=>{
 const old=defaultProfile();old.profileVersion=9;delete old.copySequence;old.collection[old.team[0]]=3;old.heroXp[old.team[0]]=200;
 const migrated=normalizeProfile(old,roster),copies=Object.keys(migrated.collection).filter(id=>id===old.team[0]||id.startsWith(old.team[0]+'~'));
 assert.equal(migrated.profileVersion,13);assert.equal(copies.length,3);assert.equal(migrated.heroXp[old.team[0]],200);assert.equal(migrated.heroXp[copies[1]],undefined);assert.ok(validateProfile(migrated,roster));assert.equal(migrated.team[0],old.team[0]);assert.deepEqual(parseBackup(JSON.stringify(makeBackup(old,null)),roster).profile,migrated);
});
test('a duplicate can ascend and Limit Break without changing its sibling',async()=>{
 const {MATERIALS,ascensionTier,awakeningRank,ASCENSION_CAPS}=await import('../src/ascension.js');const {ascendChampion,awakenChampion,levelCap}=await import('../src/development.js');
 let p={...defaultProfile(),gems:5000,gold:999999,materials:Object.fromEntries(MATERIALS.map(m=>[m.id,999]))};const rare=()=>{let n=0;return ()=>n++%2===0?.5:0;};const first=summon(p,roster,rare()),second=summon(first.profile,roster,rare());p=second.profile;
 const a=heroForId(roster,first.copyId),b=heroForId(roster,second.copyId);p={...p};for(let tier=0;tier<ASCENSION_CAPS[b.rarity].length-1;tier++){p=addHeroXp(p,b,999999);const asc=ascendChampion(p,b,tier);assert.ok(!asc.error);p=asc.profile;}assert.equal(ascensionTier(p,b),2);assert.equal(ascensionTier(p,a),0);
 p=addHeroXp(p,b,999999);const limit=awakenChampion(p,b,0);assert.ok(!limit.error);assert.equal(awakeningRank(limit.profile,b),1);assert.equal(awakeningRank(limit.profile,a),0);assert.equal(developedChampion(a,limit.profile).level,1);assert.ok(validateProfile(limit.profile,roster));
});
