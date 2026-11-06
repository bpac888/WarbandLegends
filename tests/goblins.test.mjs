import test from 'node:test';import assert from 'node:assert/strict';import {readFile} from 'node:fs/promises';import {createHash} from 'node:crypto';
import {createBattle,cast,validateSave} from '../src/engine.js';import {defaultProfile,summon,normalizeProfile} from '../src/progression.js';import {factionGuideHTML,factionTeamHTML} from '../src/faction-ui.js';import {REFERENCE_TEAM} from './reference-team.mjs';
const read=async p=>JSON.parse(await readFile(new URL('../'+p,import.meta.url))),roster=await read('data/champions.json'),goblins=roster.filter(c=>c.faction==='goblins'),manifest=await read('data/roster-expansion-11.json'),hash=x=>createHash('sha256').update(JSON.stringify(x)).digest('hex');
const random=seed=>{let x=seed|0;x^=x<<13;x^=x>>>17;x^=x<<5;return (x>>>0)/4294967296;};
function fixture(id){const data=structuredClone(roster),c=data.find(c=>c.id===goblins[0].id);c.special={name:'Resistance fixture',charging:false,levels:[{level:1,tiles:10,speed:'average',target:'self',damage:0,healing:0,aoe:false,pierce:false,effects:[{id,turns:2,scope:'allies'}]}]};const b=createBattle(data,[c.id,...REFERENCE_TEAM.slice(0,4)],'ashen-gate',42);b.heroes[0].mana=10;return {b,data};}
test('sixteen Goblins are 11 Legendary and 5 Rare, with no changes to the previous 248 characters',async()=>{
 assert.equal(roster.length,264);assert.equal(goblins.length,16);assert.equal(goblins.filter(c=>c.rarity==='legendary').length,11);assert.equal(goblins.filter(c=>c.rarity==='rare').length,5);assert.equal(new Set(roster.map(c=>c.name.toLowerCase())).size,264);
 assert.equal(hash(roster.slice(0,248)),manifest.originalRecordsSha256);assert.equal(hash((await read('data/source-champions.json')).slice(0,248)),manifest.originalSourceRecordsSha256);
 const portraits=[];for(const c of roster.slice(0,248))portraits.push({id:c.id,sha256:createHash('sha256').update(await readFile(new URL('../'+c.portrait,import.meta.url))).digest('hex')});assert.equal(hash(portraits),manifest.originalPortraitsSha256);
});
test('resistance uses the exact 70% threshold, protects only Goblins and preserves input and snapshots',()=>{
 for(const id of ['mana_slow','mana_block'])for(let i=1;i<=240;i++){
  const {b,data}=fixture(id),seed=(i*2654435761)>>>0||1;b.rng=seed;const before=structuredClone(b),r=cast(b,'hero-0','hero-0',1),blocked=random(seed)<.7;
  assert.ok(!r.error);assert.deepEqual(b,before);assert.equal(!r.state.heroes[0].effects[id],blocked);for(const h of r.state.heroes.slice(1))assert.equal(h.effects[id].turns,2);assert.ok(validateSave(r.state,data));
 }
});
test('blocked applications preserve Mana Flow and existing timers; other ailments and buffs are not resisted',()=>{
 for(const id of ['mana_slow','mana_block']){const {b}=fixture(id);b.rng=1;b.heroes[0].effects[id]={turns:1,source:'hero-0',appliedMove:0};const r=cast(b,'hero-0','hero-0',1);assert.equal(r.state.heroes[0].effects[id].turns,1);}
 const f=fixture('mana_slow');f.b.rng=1;f.b.heroes[0].effects.mana_surge={turns:2,source:'hero-0',appliedMove:0};assert.ok(cast(f.b,'hero-0','hero-0',1).state.heroes[0].effects.mana_surge);
 for(const id of ['poison','frostbite','mana_surge']){const {b}=fixture(id);b.rng=1;assert.equal(cast(b,'hero-0','hero-0',1).state.heroes[0].effects[id].turns,2);}
 for(let n=1;n<=5;n++){const b=createBattle(roster,[...goblins.slice(0,n).map(c=>c.id),...REFERENCE_TEAM.slice(0,5-n)],'ashen-gate',42);assert.ok(b.heroes.slice(0,n).every(h=>h.factionTier===1));assert.match(factionTeamHTML(b.heroes),/70%/);assert.ok(validateSave(b,roster));}
 assert.match(factionGuideHTML(),/Goblins/);
});
test('all sixteen Specials resolve correctly and every Goblin is summonable and save-compatible',()=>{
 for(const c of goblins){const b=createBattle(roster,[c.id,...REFERENCE_TEAM.slice(0,4)],'ashen-gate',42);b.enemies.forEach(e=>{e.hp=e.maxHp=100000;e.passive=null;});b.heroes.forEach(h=>h.hp=Math.floor(h.maxHp*.3));b.heroes[0].mana=b.heroes[0].manaMax;const l=c.special.levels[0],r=cast(b,'hero-0',l.target==='self'?'hero-0':'enemy-1',1);assert.ok(!r.error,c.id);assert.ok(validateSave(r.state,roster));assert.equal(r.state.heroes[0].mana,0);
 const pool=roster.filter(h=>h.rarity===c.rarity),rolls=[c.rarity==='rare'?.6:.83,(pool.findIndex(h=>h.id===c.id)+.5)/pool.length],s=summon(defaultProfile(),roster,()=>rolls.shift());assert.equal(s.champion.id,c.id);assert.deepEqual(normalizeProfile(s.profile,roster),s.profile);}
});
