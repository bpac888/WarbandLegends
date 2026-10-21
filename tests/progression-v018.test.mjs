import {referenceProfile} from './reference-team.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {ASCENSION_CAPS,MATERIALS,tierLevel,currentLevelCap,awakeningRank} from '../src/ascension.js';
import {addHeroXp,ascendChampion,awakenChampion,developedChampion,levelCap,xpForLevel} from '../src/development.js';
import {normalizeProfile,validateProfile} from '../src/progression.js';
import {createBattle,validateSave} from '../src/engine.js';
const roster=JSON.parse(await readFile(new URL('../data/champions.json',import.meta.url)));
const rare=roster.find(c=>c.id==='shieldmaiden_runa');
const rich=c=>({...referenceProfile(),gold:999999,materials:Object.fromEntries(MATERIALS.map(m=>[m.id,999]))});
test('a new ascension tier visibly restarts at 1 while actual level, XP, stats and full Special remain',()=>{
 let p=addHeroXp(rich(rare),rare,999999),before=developedChampion(rare,p),earned=p.heroXp[rare.id];
 assert.deepEqual(tierLevel(p,rare,before.level),{tier:1,level:30,cap:30});
 p=ascendChampion(p,rare,0).profile;const after=developedChampion(rare,p);
 assert.deepEqual(tierLevel(p,rare,after.level),{tier:2,level:1,cap:11});
 assert.equal(p.heroXp[rare.id],earned);assert.equal(after.level,before.level);
 for(const stat of ['atk','def','hp'])assert.ok(after[stat]>before[stat]);
 assert.deepEqual(after.special,before.special);assert.deepEqual(after.passive,before.passive);
 p=addHeroXp(p,rare,999999);assert.deepEqual(tierLevel(p,rare,developedChampion(rare,p).level),{tier:2,level:11,cap:11});
 assert.ok(validateProfile(p,roster));
});
test('two Limit Breaks unlock exactly five levels apiece; Commons cannot Limit Break',()=>{
 let p=rich(rare);for(let tier=0;tier<ASCENSION_CAPS[rare.rarity].length-1;tier++){p=addHeroXp(p,rare,999999);p=ascendChampion(p,rare,tier).profile;}
 p=addHeroXp(p,rare,999999);const normal=ASCENSION_CAPS[rare.rarity].at(-1);
 for(let rank=0;rank<2;rank++){const previous=developedChampion(rare,p),r=awakenChampion(p,rare,rank);assert.ok(!r.error);p=r.profile;assert.equal(currentLevelCap(p,rare),normal+(rank+1)*5);assert.equal(developedChampion(rare,p).level,previous.level);assert.ok(developedChampion(rare,p).atk>previous.atk);assert.ok(awakenChampion(p,rare,rank).error);p=addHeroXp(p,rare,999999);assert.equal(developedChampion(rare,p).level,normal+(rank+1)*5);}
 assert.equal(currentLevelCap(p,rare),levelCap(rare));assert.ok(awakenChampion(p,rare,2).error);assert.ok(validateProfile(p,roster));
 const common=roster.find(c=>c.rarity==='common');assert.equal(levelCap(common),30);assert.ok(awakenChampion({...rich(common),collection:{...rich(common).collection,[common.id]:1}},common,0).error);
});
test('v0.17 Awakening saves migrate to first Limit Break while retaining heroes and resources',()=>{
 const old={...rich(rare),profileVersion:11,heroXp:{[rare.id]:xpForLevel(rare,50)},ascensions:{[rare.id]:2},awakenings:{[rare.id]:3},gems:412,materials:{'awakened-ember':7}};
 const updated=normalizeProfile(old,roster);assert.equal(updated.profileVersion,12);assert.equal(updated.gems,412);assert.equal(updated.materials['awakened-ember'],7);assert.equal(updated.heroXp[rare.id],old.heroXp[rare.id]);assert.equal(updated.awakenings[rare.id],1);assert.equal(awakeningRank(updated,rare),1);assert.ok(validateProfile(updated,roster));
});
test('LB2 gives each role its opening boon once, while lower ranks and sandbox have none',()=>{
 const p=referenceProfile(),heroes=p.team.slice(0,3),base={progression:true,levels:Object.fromEntries(heroes.map(id=>[id,levelCap(roster.find(c=>c.id===id))])),ascensions:Object.fromEntries(heroes.map(id=>{const c=roster.find(c=>c.id===id);return [id,ASCENSION_CAPS[c.rarity].length-1]})),awakenings:Object.fromEntries(heroes.map(id=>[id,2]))};
 const battle=createBattle(roster,p.team,'ashen-gate',438,{...base,levels:{...base.levels,...Object.fromEntries(p.team.slice(3).map(id=>[id,1]))}});
 for(const [index,effect]of [[0,'inc_atk'],[1,'inc_def'],[2,'mana_surge']]){assert.equal(battle.heroes[index].effects[effect].turns,2);assert.equal(battle.heroes[index].awakening,2);}
 assert.ok(validateSave(battle,roster));
 const sandbox=createBattle(roster,p.team,'ashen-gate',438,{...base,sandbox:true});assert.ok(sandbox.heroes.slice(0,3).every(h=>!Object.keys(h.effects).length));
 const lower=createBattle(roster,p.team,'ashen-gate',438,{...base,awakenings:{[heroes[0]]:1}});assert.equal(lower.heroes[0].effects.inc_atk,undefined);
});
