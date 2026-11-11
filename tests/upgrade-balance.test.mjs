import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {UPGRADE_BALANCE_REVISION,beforeUpgradeBalance} from '../src/upgrade-balance-revision.js';
import {createBattle,cast,validateSave} from '../src/engine.js';
import {chooseAutoAction,applyAutoAction} from '../src/auto-battle.js';
import {defaultProfile,normalizeProfile,validateProfile} from '../src/progression.js';
import {REFERENCE_TEAM} from './reference-team.mjs';
const read=async p=>JSON.parse(await readFile(new URL('../'+p,import.meta.url))),roster=await read('data/champions.json'),source=await read('data/source-champions.json'),design=await read('data/roster-design.json'),proposal=await read('data/upgrade-balance-proposal.json');
const sha=b=>createHash('sha256').update(b).digest('hex');
test('only the twelve approved kits change; source inputs, identities and original roster fingerprint remain verifiable',()=>{
 assert.equal(UPGRADE_BALANCE_REVISION.length,12);assert.deepEqual(UPGRADE_BALANCE_REVISION.map(x=>x.id),proposal.proposals.map(x=>x.id));
 assert.equal(sha(JSON.stringify(beforeUpgradeBalance(roster))),proposal.normalizedRosterSha256);
 for(const x of UPGRADE_BALANCE_REVISION){const c=roster.find(c=>c.id===x.id);assert.deepEqual(c,x.after);assert.deepEqual(source.find(c=>c.id===x.id),x.sourceAfter);assert.deepEqual(design.champions[x.id],x.designAfter);assert.deepEqual(x.designAfter.levelOverrides,c.special.levels);
 for(const k of Object.keys(x.before))if(!['special','manaSpeed','ability_desc'].includes(k))assert.deepEqual(c[k],x.before[k],x.id+' '+k);
 assert.equal(c.manaSpeed,x.id==='orrix_amethyst_bulwark'?'average':x.before.manaSpeed);
 }
 const bad=structuredClone(roster);bad.find(c=>c.id===UPGRADE_BALANCE_REVISION[0].id).atk++;assert.throws(()=>beforeUpgradeBalance(bad));
});
test('every approved tier heals, protects and damages the declared recipients, costs mana but no move, and permits legal Auto continuation',()=>{
 for(const x of UPGRADE_BALANCE_REVISION)for(const l of x.after.special.levels){const c=x.after,b=createBattle(roster,[c.id,...REFERENCE_TEAM.slice(0,4)],'ashen-gate',42);
 b.enemies.forEach(e=>{e.hp=e.maxHp=100000;e.effects={};e.shield=0;e.passive=null;});b.heroes.forEach(h=>{h.hp=Math.floor(h.maxHp*.2);h.effects={poison:{turns:3,source:'enemy-0',appliedMove:0}};});const a=b.heroes[0];a.mana=l.tiles;const before=structuredClone(b),target=l.target==='self'?a.uid:'enemy-1',r=cast(b,a.uid,target,l.level,{frames:false});assert.ok(!r.error,c.id);assert.deepEqual(b,before);assert.equal(r.state.moves,0);assert.equal(r.state.heroes[0].mana,0);assert.ok(validateSave(r.state,roster));
 if(l.healing)for(let i=0;i<5;i++)assert.ok(r.state.heroes[i].hp>b.heroes[i].hp,c.id+' healing');
 if(l.damage)for(let i=0;i<3;i++)assert.equal(r.state.enemies[i].hp<b.enemies[i].hp,l.aoe||i===1,c.id+' damage');
 for(const e of l.effects){const recipients=e.scope==='allies'?r.state.heroes:e.scope==='enemies'?r.state.enemies:e.scope==='self'?[r.state.heroes[0]]:[r.state.enemies[1]];
 if(e.id==='remove_debuffs'){assert.ok(recipients.every(h=>!h.effects.poison));continue;}if(e.id==='dispel')continue;for(const u of recipients)assert.equal(u.effects[e.id]?.turns,e.turns,c.id+' '+e.id);}
 const action=chooseAutoAction(r.state);assert.ok(action);assert.ok(!applyAutoAction(r.state,action).error,c.id+' Auto');
 }
});
test('approved heroes retain existing-save development and faction identity',()=>{
 const p=defaultProfile();for(const x of UPGRADE_BALANCE_REVISION){p.collection[x.id]=1;p.heroXp[x.id]=300;p.ascensions[x.id]=1;p.awakenings[x.id]=0;}
 const n=normalizeProfile(p,roster);assert.ok(validateProfile(n,roster));for(const x of UPGRADE_BALANCE_REVISION){assert.equal(n.collection[x.id],1);assert.equal(n.heroXp[x.id],300);assert.equal(n.ascensions[x.id],1);assert.equal(x.before.faction,x.after.faction);}
});
