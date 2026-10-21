import {REFERENCE_TEAM,referenceProfile} from './reference-team.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createBattle,cast,swap,activate,validMoves,validateSave} from '../src/engine.js';
import {campaignStages,getEncounter} from '../src/encounters.js';
import {SCENARIOS,scenarioStatus} from '../src/chapter.js';
import {chargeComparison} from '../src/special-plan.js';
import {chargeComparisonHTML,encounterTactics} from '../src/tactics-ui.js';
import {campaign} from '../src/adventure-ui.js';
import {loadBattle,BATTLE_KEY} from '../src/storage.js';
import {makeBackup,parseBackup} from '../src/save-files.js';
const roster=JSON.parse(await readFile(new URL('../data/champions.json',import.meta.url)));
const make=(n=10)=>createBattle(roster,REFERENCE_TEAM,`campaign-normal-${String(n).padStart(2,'0')}`,99,{progression:true});
const ready=(s,index=2)=>{const h=s.heroes[index];h.mana=h.manaMax;return h;};
const trigger=()=>{const s=make();s.enemies[0].hp=s.enemies[2].hp=0;const actor=ready(s);return cast(s,actor.uid,actor.uid);};
test('second chapter authors five distinct tactics in all difficulties without changing stage identities or locks',()=>{
 for(const difficulty of ['normal','hard','nightmare']){const stages=campaignStages(difficulty).slice(5,10);assert.equal(new Set(stages.map(s=>s.tacticLabel)).size,5);for(const [i,e]of stages.entries()){assert.equal(e.number,i+6);assert.equal(e.id,`campaign-${difficulty}-${String(i+6).padStart(2,'0')}`);assert.equal(e.chapter,'The Hollow Covenant');const b=createBattle(roster,REFERENCE_TEAM,e.id,33,{progression:true});assert.ok(validateSave(b,roster),e.id);assert.match(encounterTactics(e),/Encounter tactics/);}}
 const html=campaign(referenceProfile(),{chapter:1});assert.match(html,/The Hollow Covenant/);assert.match(html,/STAGES 6–10/);assert.equal((html.match(/class="campaign-node/g)||[]).length,0);assert.equal((html.match(/class="map-node campaign-node/g)||[]).length,25);assert.match(html,/data-stage="campaign-normal-06"[^>]*disabled/);
});
test('regeneration, relay charge, ailment wards and death pacts are real opening state',()=>{
 assert.equal(make(6).enemies[1].effects.heal.turns,2);assert.equal(make(7).enemies[2].mana,8);assert.equal(make(7).enemies[2].manaMax,12);
 assert.ok(make(8).enemies.every(e=>e.effects.block_debuffs.turns===2));const rise=make(9);assert.equal(rise.enemies[0].effects.revive_on_death.turns,2);assert.equal(rise.enemies[2].effects.revive_on_death.turns,2);assert.ok(!rise.enemies[1].effects.revive_on_death);assert.equal(make(10).enemies[1].id,'archangel_lucifer');
});
test('spore wards block new ailments but an area dispel removes them before the next application',()=>{
 let s=make(8);s.enemies.forEach(e=>e.hp=e.maxHp=10000);let actor=ready(s,0),r=cast(s,actor.uid,'enemy-0',1);assert.ok(r.state.enemies.every(e=>!e.effects.burn));assert.ok(r.state.enemies.some((e,i)=>e.hp<s.enemies[i].hp));s=r.state;actor=ready(s,0);r=cast(s,actor.uid,'enemy-0',2);assert.ok(r.state.enemies.every(e=>!e.effects.block_debuffs&&e.effects.burn));
});
test('death-pact sentry revives once at 30% HP; pre-hit Dispel prevents the revival',()=>{
 let s=make(9);s.enemies[0].hp=1;let actor=ready(s,0),r=cast(s,actor.uid,'enemy-0',1);assert.equal(r.state.enemies[0].hp,Math.floor(s.enemies[0].maxHp*.3));assert.equal(r.state.enemies[0].reviveUsed,true);s=r.state;s.enemies[0].hp=1;actor=ready(s,0);assert.equal(cast(s,actor.uid,'enemy-0',1).state.enemies[0].hp,0);
 s=make(9);s.enemies[0].hp=1;actor=ready(s,4);r=cast(s,actor.uid,'enemy-0');assert.equal(r.state.enemies[0].hp,0);assert.equal(r.state.enemies[0].reviveUsed,false);
});
test('Last Light waits for both escorts, ignores health thresholds and never triggers after boss death',()=>{
 const s=make();s.enemies[1].hp=1;s.enemies[0].hp=0;const actor=ready(s);assert.equal(cast(s,actor.uid,actor.uid).state.scenario.triggered,false);
 s.enemies[1].hp=0;s.enemies[2].hp=0;s.phase='victory';assert.ok(cast(s,actor.uid,actor.uid).error);assert.equal(s.scenario.triggered,false);
 const atFull=trigger();assert.equal(atFull.state.enemies[1].hp,atFull.state.enemies[1].maxHp);assert.ok(atFull.state.scenario.triggered);assert.deepEqual(atFull.frames.map(f=>f.kind),['skill','mechanic']);assert.equal(atFull.frames.at(-1).name,'Last Light');
});
test('Last Light applies two-move defense and Riposte, with no stolen attack or mana',()=>{
 const r=trigger(),boss=r.state.enemies[1];assert.equal(boss.effects.inc_def.turns,2);assert.equal(boss.effects.counterattack.turns,2);assert.equal(boss.countdown,4);assert.equal(boss.actions,0);assert.equal(boss.mana,0);assert.equal(r.state.moves,0);assert.equal(scenarioStatus(r.state).name,'Last Light');assert.equal(scenarioStatus(r.state).phase,'triggered');assert.ok(validateSave(r.state,roster));
 const s=make();s.enemies[0].hp=s.enemies[2].hp=0;s.enemies[1].countdown=1;const actor=ready(s);assert.equal(cast(s,actor.uid,actor.uid).state.enemies[1].countdown,2);
});
test('Last Light obeys Buff Seal and Dispel; blocked or removed buffs do not rearm it',()=>{
 let s=make();s.enemies[0].hp=s.enemies[2].hp=0;s.enemies[1].effects.block_buffs={source:'hero-0',turns:2,appliedMove:0};let actor=ready(s),r=cast(s,actor.uid,actor.uid);assert.ok(r.state.scenario.triggered);assert.ok(!r.state.enemies[1].effects.inc_def&&!r.state.enemies[1].effects.counterattack);assert.ok(r.state.enemies[1].countdown>=2);
 s=trigger().state;s.enemies[1].hp=s.enemies[1].maxHp=10000;actor=ready(s,4);const hp=actor.hp;r=cast(s,actor.uid,'enemy-1');assert.ok(!r.state.enemies[1].effects.inc_def&&!r.state.enemies[1].effects.counterattack);assert.equal(r.state.heroes[4].hp,hp);assert.equal(r.frames.filter(f=>f.kind==='mechanic').length,0);
});
test('Riposte phase answers direct attacks, not rune strikes, and expires on the normal clock',()=>{
 let s=trigger().state;s.enemies[1].hp=s.enemies[1].maxHp=100000;s.enemies[1].def=100000;let actor=ready(s,0);actor.shield=0;delete actor.effects.shield;const hp=actor.hp;const direct=cast(s,actor.uid,'enemy-1',1);assert.ok(direct.state.heroes[0].hp<hp);assert.ok(direct.state.log.some(l=>l.text.includes('· Counterattack')));
 s=trigger().state;s.enemies[1].hp=s.enemies[1].maxHp=100000;s.enemies[1].def=100000;s.enemies[1].countdown=20;const before=s.heroes.map(h=>h.hp);let r=swap(s,...validMoves(s.board)[0]);assert.deepEqual(r.state.heroes.map(h=>h.hp),before);assert.equal(r.state.enemies[1].effects.counterattack.turns,1);r=swap(r.state,...validMoves(r.state.board)[0]);assert.ok(!r.state.enemies[1].effects.counterattack&&!r.state.enemies[1].effects.inc_def);
});
test('special-rune and board actions check escort defeat only after their full resolution',()=>{
 for(const special of [false,true]){const s=make();s.enemies[0].hp=s.enemies[2].hp=0;s.enemies[1].countdown=10;s.enemies[1].def=100000;let r;if(special){s.board[0].special='blast';r=activate(s,0);}else r=swap(s,...validMoves(s.board)[0]);assert.ok(r.state.scenario.triggered);assert.equal(r.frames.at(-2).kind,'mechanic');assert.equal(r.frames.at(-1).kind,'settled');}
});
test('both guardian types persist independently; legacy fights keep their original roster and rules',()=>{
 const s=trigger().state,p=referenceProfile(),b=parseBackup(JSON.stringify(makeBackup(p,s)),roster).battle;assert.deepEqual(b,s);const loaded=loadBattle({getItem:key=>key===BATTLE_KEY?JSON.stringify(s):null},roster);assert.deepEqual(loaded.scenario,s.scenario);assert.ok(validateSave(loaded,roster));
 const old=make();delete old.scenario;old.enemies[0].hp=old.enemies[2].hp=0;const actor=ready(old),r=cast(old,actor.uid,actor.uid);assert.ok(!r.state.scenario);assert.ok(validateSave(r.state,roster));assert.match(encounterTactics(getEncounter(old.stageId),old),/Last Light/);assert.match(encounterTactics(getEncounter(old.stageId),old),/keeps its original rules/);
 const swapped=make();swapped.scenario.id='iron-overpressure';assert.equal(validateSave(swapped,roster),false);assert.equal(Object.keys(SCENARIOS).length,2);
});
test('charge comparisons show Vex single-target/area tradeoff and all changed durations/recipients',()=>{
 const c=roster.find(c=>c.id==='elixir_apotheon'),rows=chargeComparison(c.special.levels[1],c.special.levels[2]);const damage=rows.find(r=>r.name==='Direct damage');assert.match(damage.before,/202% ATK.*selected enemy/);assert.match(damage.after,/190% ATK.*all enemies/);assert.match(rows.find(r=>r.name==='Mana Slow').before,/Selected enemy.*1 board move/);assert.match(rows.find(r=>r.name==='Mana Slow').after,/All living enemies.*2 board moves/);assert.match(chargeComparisonHTML(c,3),/Compare with Charge 2/);assert.equal(chargeComparisonHTML(c,1),'');
 const fen=roster.find(c=>c.id==='spore_engineer'),f=chargeComparison(...fen.special.levels);assert.match(f.find(r=>r.name==='Healing').before,/22%/);assert.match(f.find(r=>r.name==='Healing').after,/32%/);assert.equal(f.find(r=>r.name==='Poison').before,'Not applied');
});
test('all multi-charge comparisons are complete, deterministic and never mutate hero kits',()=>{
 const before=structuredClone(roster);for(const c of roster)for(let i=1;i<c.special.levels.length;i++){const rows=chargeComparison(c.special.levels[i-1],c.special.levels[i]);assert.ok(rows.length>=2);assert.ok(rows.every(r=>r.name&&r.before&&r.after&&r.before!==r.after));assert.deepEqual(rows,chargeComparison(c.special.levels[i-1],c.special.levels[i]));}assert.deepEqual(roster,before);assert.deepEqual(chargeComparison(null,{}),[]);
});
