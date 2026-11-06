import {historicalPortraits} from '../tools/portrait-baseline.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {createBattle,cast,swap,validateSave} from '../src/engine.js';
import {chooseAutoAction,applyAutoAction} from '../src/auto-battle.js';
import {defaultProfile,summon,normalizeProfile,validateProfile,SUMMON_ODDS} from '../src/progression.js';
import {REFERENCE_TEAM} from './reference-team.mjs';
const read=async f=>JSON.parse(await readFile(new URL('../'+f,import.meta.url)));
const roster=(await read('data/champions.json')).slice(0,233),manifest=await read('data/roster-expansion-7.json'),added=roster.slice(215),hash=x=>createHash('sha256').update(JSON.stringify(x)).digest('hex');
const counts=k=>Object.fromEntries([...new Set(added.map(c=>c[k]))].sort().map(v=>[v,added.filter(c=>c[k]===v).length]));
function fixture(c){const b=createBattle(roster,[c.id,...REFERENCE_TEAM.filter(id=>id!==c.id).slice(0,4)],'ashen-gate',42);for(const e of b.enemies){e.hp=e.maxHp=100000;e.passive=null;e.shield=100;e.effects={inc_atk:{turns:2,source:e.uid,appliedMove:0},shield:{turns:2,source:e.uid,appliedMove:0}};}for(const h of b.heroes){h.hp=Math.floor(h.maxHp*.3);h.passive=null;h.effects={poison:{turns:2,source:'enemy-0',appliedMove:0}};}return b;}
test('all 215 previous identities, kits, source records and portrait baselines are preserved',async()=>{
 assert.equal(roster.length,233);assert.equal(new Set(roster.map(c=>c.id)).size,233);assert.equal(new Set(roster.map(c=>c.name.toLowerCase())).size,233);
 assert.equal(hash(roster.slice(0,215)),manifest.originalRecordsSha256);assert.equal(hash((await read('data/source-champions.json')).slice(0,215)),manifest.originalSourceRecordsSha256);
 const portraits=[];for(const c of roster.slice(0,215))portraits.push({id:c.id,sha256:createHash('sha256').update(await readFile(new URL('../'+c.portrait,import.meta.url))).digest('hex')});assert.equal(hash(historicalPortraits(portraits)),manifest.originalPortraitsSha256);assert.deepEqual(added.map(c=>c.id),manifest.addedChampionIds);
});
test('Aerie Court preserves Attack frequency and the existing rarity hierarchy',()=>{
 assert.equal(added.length,18);assert.deepEqual(counts('rarity'),{common:2,legendary:8,mythical:1,rare:7});assert.deepEqual(counts('role'),{attack:10,defense:4,support:4});assert.deepEqual(counts('color'),{blue:3,green:3,purple:4,red:4,yellow:4});assert.ok(added.some(c=>c.manaSpeed==='very_fast'));assert.ok(added.some(c=>c.manaSpeed==='slow'));assert.ok(added.every(c=>c.faction==='aerie_court'));assert.equal(added.filter(c=>c.passive).length,1);
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
 for(const c of added){const p=defaultProfile(),pool=roster.filter(x=>x.rarity===c.rarity),rolls=[({common:.1,rare:.6,legendary:.83,mythical:.88})[c.rarity],(pool.findIndex(x=>x.id===c.id)+.5)/pool.length],r=summon(p,roster,()=>rolls.shift());assert.equal(r.champion.id,c.id);assert.ok(validateProfile(r.profile,roster));assert.deepEqual(normalizeProfile(JSON.parse(JSON.stringify(r.profile)),roster),r.profile);}
 const old=defaultProfile();assert.deepEqual(normalizeProfile(old,roster),old);
});
test('Auto can resolve every new ready kit and mixed new teams finish real encounters',()=>{
 for(const c of added){const b=fixture(c);b.heroes[0].mana=b.heroes[0].manaMax;const before=structuredClone(b),r=applyAutoAction(b,chooseAutoAction(b));assert.ok(!r.error,c.id);assert.ok(validateSave(r.state,roster));assert.deepEqual(b,before);}
 for(const team of [added.slice(0,5),added.slice(5,10),added.slice(10,15)])for(const seed of [31,117]){let b=createBattle(roster,team.map(c=>c.id),'ashen-gate',seed),steps=0;while(b.phase==='playing'&&steps++<160){const r=applyAutoAction(b,chooseAutoAction(b));assert.ok(!r.error);b=r.state;assert.ok(validateSave(b,roster));}assert.equal(b.phase,'victory',team.map(c=>c.id).join(',')+' '+seed);}
});

test('Tailwind Guard caps at three members, affects only members',()=>{
 for(const count of [1,2,3,4,5]){const team=[...added.slice(0,count).map(c=>c.id),...REFERENCE_TEAM.slice(0,5-count)];const b=createBattle(roster,team,'ashen-gate',42),bonus=count<2?0:count===2?.04:.06;
 for(let i=0;i<count;i++){assert.equal(b.heroes[i].factionTier,count<2?0:Math.min(count,3));assert.equal(b.heroes[i].def,Math.round(added[i].def*(1+bonus)));}for(const h of b.heroes.slice(count))assert.equal(h.factionTier,0);assert.ok(validateSave(b,roster));}
});
test('audit, rarity pools and stat envelopes describe the current roster',async()=>{
 const a=await read('data/roster-audit.json');assert.equal(a.after.total,265);assert.equal(a.before.total,264);assert.equal(a.byFaction.aerie_court.total,18);assert.equal(a.after.type.attack,146);
 for(const c of added)for(const stat of ['atk','def','hp']){const peers=roster.slice(0,215).filter(p=>p.rarity===c.rarity&&p.role===c.role).map(p=>p[stat]).sort((a,b)=>a-b),mid=peers.length/2,median=peers.length%2?peers[Math.floor(mid)]:(peers[mid-1]+peers[mid])/2;assert.ok(Math.abs(c[stat]/median-1)<.03,c.id+' '+stat);}
});

test('Tailwind Guard multiplies matching charge but never amplifies flat mana gifts',()=>{
 for(const count of [2,3]){const b=createBattle(roster,[...added.slice(0,count).map(c=>c.id),...REFERENCE_TEAM.slice(0,5-count)],'ashen-gate',42);b.enemies.forEach(e=>{e.hp=e.maxHp=100000;e.countdown=999;});const colors=['yellow','green','blue','red','purple'];b.board.forEach((t,i)=>{t.color=colors[(i%7+Math.floor(i/7)*2)%5];t.special=null;});b.board[7].color=b.board[1].color=b.board[2].color='yellow';b.board[0].color='blue';const result=swap(b,0,7),match=result.frames.find(f=>f.kind==='match');assert.ok(match);assert.equal(match.state.heroes[0].mana,count===2?3.15:3.3);
 b.heroes[0].special={name:'Gift fixture',charging:false,levels:[{level:1,tiles:10,speed:'average',target:'self',damage:0,healing:0,aoe:false,pierce:false,effects:[{id:'mana_raise',turns:0,scope:'other_allies'}]}]};b.heroes[0].mana=10;const gift=cast(b,'hero-0','hero-0');assert.ok(!gift.error);for(const hero of gift.state.heroes.slice(1))assert.equal(hero.mana,1.5);
 }
});
