import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {historicalRecords} from '../src/roster-identity.js';
import {normalizeProfile,defaultProfile,validateProfile} from '../src/progression.js';
const read=async p=>JSON.parse(await readFile(new URL('../'+p,import.meta.url))),roster=await read('data/champions.json'),audit=await read('data/roster-name-audit.json');
test('all 189 character names are distinct and each documented rename has no stale personal-name reference',()=>{
 const normalize=s=>s.normalize('NFKD').toLowerCase().replace(/[^a-z0-9]/g,'');assert.equal(new Set(roster.map(c=>normalize(c.name))).size,189);assert.equal(audit.renames.length,25);
 for(const x of audit.renames){const c=roster.find(c=>c.id===x.id);assert.equal(c.name,x.championAfter.name);assert.ok(!new RegExp('\\b'+x.oldPersonalName+'\\b').test(c.name+' '+c.lore+' '+(c.passive?.desc||'')));assert.notEqual(x.championBefore.name,x.championAfter.name);for(const key of ['champion','source']){const before=x[key+'Before'],after=x[key+'After'];assert.ok(Object.keys(before).every(k=>['name','lore','passive'].includes(k)));if(before.passive){const {desc:a,...am}=before.passive,{desc:b,...bm}=after.passive;assert.deepEqual(am,bm);}}}
});
test('historical checks reject unapproved identity edits instead of hiding them',()=>{const c=structuredClone(roster.find(c=>c.id===audit.renames[0].id));c.name='Unapproved name';assert.throws(()=>historicalRecords([c],audit));});
test('all renamed copies, team IDs, XP and summon history survive profile normalization',()=>{
 for(const x of audit.renames){const p={...defaultProfile(),helpSeen:true,collection:{...defaultProfile().collection,[x.id]:1},heroXp:{[x.id]:10},history:[{sequence:1,championId:x.id,at:'2026-10-27T12:00:00Z'}],summons:1};p.team=[x.id,...p.team.filter(id=>id!==x.id)].slice(0,5);const next=normalizeProfile(JSON.parse(JSON.stringify(p)),roster);assert.ok(validateProfile(next,roster));assert.deepEqual(next,p);}
});
