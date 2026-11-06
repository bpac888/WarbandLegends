import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {createBattle,cast,validateSave} from '../src/engine.js';
import {defaultProfile,summon,normalizeProfile,validateProfile} from '../src/progression.js';
import {makeBackup,parseBackup} from '../src/save-files.js';
import {chooseAutoAction,applyAutoAction} from '../src/auto-battle.js';
import {REFERENCE_TEAM} from './reference-team.mjs';
const read=async p=>JSON.parse(await readFile(new URL('../'+p,import.meta.url)));
const roster=(await read('data/champions.json')).slice(0,234),manifest=await read('data/roster-expansion-8.json'),hero=roster.find(c=>c.id==='ondelle_lilywake_huntress');
const hash=x=>createHash('sha256').update(JSON.stringify(x)).digest('hex');

test('Ondelle completes all thirteen factions without changing any of the previous 233 characters or portraits',async()=>{
 assert.equal(roster.length,234);assert.equal(new Set(roster.map(c=>c.id)).size,234);
 assert.equal(hash(roster.slice(0,233)),manifest.originalRecordsSha256);
 assert.equal(hash((await read('data/source-champions.json')).slice(0,233)),manifest.originalSourceRecordsSha256);
 const portraits=[];for(const c of roster.slice(0,233))portraits.push({id:c.id,sha256:createHash('sha256').update(await readFile(new URL('../'+c.portrait,import.meta.url))).digest('hex')});
 assert.equal(hash(portraits),manifest.originalPortraitsSha256);
 assert.deepEqual(manifest.addedChampionIds,[hero.id]);
 const factions=[...new Set(roster.map(c=>c.faction))];assert.equal(factions.length,13);for(const faction of factions)assert.equal(roster.filter(c=>c.faction===faction).length,18,faction);
 assert.equal(hero.faction,'wildgrove');assert.equal(hero.color,'blue');assert.equal(hero.rarity,'rare');assert.equal(hero.role,'attack');
 const peers=roster.slice(0,233).filter(c=>c.rarity==='rare'&&c.role==='attack');for(const stat of ['atk','def','hp']){const values=peers.map(c=>c[stat]).sort((a,b)=>a-b),median=values[Math.floor(values.length/2)];assert.ok(Math.abs(hero[stat]/median-1)<.1,stat);}
});

test('Lilywake Undertow spends ten charge, damages only its target, and applies two-turn Mana Slow',()=>{
 const b=createBattle(roster,[hero.id,...REFERENCE_TEAM.slice(0,4)],'ashen-gate',42);
 for(const e of b.enemies){e.hp=e.maxHp=100000;e.effects={};e.passive=null;}
 b.heroes[0].mana=10;const before=structuredClone(b),r=cast(b,'hero-0','enemy-1',1);
 assert.ok(!r.error);assert.deepEqual(b,before);assert.ok(validateSave(r.state,roster));assert.equal(r.state.heroes[0].mana,0);
 assert.equal(r.state.enemies[0].hp,b.enemies[0].hp);assert.equal(r.state.enemies[2].hp,b.enemies[2].hp);assert.ok(r.state.enemies[1].hp<b.enemies[1].hp);
 assert.equal(r.state.enemies[1].effects.mana_slow.turns,2);assert.equal(r.state.enemies[0].effects.mana_slow,undefined);
 b.heroes[0].mana=9;assert.ok(cast(b,'hero-0','enemy-1',1).error);
 b.heroes[0].mana=10;assert.ok(!applyAutoAction(b,chooseAutoAction(b)).error);
 const allies=roster.filter(c=>c.faction==='wildgrove'&&c.id!==hero.id).slice(0,2),team=[hero.id,...allies.map(c=>c.id),...REFERENCE_TEAM.slice(0,2)],wild=createBattle(roster,team,'ashen-gate',42);
 assert.equal(wild.heroes[0].factionTier,3);assert.equal(wild.heroes[0].maxHp,Math.round(hero.hp*1.05));
});

test('Ondelle is summonable as a Rare and owned copies survive normalization and backups',async()=>{
 const p=defaultProfile(),pool=roster.filter(c=>c.rarity==='rare'),rolls=[.6,(pool.findIndex(c=>c.id===hero.id)+.5)/pool.length],r=summon(p,roster,()=>rolls.shift());
 assert.equal(r.champion.id,hero.id);assert.ok(validateProfile(r.profile,roster));assert.deepEqual(normalizeProfile(r.profile,roster),r.profile);
 assert.deepEqual(parseBackup(JSON.stringify(makeBackup(r.profile,null)),roster).profile,r.profile);
 const audit=await read('data/roster-audit.json');assert.equal(audit.after.total,265);assert.equal(audit.byFaction.wildgrove.total,18);assert.equal(audit.byFaction.wildgrove.color.blue,3);assert.equal(audit.byFaction.wildgrove.type.attack,9);
});
