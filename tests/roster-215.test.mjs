import {beforeUpgradeBalance} from '../src/upgrade-balance-revision.js';
import {historicalPortraits} from '../tools/portrait-baseline.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {createBattle,cast,validateSave} from '../src/engine.js';
import {chooseAutoAction,applyAutoAction} from '../src/auto-battle.js';
import {defaultProfile,summon,normalizeProfile,validateProfile,SUMMON_ODDS} from '../src/progression.js';
import {REFERENCE_TEAM} from './reference-team.mjs';
const read=async f=>JSON.parse(await readFile(new URL('../'+f,import.meta.url)));
const roster=(await read('data/champions.json')).slice(0,215),manifest=await read('data/roster-expansion-6.json'),added=roster.slice(200),hash=x=>createHash('sha256').update(JSON.stringify(Array.isArray(x)?beforeUpgradeBalance(x):x)).digest('hex');
const counts=k=>Object.fromEntries([...new Set(added.map(c=>c[k]))].sort().map(v=>[v,added.filter(c=>c[k]===v).length]));
function fixture(c){const b=createBattle(roster,[c.id,...REFERENCE_TEAM.filter(id=>id!==c.id).slice(0,4)],'ashen-gate',42);for(const e of b.enemies){e.hp=e.maxHp=100000;e.passive=null;e.shield=100;e.effects={inc_atk:{turns:2,source:e.uid,appliedMove:0},shield:{turns:2,source:e.uid,appliedMove:0}};}for(const h of b.heroes){h.hp=Math.floor(h.maxHp*.3);h.passive=null;h.effects={poison:{turns:2,source:'enemy-0',appliedMove:0}};}return b;}
test('all 200 previous identities, kits, source records and portrait baselines are preserved',async()=>{
 assert.equal(roster.length,215);assert.equal(new Set(roster.map(c=>c.id)).size,215);assert.equal(new Set(roster.map(c=>c.name.toLowerCase())).size,215);
 assert.equal(hash(roster.slice(0,200)),manifest.originalRecordsSha256);assert.equal(hash((await read('data/source-champions.json')).slice(0,200)),manifest.originalSourceRecordsSha256);
 const portraits=[];for(const c of roster.slice(0,200))portraits.push({id:c.id,sha256:createHash('sha256').update(await readFile(new URL('../'+c.portrait,import.meta.url))).digest('hex')});assert.equal(hash(historicalPortraits(portraits)),manifest.originalPortraitsSha256);assert.deepEqual(added.map(c=>c.id),manifest.addedChampionIds);
});
test('the approved fifteen preserve Attack frequency, rarity limits and varied access',()=>{
 assert.equal(added.length,15);assert.deepEqual(counts('rarity'),{legendary:7,rare:8});assert.deepEqual(counts('role'),{attack:8,defense:4,support:3});assert.deepEqual(counts('color'),{blue:2,green:4,purple:5,red:2,yellow:2});assert.deepEqual(counts('manaSpeed'),{average:6,charging:2,fast:4,slow:3});assert.ok(added.every(c=>!c.passive));
 const audit=manifest.implementedRecommendations;assert.equal(audit.length,15);assert.ok(!added.some(c=>c.name.startsWith('Veska')||c.name.startsWith('Pelagra')));assert.match(added.find(c=>c.faction==='chymera').lore,/alchemical/i);
});
test('every new tier resolves with correct recipients, charge spending and unchanged input',()=>{
 for(const c of added)for(const l of c.special.levels){const b=fixture(c);b.heroes[0].mana=l.tiles;const before=structuredClone(b),target=l.target==='enemy'?b.enemies[1]:l.target==='ally'?b.heroes[1]:b.heroes[0];const r=cast(b,'hero-0',target.uid,l.level);assert.ok(!r.error,c.id);const n=r.state;assert.ok(validateSave(n,roster),c.id);assert.deepEqual(b,before);assert.equal(n.moves,b.moves);assert.deepEqual(n.enemies.map(e=>e.countdown),b.enemies.map(e=>e.countdown));assert.equal(n.heroes[0].mana,0);
  const recipients=s=>s==='self'?[n.heroes[0]]:s==='ally'?[n.heroes[1]]:s==='allies'?n.heroes:s==='enemies'?n.enemies:[n.enemies[1]];
  if(l.damage)for(let i=0;i<3;i++)assert.equal(n.enemies[i].hp<b.enemies[i].hp,!!l.aoe||i===1,c.id+' hit scope');
  if(l.healing)for(let i=0;i<5;i++)assert.equal(n.heroes[i].hp>b.heroes[i].hp,l.healScope==='allies'||i===1,c.id+' heal scope');
  for(const e of l.effects)for(const u of recipients(e.scope)){if(e.id==='remove_debuffs')assert.ok(!u.effects.poison,c.id);else if(e.id==='dispel'){assert.ok(!u.effects.inc_atk);assert.equal(u.shield,0);}else assert.equal(u.effects[e.id]?.turns,e.turns+(u.effects[e.id]?.factionExtended?1:0),c.id+' '+e.id);}
 }
});
test('new additions enter unchanged summon pools and survive saved profile normalization',()=>{
 assert.deepEqual(SUMMON_ODDS.map(x=>[x.rarity,x.chance]),[['common',50],['rare',30],['legendary',7.5],['mythical',1.5],['double_common',11]]);
 for(const c of added){const p=defaultProfile(),pool=roster.filter(x=>x.rarity===c.rarity),rolls=[c.rarity==='rare'?.6:.83,(pool.findIndex(x=>x.id===c.id)+.5)/pool.length],r=summon(p,roster,()=>rolls.shift());assert.equal(r.champion.id,c.id);assert.ok(validateProfile(r.profile,roster));assert.deepEqual(normalizeProfile(JSON.parse(JSON.stringify(r.profile)),roster),r.profile);}
 const old=defaultProfile();assert.deepEqual(normalizeProfile(old,roster),old);
});
test('Auto can resolve every new ready kit and three mixed new teams finish real encounters',()=>{
 for(const c of added){const b=fixture(c);b.heroes[0].mana=b.heroes[0].manaMax;const before=structuredClone(b),r=applyAutoAction(b,chooseAutoAction(b));assert.ok(!r.error,c.id);assert.ok(validateSave(r.state,roster));assert.deepEqual(b,before);}
 for(const team of [added.slice(0,5),added.slice(5,10),added.slice(10,15)])for(const seed of [31,117]){let b=createBattle(roster,team.map(c=>c.id),'ashen-gate',seed),steps=0;while(b.phase==='playing'&&steps++<160){const r=applyAutoAction(b,chooseAutoAction(b));assert.ok(!r.error);b=r.state;assert.ok(validateSave(b,roster));}assert.equal(b.phase,'victory',team.map(c=>c.id).join(',')+' '+seed);}
});
test('current audit describes the 215 roster and all fifteen additions',async()=>{const a=await read('docs/history/roster-audit-215.json');assert.equal(a.after.total,215);assert.equal(a.before.total,200);assert.equal(a.implementedRecommendations.length,15);assert.deepEqual(a.after.type,{attack:115,defense:47,support:53});});
test('new charging defenders and attackers retain early-tier scope, thresholds and full-mana spending',()=>{
 for(const id of ['brannik_verdigris_sapper','nyxel_nullwall_marshal']){const c=added.find(c=>c.id===id),b=fixture(c),target=c.role==='attack'?'enemy-1':'hero-0';b.heroes[0].mana=7.99;assert.ok(cast(b,'hero-0',target,1).error);b.heroes[0].mana=10;const n=cast(b,'hero-0',target,1).state;assert.equal(n.heroes[0].mana,0);if(c.role==='attack')assert.equal(n.enemies[1].effects.vulnerable_green,undefined);else{assert.equal(n.heroes[0].effects.guard.turns,1);assert.ok(n.heroes.slice(1).every(h=>!h.effects.strengthen));}}
});
test('Calveris extends only the hostile reagent effect under the three-Chymera bonus',()=>{
 const c=added.find(c=>c.id==='calveris_azure_retort'),partners=roster.filter(x=>x.faction==='chymera'&&x.id!==c.id).slice(0,2);const b=createBattle(roster,[c.id,...partners.map(x=>x.id),...REFERENCE_TEAM.slice(0,2)],'ashen-gate',42);b.enemies.forEach(e=>{e.hp=e.maxHp=10000;e.effects={};e.passive=null;});b.heroes[0].mana=10;const n=cast(b,'hero-0','enemy-1').state;assert.equal(n.enemies[1].effects.dec_atk.turns,2);assert.ok(n.enemies[1].effects.dec_atk.factionExtended);for(const h of n.heroes)assert.equal(h.effects.strengthen.turns,2);assert.ok(validateSave(n,roster));
});
