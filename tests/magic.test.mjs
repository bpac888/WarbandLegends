import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {createBattle,swap,cast,validateSave} from '../src/engine.js';
import {defaultProfile,summon,normalizeProfile,validateProfile} from '../src/progression.js';
import {factionTeamHTML,factionGuideHTML,factionUnitHTML} from '../src/faction-ui.js';
import {chooseAutoAction,applyAutoAction} from '../src/auto-battle.js';
import {REFERENCE_TEAM} from './reference-team.mjs';
const read=async p=>JSON.parse(await readFile(new URL('../'+p,import.meta.url)));
const original=(await read('data/champions.json')).slice(0,240),magic=original.filter(c=>c.faction==='magic'),manifest=await read('data/roster-expansion-9.json');
const hash=x=>createHash('sha256').update(JSON.stringify(x)).digest('hex');
function fixture(n){
 const roster=structuredClone(original),ids=[...magic.slice(0,n).map(c=>c.id),...REFERENCE_TEAM.slice(0,5-n)],others=['wildgrove','ironclad','frost','umbra'];
 ids.forEach((id,i)=>{const c=roster.find(c=>c.id===id);c.color='red';if(i>=n)c.faction=others[i-n];});
 const b=createBattle(roster,ids,'ashen-gate',42);b.enemies.forEach(e=>{e.hp=e.maxHp=10000000;e.countdown=999;e.passive=null;});
 const colors=['red','green','blue','yellow','purple'];b.board.forEach((t,i)=>{t.color=colors[(i%7+Math.floor(i/7)*2)%5];t.special=null;});
 b.board[7].color=b.board[1].color=b.board[2].color='red';b.board[0].color='blue';return {b,roster};
}
const firstMatch=b=>{const r=swap(b,0,7);assert.ok(!r.error);return r.frames.find(f=>f.kind==='match').state;};

test('Magic adds only six elite wizards and preserves all 234 previous records and portraits',async()=>{
 assert.equal(original.length,240);assert.equal(magic.length,6);assert.equal(magic.filter(c=>c.rarity==='legendary').length,5);assert.equal(magic.filter(c=>c.rarity==='mythical').length,1);
 assert.deepEqual(magic.filter(c=>c.rarity==='legendary').map(c=>c.color).sort(),['blue','green','purple','red','yellow']);
 assert.equal(hash(original.slice(0,234)),manifest.originalRecordsSha256);assert.equal(hash((await read('data/source-champions.json')).slice(0,234)),manifest.originalSourceRecordsSha256);
 const portraits=[];for(const c of original.slice(0,234))portraits.push({id:c.id,sha256:createHash('sha256').update(await readFile(new URL('../'+c.portrait,import.meta.url))).digest('hex')});assert.equal(hash(portraits),manifest.originalPortraitsSha256);
 assert.equal(new Set(original.map(c=>c.name.toLowerCase())).size,240);assert.equal(new Set(original.map(c=>c.faction)).size,14);
});

test('one to five Magic members grant additive 5–25% generated mana to every ally, including themselves',()=>{
 for(let n=1;n<=5;n++){
  const {b,roster}=fixture(n),before=structuredClone(b),next=firstMatch(b);
  assert.ok(b.heroes.every(h=>h.factionManaBonus===n/20));assert.ok(b.enemies.every(e=>e.factionManaBonus===undefined));
  for(let i=0;i<5;i++){assert.equal(b.heroes[i].factionTier,i<n?n:0);assert.equal(next.heroes[i].mana,Math.round(3*(1+n/20)*1000000)/1000000);}
  assert.deepEqual(b,before);assert.ok(validateSave(next,roster));assert.ok(validateSave(JSON.parse(JSON.stringify(next)),roster));
  const corrupt=structuredClone(next);corrupt.heroes[4].factionManaBonus=.99;assert.equal(validateSave(corrupt,roster),false);
  assert.match(factionTeamHTML(b.heroes),new RegExp('Magic · '+n));assert.match(factionTeamHTML(b.heroes),new RegExp('\\+'+n*5+'%'));
  assert.match(factionUnitHTML(b.heroes[4]),/Magic Aura/);
 }
 const {b}=fixture(1);b.heroes[0].hp=0;assert.equal(firstMatch(b).heroes[1].mana,3.15,'starting-team aura persists if a Magic member falls');
});

test('aura multiplies Mana Flow and other matching-faction bonuses, respects Mana Block and does not amplify flat gifts',()=>{
 const {b,roster}=fixture(1);b.heroes[1].effects.mana_surge={turns:2,source:'hero-0',appliedMove:0};b.heroes[2].effects.mana_slow={turns:2,source:'enemy-0',appliedMove:0};b.heroes[3].effects.mana_block={turns:2,source:'enemy-0',appliedMove:0};
 const next=firstMatch(b);assert.equal(next.heroes[1].mana,3.78);assert.equal(next.heroes[2].mana,2.6775);assert.equal(next.heroes[3].mana,0);
 const gift={name:'Gift fixture',charging:false,levels:[{level:1,tiles:10,speed:'average',target:'self',damage:0,healing:0,aoe:false,pierce:false,effects:[{id:'mana_raise',turns:0,scope:'other_allies'}]}]};
 b.heroes[0].special=gift;roster.find(c=>c.id===b.heroes[0].id).special=structuredClone(gift);b.heroes[0].mana=10;
 const r=cast(b,'hero-0','hero-0');assert.ok(!r.error);assert.equal(r.state.heroes[1].mana,1.5);assert.equal(r.state.heroes[2].mana,1.5);assert.equal(r.state.heroes[3].mana,0);
 const mixed=fixture(1);for(const h of mixed.b.heroes.slice(1,4))mixed.roster.find(c=>c.id===h.id).faction='veldtborn';
 const team=createBattle(mixed.roster,mixed.b.heroes.map(h=>h.id),'ashen-gate',42);
 assert.ok(team.heroes.every(h=>h.factionManaBonus===.05));assert.equal(team.heroes[1].factionTier,3);team.board=structuredClone(mixed.b.board);team.enemies.forEach(e=>{e.hp=e.maxHp=10000000;});assert.equal(firstMatch(team).heroes[1].mana,4.095);
 assert.match(factionGuideHTML(),/Magic/);assert.match(factionGuideHTML(),/1 Member/);assert.match(factionGuideHTML(),/25%/);
});

test('all six Specials resolve, work with Auto, join the correct summon pools and preserve saves',()=>{
 for(const c of magic){
  const b=createBattle(original,[c.id,...REFERENCE_TEAM.slice(0,4)],'ashen-gate',42);b.enemies.forEach(e=>{e.hp=e.maxHp=100000;e.passive=null;});b.heroes.forEach(h=>{h.hp=Math.floor(h.maxHp*.3);});b.heroes[0].mana=b.heroes[0].manaMax;
  const before=structuredClone(b),r=cast(b,'hero-0',c.special.levels[0].target==='self'?'hero-0':'enemy-1',1);assert.ok(!r.error,c.id);assert.deepEqual(b,before);assert.ok(validateSave(r.state,original));assert.equal(r.state.heroes[0].mana,0);assert.ok(!applyAutoAction(b,chooseAutoAction(b)).error);
  const pool=original.filter(h=>h.rarity===c.rarity),rolls=[c.rarity==='legendary'?.83:.88,(pool.findIndex(h=>h.id===c.id)+.5)/pool.length],s=summon(defaultProfile(),original,()=>rolls.shift());assert.equal(s.champion.id,c.id);assert.ok(validateProfile(s.profile,original));assert.deepEqual(normalizeProfile(s.profile,original),s.profile);
 }
});
