// A modest first-legal-move policy is a regression probe, not an optimal player.
import {readFile} from 'node:fs/promises';
import {createBattle,validMoves,swap,cast,readyLevel,living,manaLevels} from '../src/engine.js';
import {STARTER_TEAM} from '../src/progression.js';
const roster=JSON.parse(await readFile(new URL('../data/champions.json',import.meta.url)));
for(const level of [1,10,30])for(const stage of ['ashen-gate','frozen-pass','veil-sanctum']){
 let wins=0,moves=0;
 for(let seed=1;seed<=30;seed++){
 let b=createBattle(roster,STARTER_TEAM,stage,seed,{progression:true,levels:Object.fromEntries(STARTER_TEAM.map(id=>[id,level]))});
 for(let step=0;step<150&&b.phase==='playing';step++){
 for(const hero of b.heroes){const charge=readyLevel(hero);if(!charge)continue;const spec=manaLevels(hero).find(l=>l.level===charge);const target=spec.target==='self'?hero:spec.target==='enemy'?living(b.enemies)[0]:living(b.heroes).sort((a,z)=>a.hp/a.maxHp-z.hp/z.maxHp)[0];if(target)b=cast(b,hero.uid,target.uid,charge).state;}
 if(b.phase==='playing')b=swap(b,...validMoves(b.board)[0]).state;
 }if(b.phase==='victory')wins++;moves+=b.moves;
 }console.log(JSON.stringify({level,stage,wins,seeds:30,averageMoves:+(moves/30).toFixed(1)}));
}
