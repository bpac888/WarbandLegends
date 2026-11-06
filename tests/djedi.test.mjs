import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {createBattle,cast,validateSave} from '../src/engine.js';
import {defaultProfile,summon,normalizeProfile,validateProfile} from '../src/progression.js';
import {factionTeamHTML,factionGuideHTML} from '../src/faction-ui.js';
import {chooseAutoAction,applyAutoAction} from '../src/auto-battle.js';
import {REFERENCE_TEAM} from './reference-team.mjs';
const read=async p=>JSON.parse(await readFile(new URL('../'+p,import.meta.url)));
const roster=await read('data/champions.json'),djedi=roster.filter(c=>c.faction==='djedi'),manifest=await read('data/roster-expansion-10.json');
const hash=x=>createHash('sha256').update(JSON.stringify(x)).digest('hex');

test('Djedi has the eight requested identities, exact rarities and roles, while preserving all 240 previous champions',async()=>{
 assert.equal(roster.length,248);assert.equal(djedi.length,8);assert.equal(new Set(roster.map(c=>c.id)).size,248);assert.equal(new Set(roster.map(c=>c.name.toLowerCase())).size,248);
 assert.deepEqual(djedi.map(c=>c.name).sort(),['Kobe Jacoby','Commander Pain','Jace Gold','Windwalker','Dark Lord','Cheeburrash','AR2','Lord of Darkness'].sort());
 for(const c of djedi){assert.equal(c.rarity,c.name==='AR2'?'rare':'legendary');assert.equal(c.role,c.name==='AR2'?'support':c.name==='Cheeburrash'?'defense':'attack');}
 assert.equal(new Set(djedi.map(c=>c.color)).size,5);
 assert.equal(hash(roster.slice(0,240)),manifest.originalRecordsSha256);assert.equal(hash((await read('data/source-champions.json')).slice(0,240)),manifest.originalSourceRecordsSha256);
 const portraits=[];for(const c of roster.slice(0,240))portraits.push({id:c.id,sha256:createHash('sha256').update(await readFile(new URL('../'+c.portrait,import.meta.url))).digest('hex')});assert.equal(hash(portraits),manifest.originalPortraitsSha256);
});

test('Djedi activates at two members, grants exactly 10% ATK only to members, and never grows with extra members',()=>{
 for(let n=1;n<=5;n++){
  const ids=[...djedi.slice(0,n).map(c=>c.id),...REFERENCE_TEAM.slice(0,5-n)],b=createBattle(roster,ids,'ashen-gate',42);
  b.heroes.forEach((h,i)=>{const c=roster.find(c=>c.id===h.id);assert.equal(h.factionTier,i<n&&n>=2?2:0);assert.equal(h.atk,Math.round(c.atk*(i<n&&n>=2?1.1:1)));});
  assert.ok(validateSave(b,roster));assert.ok(validateSave(JSON.parse(JSON.stringify(b)),roster));
  if(n>=2){assert.match(factionTeamHTML(b.heroes),/Djedi · 2\+/);assert.match(factionTeamHTML(b.heroes),/10%/);b.heroes[1].hp=0;assert.equal(b.heroes[0].factionTier,2);assert.ok(validateSave(b,roster));}
  else assert.doesNotMatch(factionTeamHTML(b.heroes),/Djedi/);
 }
 const m=roster.find(c=>c.faction==='magic'),b=createBattle(roster,[djedi[0].id,djedi[1].id,m.id,...REFERENCE_TEAM.slice(0,2)],'ashen-gate',42);
 assert.ok(b.heroes.every(h=>h.factionManaBonus===.05));assert.equal(b.heroes[0].atk,Math.round(djedi[0].atk*1.1));assert.equal(b.heroes[2].atk,m.atk);assert.ok(validateSave(b,roster));
 assert.match(factionGuideHTML(),/Djedi/);assert.match(factionGuideHTML(),/2\+ Members/);
});

test('all eight kits resolve with correct targeting, mana costs and Auto support; AR2 heals and gives flat mana',()=>{
 for(const c of djedi){
  const b=createBattle(roster,[c.id,...REFERENCE_TEAM.slice(0,4)],'ashen-gate',42);b.enemies.forEach(e=>{e.hp=e.maxHp=100000;e.passive=null;e.effects={};});b.heroes.forEach(h=>{h.hp=Math.floor(h.maxHp*.3);h.mana=0;});b.heroes[0].mana=b.heroes[0].manaMax;
  const before=structuredClone(b),l=c.special.levels[0],r=cast(b,'hero-0',l.target==='self'?'hero-0':'enemy-1',1);assert.ok(!r.error,c.id);assert.deepEqual(b,before);assert.ok(validateSave(r.state,roster));assert.equal(r.state.heroes[0].mana,0);assert.equal(r.state.moves,b.moves);
  if(l.damage)r.state.enemies.forEach((e,i)=>assert.equal(e.hp<b.enemies[i].hp,l.aoe||i===1,c.name));
  if(c.name==='AR2'){r.state.heroes.forEach((h,i)=>{assert.ok(h.hp>b.heroes[i].hp);assert.equal(h.mana,i?1.5:0);});}
  if(c.name==='Cheeburrash'){assert.equal(r.state.heroes[0].effects.guard.turns,2);assert.equal(r.state.heroes[0].effects.inc_def.turns,2);}
  assert.ok(!applyAutoAction(b,chooseAutoAction(b)).error);
 }
});

test('every Djedi enters the correct summon pool and survives profile normalization',()=>{
 for(const c of djedi){const pool=roster.filter(h=>h.rarity===c.rarity),rolls=[c.rarity==='rare'?.6:.83,(pool.findIndex(h=>h.id===c.id)+.5)/pool.length],r=summon(defaultProfile(),roster,()=>rolls.shift());assert.equal(r.champion.id,c.id);assert.ok(validateProfile(r.profile,roster));assert.deepEqual(normalizeProfile(r.profile,roster),r.profile);}
});

test('approved Djedi appearance revisions retain stable IDs, stats, kits and source mechanics',async()=>{
 const revisions=await read('data/djedi-appearance-revisions.json'),art=await read('data/portrait-revisions.json'),source=await read('data/source-champions.json');
 const gameplay=record=>{const {name,lore,...rest}=record;return rest;};
 for(const edit of revisions.changes){
  const current=roster.find(c=>c.id===edit.id);assert.equal(current.name,edit.name);
  assert.deepEqual(gameplay(current),gameplay(edit.beforeRecord),edit.id+' gameplay');
  assert.deepEqual(gameplay(source.find(c=>c.id===edit.id)),gameplay(edit.beforeSource),edit.id+' source mechanics');
  const approved=art.portraits.find(p=>p.id===edit.id),actual=createHash('sha256').update(await readFile(new URL('../'+current.portrait,import.meta.url))).digest('hex');
  assert.equal(actual,approved.approvedSha256);assert.notEqual(actual,approved.baselineSha256);
 }
});
