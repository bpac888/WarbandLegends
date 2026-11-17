import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {handleChampionshipRequest} from '../server/championships.js';
import {championshipSnapshot,createChampionshipBattle} from '../src/championship-battle.js';
import {xpForLevel} from '../src/development.js';
import {defaultProfile} from '../src/progression.js';import {validMoves} from '../src/engine.js';import {applyAutoAction} from '../src/auto-battle.js';
const roster=JSON.parse(fs.readFileSync(new URL('../data/champions.json',import.meta.url))),profile=defaultProfile(),user={id:'11111111-1111-4111-8111-111111111111'},rival='22222222-2222-4222-8222-222222222222';
const ok=data=>({ok:true,status:200,data});
const run=(action,input,upstream,configured=true)=>handleChampionshipRequest({action,input,user,upstream,configured});
test('ranked API requires server configuration and refuses a switched account',async()=>{
 const unexpected=async()=>assert.fail('Should not access database');await assert.rejects(run('championship-dashboard',{},unexpected,false),/not connected/);await assert.rejects(run('championship-team',{userId:rival,kind:'attack',ids:profile.team},unexpected),/account changed/);
});
test('active-attack refreshes validate ownership and preserve the explicitly chosen defense',async()=>{
 const frozen={ids:profile.team,levels:{[profile.team[0]]:3}},calls=[];
 const upstream=async(path,options)=>{assert.equal(options.admin,true);calls.push({path,options});if(path.includes('/player_saves?'))return ok([{profile,revision:1}]);if(path.includes('/championship_teams?'))return ok([{attack_ids:profile.team,defense_ids:profile.team,defense_snapshot:frozen}]);assert.ok(path.endsWith('/championship_publish'));assert.deepEqual(options.body.snapshot,championshipSnapshot(profile,profile.team,roster));return ok({teams:{attack_ids:profile.team,defense_ids:profile.team}});};
 await run('championship-team',{userId:user.id,kind:'attack',ids:profile.team},upstream);assert.equal(calls.length,3);
 await assert.rejects(run('championship-team',{userId:user.id,kind:'defense',ids:[...profile.team.slice(1),'yshmir_worldwound']},upstream),/collection/);
});
test('battle start uses server roster, current active team and automatically upgraded rival heroes, ignoring client stats',async()=>{
 const defense=championshipSnapshot(profile,profile.team,roster),grown=structuredClone(profile);for(const id of grown.team)grown.heroXp[id]=xpForLevel(roster.find(c=>c.id===id),10);let saved;
 const upstream=async(path,options)=>{if(path.includes('/player_saves?'))return ok([{profile:path.includes(rival)?grown:profile}]);if(path.includes('/championship_teams?'))return ok([{user_id:user.id,attack_ids:[...profile.team].reverse(),defense_ids:profile.team},{user_id:rival,defense_ids:profile.team,defense_snapshot:defense,updated_at:'2026-11-16T00:00:00Z'}]);saved=options.body;return ok({id:saved.battle_id,state:saved.state});};
 const result=await run('championship-start',{userId:user.id,opponent:rival,state:{phase:'victory'},attackStats:{hp:999999}},upstream);assert.equal(result.state.phase,'playing');assert.equal(result.state.heroes.length,5);assert.deepEqual(result.state.heroes.map(h=>h.id),profile.team);assert.equal(result.state.enemies.length,5);assert.ok(result.state.enemies.every(h=>h.level===10));assert.ok(result.state.heroes.every(h=>h.level===1));assert.ok(Object.values(defense.levels).every(level=>level===1));assert.ok(result.state.heroes.every(h=>h.hp<999999));assert.equal(saved.player,user.id);assert.equal(saved.rival,rival);assert.ok(saved.state.id===saved.battle_id);
});
test('a claimed victory cannot settle an unfinished or illegal replay',async()=>{
 const snapshot=championshipSnapshot(profile,profile.team,roster),state=createChampionshipBattle(roster,snapshot,snapshot,23,'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa');
 const upstream=async(path)=>{assert.ok(path.includes('attacker_id=eq.'+user.id));return ok([{initial_state:state,status:'open'}]);};
 await assert.rejects(run('championship-finish',{userId:user.id,id:state.id,victory:true,actions:[]},upstream),/Finish the battle/);
 await assert.rejects(run('championship-finish',{userId:user.id,id:state.id,actions:[{kind:'win'}]},upstream),/could not be verified/);
});
test('completed replays are re-executed and ownership is always queried before settlement',async()=>{
 const snapshot=championshipSnapshot(profile,profile.team,roster),initial=createChampionshipBattle(roster,snapshot,snapshot,43,'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa');let state=initial;const actions=[];
 for(let i=0;i<150&&state.phase==='playing';i++){const [a,b]=validMoves(state.board)[0],action={kind:'swap',a,b};actions.push(action);state=applyAutoAction(state,action).state;}
 assert.ok(['victory','defeat'].includes(state.phase));
 const upstream=async(path,options)=>{if(path.includes('/championship_matches?')){assert.ok(path.includes('attacker_id=eq.'+user.id));return ok([{initial_state:initial,status:'open'}]);}assert.ok(path.endsWith('championship_complete'));assert.equal(options.body.won,state.phase==='victory');return ok({outcome:state.phase});};
 assert.equal((await run('championship-finish',{userId:user.id,id:initial.id,actions},upstream)).outcome,state.phase);
 await assert.rejects(run('championship-finish',{userId:user.id,id:initial.id,actions},async()=>ok([])),/does not belong/);
});
test('reward requests pass a revision to the atomic server-only collection function',async()=>{
 await run('championship-claim',{userId:user.id,week:'2026-11-09',revision:12},async(path,options)=>{assert.ok(path.endsWith('championship_claim'));assert.equal(options.admin,true);assert.deepEqual(options.body,{player:user.id,reward_week:'2026-11-09',expected_revision:12});return ok({profile,revision:13});});
 await assert.rejects(run('championship-claim',{userId:user.id,week:'2026-11-09',revision:-1},async()=>assert.fail()),/Invalid/);
});

test('defense selection publishes the selected preset without changing the active team; no attack refresh can create a default defense',async()=>{
 const ids=[...profile.team].reverse(),p={...profile,teamSlots:[profile.team,ids,null,null]},before=structuredClone(p);
 await run('championship-team',{userId:user.id,kind:'defense',slot:1,ids},async(path,options)=>{if(path.includes('/player_saves?'))return ok([{profile:p}]);assert.ok(path.endsWith('championship_publish'));assert.deepEqual(options.body.attack,p.team);assert.deepEqual(options.body.defense,ids);return ok({teams:{attack_ids:p.team,defense_ids:ids}});});assert.deepEqual(p,before);
 await assert.rejects(run('championship-team',{userId:user.id,kind:'defense',slot:1,ids:profile.team},async()=>ok([{profile:p}])),/team changed/);
 await assert.rejects(run('championship-team',{userId:user.id,kind:'attack',ids:profile.team},async path=>path.includes('/player_saves?')?ok([{profile}]):ok([])),/defense team from Teams/);
 await assert.rejects(run('championship-team',{userId:user.id,kind:'attack',ids},async()=>ok([{profile}])),/active team is always/);
});
