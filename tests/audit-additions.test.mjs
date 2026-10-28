import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {createBattle,cast,validateSave} from '../src/engine.js';
import {chooseAutoAction,applyAutoAction} from '../src/auto-battle.js';
import {defaultProfile,summon,normalizeProfile,validateProfile,SUMMON_ODDS} from '../src/progression.js';
import {REFERENCE_TEAM} from './reference-team.mjs';
import {EFFECTS} from '../src/effects.js';
const read=async file=>JSON.parse(await readFile(new URL('../'+file,import.meta.url)));
const roster=await read('data/champions.json'),manifest=await read('data/roster-expansion-2.json'),added=roster.slice(manifest.originalCount);
const hash=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
const count=key=>Object.fromEntries([...new Set(added.map(c=>c[key]))].sort().map(k=>[k,added.filter(c=>c[key]===k).length]));
function fixture(c){const b=createBattle(roster,[c.id,...REFERENCE_TEAM.filter(id=>id!==c.id).slice(0,4)],'ashen-gate',42);for(const e of b.enemies){e.hp=e.maxHp=100000;e.effects={inc_atk:{turns:2,source:e.uid,appliedMove:0}};e.passive=null;e.shield=0;}for(const h of b.heroes){h.hp=Math.floor(h.maxHp*.4);h.effects={poison:{turns:2,source:'enemy-0',appliedMove:0}};h.passive=null;}return b;}
test('all 150 previous records and source identities are preserved exactly',async()=>{
 assert.equal(hash(roster.slice(0,150)),manifest.originalRecordsSha256);assert.equal(hash((await read('data/source-champions.json')).slice(0,150)),manifest.originalSourceRecordsSha256);assert.deepEqual(added.map(c=>c.id),manifest.addedChampionIds);assert.equal(new Set(roster.map(c=>c.id)).size,162);
});
test('the 12 additions match the approved rarity, role, color and speed mix',()=>{
 assert.deepEqual(count('rarity'),{legendary:9,rare:3});assert.deepEqual(count('role'),{attack:8,defense:2,support:2});assert.deepEqual(count('color'),{blue:2,green:2,purple:3,red:3,yellow:2});assert.deepEqual(count('manaSpeed'),{average:3,charging:2,fast:4,slow:2,very_fast:1});
 for(const x of manifest.implementedRecommendations){const c=added.find(c=>c.id===x.championId);for(const k of ['faction','color','rarity','role','manaSpeed'])assert.equal(c[k],x[k]);assert.ok(!roster.slice(0,150).some(c=>c.faction===x.faction&&c.color===x.color&&c.role===x.role));}
 for(const c of added)for(const l of c.special.levels)for(const e of l.effects){assert.ok(EFFECTS[e.id]);assert.ok(Number.isInteger(e.turns)&&e.turns>=0&&e.turns<=3);}
});
test('every new charge tier damages, heals, cleanses, dispels and applies effects to the declared recipients without spending a board turn',()=>{
 for(const c of added)for(const level of c.special.levels){
  const b=fixture(c),actor=b.heroes[0];actor.mana=level.tiles;const target=level.target==='enemy'?b.enemies[1]:actor,before=structuredClone(b);
  const result=cast(b,actor.uid,target.uid,level.level);assert.ok(!result.error,c.id);const next=result.state;assert.ok(validateSave(next,roster),c.id);
  assert.deepEqual(b,before);assert.equal(next.moves,b.moves);assert.deepEqual(next.enemies.map(e=>e.countdown),b.enemies.map(e=>e.countdown));assert.equal(next.heroes[0].mana,0);
  const recipients=scope=>scope==='self'?[next.heroes[0]]:scope==='allies'?next.heroes:scope==='enemies'?next.enemies:[next.enemies[1]];
  if(level.damage)for(let i=0;i<3;i++)assert.equal(next.enemies[i].hp<b.enemies[i].hp,level.aoe||i===1,c.id+' damage target');
  if(level.healing)for(const h of next.heroes)assert.ok(h.hp>b.heroes.find(x=>x.uid===h.uid).hp,c.id+' healing');
  for(const e of level.effects)for(const u of recipients(e.scope)){
   if(e.id==='remove_debuffs')assert.ok(!u.effects.poison,c.id+' cleanse');
   else if(e.id==='dispel')assert.ok(!u.effects.inc_atk,c.id+' dispel');
   else {assert.equal(u.effects[e.id]?.turns,e.turns,c.id+' '+e.id);if(e.id==='shield')assert.ok(u.shield>0,c.id+' barrier pool');}
  }
 }
});
test('all 12 additions can be summoned through their unchanged rarity pools and survive save normalization',()=>{
 assert.deepEqual(SUMMON_ODDS.map(x=>[x.rarity,x.chance]),[['common',50],['rare',30],['legendary',7.5],['mythical',1.5],['double_common',11]]);
 for(const c of added){const p=defaultProfile(),pool=roster.filter(h=>h.rarity===c.rarity),rolls=[{rare:.6,legendary:.83,mythical:.88}[c.rarity],(pool.findIndex(h=>h.id===c.id)+.5)/pool.length];
  const result=summon(p,roster,()=>rolls.shift());assert.equal(result.champion.id,c.id);assert.ok(validateProfile(result.profile,roster));
  const normalized=normalizeProfile(JSON.parse(JSON.stringify(result.profile)),roster);assert.deepEqual(normalized,result.profile);assert.equal(normalized.collection[result.copyId],1);assert.deepEqual(normalized.team,p.team);
 }
});
test('Auto considers every new ready kit and produces legal actions without mutating the position',()=>{
 for(const c of added){const b=fixture(c);b.heroes[0].mana=b.heroes[0].manaMax;const before=structuredClone(b),action=chooseAutoAction(b);assert.ok(action,c.id);const result=applyAutoAction(b,action);assert.ok(!result.error,c.id);assert.ok(validateSave(result.state,roster),c.id);assert.deepEqual(b,before);}
});
test('current audit reflects every implemented recommendation and full five-element faction coverage',async()=>{
 const audit=await read('data/roster-audit.json');assert.equal(audit.after.total,162);assert.equal(audit.implementedRecommendations.length,12);assert.equal(audit.recommendations.length,0);for(const c of ['red','blue','green','yellow','purple'])assert.equal(audit.after.color[c],['red','purple'].includes(c)?33:32);for(const f of Object.values(audit.byFaction)){assert.ok(f.total>=14&&f.total<=16);assert.ok(Object.values(f.color).every(n=>n>0));}
});
test('three new warband combinations complete real Auto encounters without illegal actions or stalls',()=>{
 const groups=[added.slice(0,5),added.slice(4,9),added.slice(7,12)];
 for(const group of groups)for(const seed of [31,117]){let b=createBattle(roster,group.map(c=>c.id),'ashen-gate',seed),steps=0;while(b.phase==='playing'&&steps++<140){const action=chooseAutoAction(b);assert.ok(action);const r=applyAutoAction(b,action);assert.ok(!r.error);b=r.state;assert.ok(validateSave(b,roster));}assert.equal(b.phase,'victory',group.map(c=>c.id).join(',')+' seed '+seed);}
});
