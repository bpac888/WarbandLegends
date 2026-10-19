// First-legal-move regression probe; this is not an optimal player or final balance proof.
import {readFile} from 'node:fs/promises';
import {createBattle,validMoves,swap,cast,readyLevel,living,manaLevels} from '../src/engine.js';
import {STARTER_TEAM} from '../src/progression.js';
import {campaignStages} from '../src/encounters.js';
const roster=JSON.parse(await readFile(new URL('../data/champions.json',import.meta.url)));
for(const level of [1,10,30])for(const stage of campaignStages().slice(0,5)){
 let wins=0,triggered=0,moves=0,firstPhaseWin=null;
 for(let seed=1;seed<=20;seed++){
  let b=createBattle(roster,STARTER_TEAM,stage.id,seed,{progression:true,levels:Object.fromEntries(STARTER_TEAM.map(id=>[id,level]))});
  for(let step=0;step<150&&b.phase==='playing';step++){
   for(const original of b.heroes){if(b.phase!=='playing')break;const hero=b.heroes.find(h=>h.uid===original.uid),charge=readyLevel(hero);if(!charge)continue;const spec=manaLevels(hero).find(l=>l.level===charge),target=spec.target==='self'?hero:spec.target==='enemy'?living(b.enemies)[0]:living(b.heroes).sort((a,z)=>a.hp/a.maxHp-z.hp/z.maxHp)[0];if(target)b=cast(b,hero.uid,target.uid,charge).state;}
   if(b.phase==='playing')b=swap(b,...validMoves(b.board)[0]).state;
  }
  if(b.phase==='victory'){wins++;if(b.scenario?.triggered&&firstPhaseWin===null)firstPhaseWin=seed;}
  if(b.scenario?.triggered)triggered++;moves+=b.moves;
 }
 console.log(JSON.stringify({level,stage:stage.id,wins,seeds:20,averageMoves:+(moves/20).toFixed(1),...(stage.scenario?{triggered,firstPhaseWin}:{})}));
}
