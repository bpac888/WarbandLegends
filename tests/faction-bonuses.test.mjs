import test from 'node:test';import assert from 'node:assert/strict';import {readFile} from 'node:fs/promises';
import {createBattle,swap,activate,cast,validMoves,validateSave} from '../src/engine.js';
import {FACTION_BONUSES,factionGroups} from '../src/faction-bonuses.js';import {factionTeamHTML,factionGuideHTML} from '../src/faction-ui.js';
import {awakenedStats} from '../src/ascension.js';import {statsAtLevel} from '../src/development.js';
import {chooseAutoAction,applyAutoAction} from '../src/auto-battle.js';import {loadBattle,save,BATTLE_KEY} from '../src/storage.js';
import {REFERENCE_TEAM} from './reference-team.mjs';
const original=JSON.parse(await readFile(new URL('../data/champions.json',import.meta.url)));
const keys=Object.keys(FACTION_BONUSES);
function kit(effects=[],extras={}){return {name:'Fixture',charging:false,levels:[{level:1,speed:'average',tiles:10,target:'enemy',damage:0,healing:0,healScope:'allies',aoe:false,pierce:false,effects,...extras}]};}
function fixture(faction,count=3,seed=42,{progression=false,tileCosts=null}={}){
 const roster=structuredClone(original),others=keys.filter(k=>k!==faction),sources=REFERENCE_TEAM.map(id=>roster.find(c=>c.id===id));
 sources.forEach((c,i)=>Object.assign(c,{faction:i<count?faction:others[i-count],hp:1000,atk:500,def:300,color:'red',rarity:'rare',passive:null,manaSpeed:'average',special:kit([],{tiles:tileCosts?.[i]||10})}));
 const options=progression?{progression:true,levels:Object.fromEntries(REFERENCE_TEAM.map(id=>[id,60])),ascensions:Object.fromEntries(REFERENCE_TEAM.map(id=>[id,2])),awakenings:Object.fromEntries(REFERENCE_TEAM.map(id=>[id,2]))}:{};
 const b=createBattle(roster,REFERENCE_TEAM,'ashen-gate',seed,options);
 for(const e of b.enemies){e.hp=e.maxHp=10000000;e.countdown=e.baseCountdown=999;e.passive=null;}
 return {b,roster,sources};
}
function redBoard(b){const colors=['red','green','blue','yellow','purple'];b.board.forEach((t,i)=>{t.color=colors[(i%7+Math.floor(i/7)*2)%5];t.special=null;});b.board[7].color='red';b.board[1].color='red';b.board[2].color='red';b.board[0].color='blue';return b;}
const redTurn=b=>{const r=swap(redBoard(b),0,7,{frames:false});assert.ok(!r.error);return r.state;};
const turn=b=>{const r=swap(b,...validMoves(b.board)[0],{frames:false});assert.ok(!r.error);return r.state;};
const setKit=(b,roster,index,special)=>{b.heroes[index].special=structuredClone(special);roster.find(c=>c.id===b.heroes[index].id).special=structuredClone(special);};
const ready=b=>{b.heroes[0].mana=b.heroes[0].manaMax;return b;};
function enemyAilment(faction,count,ids){const {b,roster}=fixture(faction,count);b.enemies[0].special=kit(ids.map(id=>({id,turns:2,scope:'enemies'})),{aoe:true});roster.find(c=>c.id===b.enemies[0].id).special=structuredClone(b.enemies[0].special);b.enemies[0].manaMax=10;b.enemies[0].countdown=1;b.enemies[0].mana=b.enemies[0].manaMax-4;return {next:turn(b),roster};}

test('all twelve factions select only the highest tier; 4/5 members cap at3 and two separate groups coexist',()=>{
 assert.equal(keys.length,12);
 for(const f of keys)for(const n of [1,2,3,4,5]){const {b,roster}=fixture(f,n);assert.deepEqual(b.heroes.map(h=>h.factionTier),Array.from({length:5},(_,i)=>i<n&&n>=2?Math.min(3,n):0));assert.ok(b.enemies.every(e=>e.factionTier===undefined));assert.ok(validateSave(b,roster),f+' '+n);}
 const {b,roster}=fixture('dragondynasty',3);for(let i=3;i<5;i++)roster.find(c=>c.id===b.heroes[i].id).faction='duneriders';const mixed=createBattle(roster,REFERENCE_TEAM,'ashen-gate',42);assert.deepEqual(mixed.heroes.map(h=>h.factionTier),[3,3,3,2,2]);assert.equal(mixed.heroes[0].atk,525);assert.equal(mixed.heroes[0].def,315);assert.equal(mixed.heroes[3].atk,500);assert.equal(mixed.heroes[3].def,315);
});
test('Dragon, Dune, Ironclad, Neon and Wildgrove starting stats match every tier without doubling and are applied only to members',()=>{
 const expected={dragondynasty:{2:[525,300,1000],3:[525,315,1000]},duneriders:{2:[500,315,1000],3:[500,330,1000]},ironclad:{2:[500,300,1050],3:[500,300,1100]},neon_syndicate:{2:[515,300,1030],3:[520,312,1040]},wildgrove:{2:[500,300,1000],3:[500,300,1050]}};
 for(const [f,tiers]of Object.entries(expected))for(const n of [2,3,4,5]){const {b}=fixture(f,n);for(let i=0;i<5;i++){const h=b.heroes[i];assert.deepEqual([h.atk,h.def,h.maxHp],i<n?tiers[Math.min(3,n)]:[500,300,1000],f+' '+n);assert.equal(h.hp,h.maxHp);}}
});
test('starting bonuses use fully developed stats and do not inflate enemy scaling or alter catalog records',()=>{
 const {b,sources,roster}=fixture('ironclad',3,42,{progression:true});const base=awakenedStats(statsAtLevel(sources[0],60),2,2);assert.equal(b.heroes[0].maxHp,Math.round(base.hp*1.1));assert.equal(b.heroes[0].atk,base.atk);
 const plain=structuredClone(roster);REFERENCE_TEAM.forEach((id,i)=>plain.find(c=>c.id===id).faction=keys[i]);const baseline=createBattle(plain,REFERENCE_TEAM,'ashen-gate',42);const boosted=createBattle(roster,REFERENCE_TEAM,'ashen-gate',42);assert.deepEqual(boosted.enemies.map(e=>[e.hp,e.atk,e.def]),baseline.enemies.map(e=>[e.hp,e.atk,e.def]));assert.equal(sources[0].hp,1000);
});
test('Bloodcourt and Wildgrove heal exactly once per valid board move, use the highest tier and never heal outsiders or revive fallen members',()=>{
 for(const [f,n,rate]of [['bloodcourt',2,.03],['bloodcourt',3,.06],['wildgrove',2,.02],['wildgrove',3,.04]]){
  const {b,roster}=fixture(f,n);b.heroes.forEach(h=>h.hp=Math.floor(h.maxHp/2));b.heroes[0].hp=0;const next=turn(b);assert.equal(next.heroes[0].hp,0);for(let i=1;i<5;i++)assert.equal(next.heroes[i].hp,b.heroes[i].hp+(i<n?Math.round(b.heroes[i].maxHp*rate):0));assert.ok(validateSave(next,roster));
  const invalid=swap(b,-1,0);assert.equal(invalid.state,b);assert.ok(invalid.error);const caster=b.heroes[1];caster.mana=10;const c=cast(b,caster.uid,'enemy-0');assert.deepEqual(c.state.heroes.map(h=>h.hp),b.heroes.map(h=>h.hp));assert.equal(c.state.moves,0);
  const activated=structuredClone(b);activated.board[0].special='blast';const a=activate(activated,0,{frames:false});for(let i=1;i<n;i++)assert.equal(a.state.heroes[i].hp,b.heroes[i].hp+Math.round(b.heroes[i].maxHp*rate));
 }
});
test('matching-rune mana is15/25% Astral or10/30% Veldt, includes empty lanes, stacks with mana effects and leaves flat gifts alone',()=>{
 for(const [f,n,mult]of [['astral_concord',2,1.15],['astral_concord',3,1.25],['veldtborn',2,1.1],['veldtborn',3,1.3]]){
  const {b}=fixture(f,n);b.heroes.forEach(h=>{h.manaMax=1000;h.special.levels[0].tiles=1000;});const next=redTurn(b);assert.ok(next.heroes[4].mana>0);assert.ok(Math.abs(next.heroes[0].mana-next.heroes[4].mana*mult)<.011);
  const empty=structuredClone(b);empty.enemies[0].hp=0;empty.enemies[1].hp=0;const boosted=redTurn(empty);assert.ok(boosted.heroes[4].mana>next.heroes[4].mana);assert.ok(Math.abs(boosted.heroes[0].mana-boosted.heroes[4].mana*mult)<.011);
 }
 const {b,roster}=fixture('astral_concord',3);setKit(b,roster,0,kit([{id:'mana_raise',turns:0,scope:'other_allies'}]));b.heroes[0].mana=10;const gift=cast(b,'hero-0','enemy-0').state;assert.equal(gift.heroes[1].mana,1.5);assert.equal(gift.heroes[4].mana,1.5);
 for(const id of ['mana_surge','mana_slow','mana_block']){const {b}=fixture('veldtborn',3);b.heroes.forEach(h=>{h.manaMax=1000;h.special.levels[0].tiles=1000;});b.heroes[0].effects[id]={turns:2,source:'hero-0',appliedMove:0};const next=redTurn(b),base=next.heroes[4].mana;assert.ok(Math.abs(next.heroes[0].mana-(id==='mana_block'?0:base*1.3*(id==='mana_surge'?1.2:.85)))<.011);}
});
test('Frost prevents Burn at2 and Burn+Poison at3 only on members; other ailments and enemy Frost remain unaffected',()=>{
 for(const n of [2,3]){const {next,roster}=enemyAilment('frost',n,['burn','poison','frostbite','bleed']);for(let i=0;i<5;i++){assert.equal(!!next.heroes[i].effects.burn,i>=n);assert.equal(!!next.heroes[i].effects.poison,!(i<n&&n===3));assert.ok(next.heroes[i].effects.frostbite);assert.ok(next.heroes[i].effects.bleed);}assert.ok(validateSave(next,roster));}
 const {b,roster}=fixture('frost',3);setKit(b,roster,0,kit([{id:'burn',turns:2,scope:'enemy'}]));b.enemies[0].faction='frost';assert.ok(cast(ready(b),'hero-0','enemy-0').state.enemies[0].effects.burn);
});
test('Chymera extends only successfully applied Special ailments, can reach4turns, and respects cleanse/dispel/immunity rules',()=>{
 for(const n of [2,3]){
  const {b,roster}=fixture('chymera',n);setKit(b,roster,0,kit([{id:'poison',turns:3,scope:'enemies'},{id:'inc_atk',turns:2,scope:'self'},{id:'dispel',turns:0,scope:'enemy'}]));b.rng=1;const next=cast(ready(b),'hero-0','enemy-0').state;assert.equal(next.heroes[0].effects.inc_atk.turns,2);assert.equal(next.enemies[0].effects.poison.turns,4);assert.ok(next.enemies[0].effects.poison.factionExtended);if(n===3)assert.ok(next.enemies.every(e=>e.effects.poison.turns===4));assert.ok(validateSave(next,roster));
  const immune=structuredClone(b);immune.enemies.forEach(e=>e.passive={immune:['poison']});const stopped=cast(immune,'hero-0','enemy-0').state;assert.equal(stopped.rng,immune.rng);assert.ok(stopped.enemies.every(e=>!e.effects.poison));
  const warded=structuredClone(b);warded.enemies.forEach(e=>e.effects.block_debuffs={turns:2,source:e.uid,appliedMove:0});const blocked=cast(warded,'hero-0','enemy-0').state;assert.ok(blocked.enemies.slice(1).every(e=>!e.effects.poison));
 }
 const {b,roster}=fixture('chymera',3);setKit(b,roster,4,kit([{id:'burn',turns:2,scope:'enemy'}]));b.heroes[4].mana=10;assert.equal(cast(b,'hero-4','enemy-0').state.enemies[0].effects.burn.turns,2);
});
test('Chymera50% produces both seeded outcomes and rolls independently per application',()=>{
 let extended=0;for(let seed=1;seed<=160;seed++){const {b,roster}=fixture('chymera',2,seed);setKit(b,roster,0,kit([{id:'poison',turns:2,scope:'enemy'}]));const next=cast(ready(b),'hero-0','enemy-0').state;if(next.enemies[0].effects.poison.turns===3)extended++;else assert.equal(next.enemies[0].effects.poison.turns,2);}assert.ok(extended>50&&extended<110,extended+' successes');
 const {b,roster}=fixture('chymera',2);setKit(b,roster,0,kit([{id:'poison',turns:2,scope:'enemies'}]));b.rng=123456789;const next=cast(ready(b),'hero-0','enemy-0').state;assert.ok(new Set(next.enemies.map(e=>e.effects.poison.turns)).size>1);
});
test('each Nether member rolls independently once; tier3 guarantees its own percentage and never triggers again',()=>{
 let successes=0;const patterns=new Set();for(let seed=1;seed<=100;seed++){const {b}=fixture('nether',2,seed,{tileCosts:[8,10,10,10,10]});patterns.add(b.heroes.slice(0,2).map(h=>h.mana?'1':'0').join(''));for(let i=0;i<2;i++){if(b.heroes[i].mana){successes++;assert.equal(b.heroes[i].mana,i===0?.8:1);}}assert.equal(b.heroes[4].mana,0);}assert.ok(successes>65&&successes<135,successes+' successes');assert.ok(patterns.has('10')&&patterns.has('01'));
 for(const n of [3,4,5]){const {b,roster}=fixture('nether',n,42,{tileCosts:[8,10,15,10,10]});assert.equal(b.heroes[0].mana,1.2);assert.equal(b.heroes[1].mana,1.5);assert.equal(b.heroes[2].mana,2.25);b.heroes.forEach(h=>h.color='purple');const noMatch=structuredClone(b);noMatch.board.forEach(t=>t.color=t.color==='purple'?'yellow':t.color);const next=turn(noMatch);assert.deepEqual(next.heroes.map(h=>h.mana),b.heroes.map(h=>h.mana));const store=new Map(),storage={setItem:(k,v)=>store.set(k,v),getItem:k=>store.get(k)||null};save(storage,BATTLE_KEY,b);assert.deepEqual(loadBattle(storage,roster).heroes.map(h=>h.mana),b.heroes.map(h=>h.mana));}
});
test('Umbra rolls per living member, stacks additively on that member only and never procs from casts, invalid swaps or multiple cascades',()=>{
 const {b,roster}=fixture('umbra',2);b.heroes.forEach(h=>h.hp=500);b.rng=8;let next=turn(b);assert.equal(next.heroes[0].factionStacks,1);assert.equal(next.heroes[1].factionStacks,0);assert.deepEqual([next.heroes[0].atk,next.heroes[0].def,next.heroes[0].maxHp,next.heroes[0].hp],[510,306,1020,520]);assert.equal(next.heroes[4].maxHp,1000);
 next.rng=8;next=turn(next);assert.equal(next.heroes[0].factionStacks,2);assert.deepEqual([next.heroes[0].atk,next.heroes[0].def,next.heroes[0].maxHp,next.heroes[0].hp],[520,312,1040,540]);assert.ok(validateSave(next,roster));
 next.heroes[0].mana=10;const casted=cast(next,'hero-0','enemy-0').state;assert.equal(casted.heroes[0].factionStacks,2);assert.equal(casted.rng,next.rng);assert.equal(swap(next,-1,0).state,next);
 next.rng=8;next.board[0].special='blast';const a=activate(next,0,{frames:false}).state;assert.equal(a.heroes[0].factionStacks,3);assert.equal(a.heroes[1].factionStacks,0);
 const three=fixture('umbra',3).b;three.rng=8;const t=turn(three);assert.deepEqual(t.heroes.slice(0,3).map(h=>h.factionStacks),[1,1,0]);
 const dead=fixture('umbra',2).b;dead.heroes[0].hp=0;dead.rng=8;const d=turn(dead);assert.equal(d.heroes[0].factionStacks,0);assert.equal(d.heroes[0].hp,0);assert.equal(d.heroes[1].factionStacks,1);
});
test('new faction metadata and4-turn ailments round-trip; malformed faction states are rejected',()=>{
 for(const f of keys){const {b,roster}=fixture(f,3);assert.ok(validateSave(JSON.parse(JSON.stringify(b)),roster));for(const mutate of [s=>s.heroes[0].factionTier=2,s=>s.heroes[0].factionLastTurn=99,s=>s.enemies[0].factionTier=3]){const corrupt=structuredClone(b);mutate(corrupt);assert.equal(validateSave(corrupt,roster),false);}}
 const {b,roster}=fixture('umbra',3);b.heroes[0].factionStacks=1;assert.equal(validateSave(b,roster),false);
 const bad=fixture('frost',3);bad.b.heroes[0].effects.burn={turns:4,source:'enemy-0',appliedMove:0};assert.equal(validateSave(bad.b,bad.roster),false);
});
test('Guide and team summaries share all12 exact rules and display mixed active groups without applying both tiers',()=>{
 const {b}=fixture('astral_concord',3),html=factionTeamHTML(b.heroes);assert.match(html,/Astral Concord · 3\+/);assert.match(html,/25%/);assert.doesNotMatch(html,/15%/);const guide=factionGuideHTML();for(const f of Object.values(FACTION_BONUSES))assert.ok(guide.includes(f.name));assert.equal((guide.match(/<details>/g)||[]).length,12);assert.equal(factionGroups([]).length,0);
});
test('Auto uses the same faction-aware resolver and completes real battles with valid states',()=>{
 for(const f of ['astral_concord','chymera','umbra','nether']){const group=original.filter(c=>c.faction===f).slice(0,3).map(c=>c.id);const fillers=REFERENCE_TEAM.filter(id=>!group.includes(id)&&original.find(c=>c.id===id).faction!==f).slice(0,2);let b=createBattle(original,[...group,...fillers],'ashen-gate',117),steps=0;while(b.phase==='playing'&&steps++<140){const a=chooseAutoAction(b);assert.ok(a);const result=applyAutoAction(b,a);assert.ok(!result.error);b=result.state;assert.ok(validateSave(b,original),f);}assert.notEqual(b.phase,'playing',f+' stalled');}
});

test('innate faction healing and immunities coexist with timed effects and cannot be dispelled',()=>{
 const {b,roster}=fixture('bloodcourt',2);b.heroes[0].hp=500;b.heroes[0].effects={heal:{turns:2,source:'hero-0',appliedMove:0},poison:{turns:2,source:'enemy-0',appliedMove:0},block_buffs:{turns:2,source:'enemy-0',appliedMove:0}};b.heroes[0].passive={kind:'regen',value:.05};const n=turn(b);assert.equal(n.heroes[0].hp,500+30+100+50-40);assert.ok(validateSave(n,roster));
 const f=fixture('frost',3);f.b.heroes[0].passive={kind:'immune_effect',immune:['mana_slow']};const e=f.b.enemies[0];e.special=kit([{id:'burn',turns:2,scope:'enemies'},{id:'poison',turns:2,scope:'enemies'},{id:'mana_slow',turns:2,scope:'enemies'},{id:'dispel',turns:0,scope:'enemies'}],{aoe:true});f.roster.find(c=>c.id===e.id).special=structuredClone(e.special);e.manaMax=10;e.mana=6;e.countdown=1;const immune=turn(f.b);assert.deepEqual(immune.heroes[0].effects,{});assert.ok(!immune.heroes[1].effects.burn&&!immune.heroes[1].effects.poison);assert.ok(immune.heroes[1].effects.mana_slow);assert.equal(immune.heroes[1].factionTier,3);
});
test('Nether percentage uses exact fractional charge and is not amplified by opening Mana Flow',()=>{
 const {b}=fixture('nether',3,42,{progression:true,tileCosts:[6.5,10,15,10,10]});assert.equal(b.heroes[0].mana,.975);assert.ok(b.heroes[2].effects.mana_surge);assert.equal(b.heroes[2].mana,2.25);
});
