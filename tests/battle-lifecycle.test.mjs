import test from 'node:test';import assert from 'node:assert/strict';
import {clearBattleSave,PROFILE_KEY,BATTLE_KEY,PREVIOUS_BATTLE_KEY,LEGACY_BATTLE_KEY} from '../src/storage.js';
import {defaultProfile} from '../src/progression.js';import {reserveEntry} from '../src/mode-progression.js';
import {createBattle} from '../src/engine.js';import {readFile} from 'node:fs/promises';
const roster=JSON.parse(await readFile(new URL('../data/champions.json',import.meta.url)));
test('discarding legacy battle snapshots preserves the saved profile and other browser data',()=>{
 const values=new Map([[PROFILE_KEY,'account progress'],[BATTLE_KEY,'current'],[PREVIOUS_BATTLE_KEY,'previous'],[LEGACY_BATTLE_KEY,'legacy'],['other-game','untouched']]);
 assert.ok(clearBattleSave({removeItem:key=>values.delete(key)}));assert.deepEqual([...values],[[PROFILE_KEY,'account progress'],['other-game','untouched']]);
 assert.equal(clearBattleSave({removeItem(){throw Error('unavailable');}}),false);
});
test('abandoned event attempts remain spent and a fresh entry consumes another attempt',()=>{
 const p=defaultProfile(),when=new Date('2026-10-23T12:00:00Z');
 // Pick the authored event ID from the engine's encounter catalogue.
 return import('../src/modes.js').then(({EVENT_STAGES})=>{
  const id=EVENT_STAGES.find(e=>e.eventId==='veil_of_umbra').id;
  const first=reserveEntry(p,createBattle(roster,p.team,id,1),when);assert.equal(first.error,undefined);
  const abandoned={...first.profile,eventEntry:null};const second=reserveEntry(abandoned,createBattle(roster,p.team,id,2),when);
  assert.equal(second.profile.eventAttempts['veil_of_umbra:2026-10'],2);assert.equal(second.profile.gold,p.gold);assert.equal(second.profile.gems,p.gems);
 });
});
