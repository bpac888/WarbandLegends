import test from 'node:test';import assert from 'node:assert/strict';import {readFile} from 'node:fs/promises';import {createBattle,cast,swap,validMoves,validateSave} from '../src/engine.js';import {REFERENCE_TEAM} from './reference-team.mjs';
const roster=JSON.parse(await readFile(new URL('../data/champions.json',import.meta.url)));
test('every Mythical now has a passive and both Astral passives match source records',async()=>{const source=JSON.parse(await readFile(new URL('../data/source-champions.json',import.meta.url)));assert.ok(roster.filter(c=>c.rarity==='mythical').every(c=>c.passive?.name&&c.passive?.desc));for(const id of ['alkyron_starbreaker','asterox_labyrinth_moon'])assert.deepEqual(roster.find(c=>c.id===id).passive,source.find(c=>c.id===id).passive);});
test('Titan’s Resolve blocks Attack Down and Burn only on Alkyron',()=>{const rows=structuredClone(roster),b=createBattle(rows,['alkyron_starbreaker',...REFERENCE_TEAM.slice(0,4)],'ashen-gate',42);b.enemies.forEach(e=>{e.hp=e.maxHp=100000;e.countdown=99;});const e=b.enemies[0];e.special={name:'Ailments',charging:false,levels:[{level:1,speed:'average',tiles:10,target:'enemy',damage:0,healing:0,healScope:'allies',aoe:true,pierce:false,effects:[{id:'dec_atk',turns:2,scope:'enemies'},{id:'burn',turns:2,scope:'enemies'}]}]};rows.find(c=>c.id===e.id).special=structuredClone(e.special);e.manaMax=10;e.mana=6;e.countdown=1;const next=swap(b,...validMoves(b.board)[0],{frames:false}).state;assert.ok(!next.heroes[0].effects.dec_atk&&!next.heroes[0].effects.burn);assert.ok(next.heroes.slice(1).every(h=>h.effects.dec_atk&&h.effects.burn));assert.ok(validateSave(next,rows));});
test('Moonforged Aegis makes Asterox’s own Barrier50% larger while allied Barriers stay at normal strength',()=>{const b=createBattle(roster,['asterox_labyrinth_moon',...REFERENCE_TEAM.slice(0,4)],'ashen-gate',42);b.heroes[0].mana=8;const result=cast(b,'hero-0','enemy-0');assert.ok(!result.error);assert.equal(result.state.heroes[0].shield,Math.round(b.heroes[0].maxHp*.2*1.5));for(const h of result.state.heroes.slice(1))assert.equal(h.shield,Math.round(h.maxHp*.2));assert.ok(validateSave(result.state,roster));});

test('only the two requested Astral kits change, with stats, identities, passives and all 187 other records preserved',async()=>{
 const {createHash}=await import('node:crypto'),revision=JSON.parse(await readFile(new URL('../data/astral-mythical-revision.json',import.meta.url))),source=JSON.parse(await readFile(new URL('../data/source-champions.json',import.meta.url))),design=JSON.parse(await readFile(new URL('../data/roster-design.json',import.meta.url))),before=structuredClone(roster);
 assert.deepEqual(revision.characters.map(c=>c.id),['alkyron_starbreaker','asterox_labyrinth_moon']);
 for(const x of revision.characters){const c=roster.find(c=>c.id===x.id);assert.deepEqual(c,x.after);assert.deepEqual(source.find(c=>c.id===x.id),x.sourceAfter);assert.deepEqual(design.champions[x.id],x.designAfter);for(const k of Object.keys(x.before))if(!['manaSpeed','special','ability_desc'].includes(k))assert.deepEqual(c[k],x.before[k],x.id+' '+k);before[before.findIndex(c=>c.id===x.id)]=x.before;}
 assert.equal(createHash('sha256').update(JSON.stringify(before)).digest('hex'),revision.previousRosterSha256);
});

test('Alkyron casts at ten tiles, Dispels every enemy before Burn and deals the stronger neutral area hit',()=>{
 const b=createBattle(roster,['alkyron_starbreaker',...REFERENCE_TEAM.slice(0,4)],'ashen-gate',42);for(const e of b.enemies){e.hp=e.maxHp=100000;e.def=750;e.color='red';e.passive=null;e.shield=800;e.effects={inc_def:{turns:2,source:e.uid,appliedMove:0},strengthen:{turns:2,source:e.uid,appliedMove:0},shield:{turns:2,source:e.uid,appliedMove:0},block_debuffs:{turns:2,source:e.uid,appliedMove:0}};}
 const a=b.heroes[0];assert.equal(a.manaSpeed,'average');assert.equal(a.manaMax,10);a.mana=9.99;assert.ok(cast(b,a.uid,'enemy-0').error);a.mana=10;
 const good=cast(b,a.uid,'enemy-0',1,{frames:false});assert.ok(!good.error);assert.equal(good.state.moves,0);assert.equal(good.state.heroes[0].mana,0);
 for(const e of good.state.enemies){assert.equal(e.hp,100000-748);assert.equal(e.shield,0);assert.deepEqual(Object.keys(e.effects),['burn']);assert.equal(e.effects.burn.turns,2);}
 assert.equal(b.enemies[0].shield,800);assert.ok(validateSave(good.state,roster));
});

test('Asterox casts at eight tiles and gives living allies two-turn Ward and Barrier while Taunt stays personal',()=>{
 const b=createBattle(roster,['asterox_labyrinth_moon',...REFERENCE_TEAM.slice(0,4)],'ashen-gate',42),a=b.heroes[0];b.enemies.forEach(e=>{e.hp=e.maxHp=100000;});b.heroes[4].hp=0;
 assert.equal(a.manaSpeed,'fast');assert.equal(a.manaMax,8);a.mana=7.99;assert.ok(cast(b,a.uid,'enemy-0').error);a.mana=8;
 const result=cast(b,a.uid,'enemy-0',1,{frames:false});assert.ok(!result.error);assert.equal(result.state.moves,0);assert.equal(result.state.heroes[0].effects.guard.turns,2);
 for(const h of result.state.heroes.slice(0,4)){assert.equal(h.effects.strengthen.turns,2);assert.equal(h.effects.shield.turns,2);assert.equal(h.shield,Math.round(h.maxHp*.2*(h.uid===a.uid?1.5:1)));if(h.uid!==a.uid)assert.ok(!h.effects.guard);}
 assert.equal(result.state.heroes[4].hp,0);assert.deepEqual(result.state.heroes[4].effects,{});assert.ok(validateSave(result.state,roster));
});
