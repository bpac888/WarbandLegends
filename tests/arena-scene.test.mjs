import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,stat} from 'node:fs/promises';
import {arenaScene,arenaIndex} from '../src/arena-scene.js';
import {ARENA_RIVALS} from '../src/modes.js';
import {defaultProfile} from '../src/progression.js';
import {createBattle} from '../src/engine.js';
const roster=JSON.parse(await readFile(new URL('../data/champions.json',import.meta.url)));
test('Arena selection wraps consistently in both directions, including fast repeated navigation',()=>{assert.equal(arenaIndex(-1),8);assert.equal(arenaIndex(9),0);assert.equal(arenaIndex(-28),8);for(let i=-100;i<=100;i++)assert.ok(arenaIndex(i)>=0&&arenaIndex(i)<9);});
test('each single-opponent view targets its own unchanged four-member encounter and full-body art',async()=>{
 const p=defaultProfile();for(let i=0;i<ARENA_RIVALS.length;i++){const r=ARENA_RIVALS[i],html=arenaScene(p,roster,{selected:i});assert.equal((html.match(/class="arena-fighter"/g)||[]).length,1);assert.ok(html.includes('data-stage="arena-'+r.preset_id+'"'));assert.ok(html.includes('assets/arena/'+r.preset_id+'.webp'));assert.ok(!/Edit Warband|Visit Shop|rival-portraits|GHOST RIVALS/.test(html));assert.ok((await stat(new URL('../assets/arena/'+r.preset_id+'.webp',import.meta.url))).size>100000);const b=createBattle(roster,p.team,'arena-'+r.preset_id,42);assert.deepEqual(b.enemies.map(e=>e.id),r.team_templates);}
});
