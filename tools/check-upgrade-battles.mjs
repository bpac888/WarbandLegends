// Deterministic before/after smoke matches, not a general win-rate study.
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {createBattle,validateSave} from '../src/engine.js';
import {chooseAutoAction,applyAutoAction} from '../src/auto-battle.js';
import {UPGRADE_BALANCE_REVISION,beforeUpgradeBalance} from '../src/upgrade-balance-revision.js';
const roster=JSON.parse(await fs.readFile('data/champions.json')),original=beforeUpgradeBalance(roster),rows=[];
for(const x of UPGRADE_BALANCE_REVISION)for(const seed of [31,117]){
 const party=[x.id,...['ravel','nima_dewthread','frost-viking','barkskin_bruiser','jade_archer_linh'].filter(id=>id!==x.id&&roster.some(c=>c.id===id)).slice(0,4)];
 // Fill using verified IDs, preserving unique starting slots.
 for(const c of roster)if(party.length<5&&!party.includes(c.id))party.push(c.id);
 const row={id:x.id,seed,party};
 for(const [version,catalog]of [['before',original],['after',roster]]){
 let b=createBattle(catalog,party,'ashen-gate',seed),actions=0;
 while(b.phase==='playing'&&actions<140){const a=chooseAutoAction(b);assert.ok(a,x.id+' no action');const r=applyAutoAction(b,a);assert.ok(!r.error,x.id+' '+r.error);b=r.state;assert.ok(validateSave(b,catalog));actions++;}
 assert.notEqual(b.phase,'playing',x.id+' stalled');row[version]={outcome:b.phase,moves:b.moves,actions,survivors:b.heroes.filter(h=>h.hp>0).length};
 }
 rows.push(row);
}
await fs.writeFile('data/upgrade-battle-smoke.json',JSON.stringify({scope:'24 before/after pairs on two fixed seeds in Ashen Gate; real Auto decisions, no fabricated victories. Normal-max default stats; no claim about all levels, bosses or PvP balance.',rows},null,2)+'\n');
console.log(JSON.stringify({pairedMatches:rows.length,totalMatches:rows.length*2,completed:true}));
