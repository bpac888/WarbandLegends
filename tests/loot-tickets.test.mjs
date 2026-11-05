import {xpForLevel} from '../src/development.js';
import {currentLevelCap} from '../src/ascension.js';
import test from 'node:test';import assert from 'node:assert/strict';import {readFile} from 'node:fs/promises';
import {defaultProfile,normalizeProfile,validateProfile,awardVictory,victoryRewards} from '../src/progression.js';
import {CAMPAIGN_STAGES,ENCOUNTERS} from '../src/encounters.js';import {exchange,EXCHANGE_OFFERS} from '../src/mode-progression.js';import {lootTicketQuote,useLootTicket} from '../src/loot-tickets.js';import {energyCost,spendEnergy,accountThreshold,energyCap} from '../src/keeper.js';import {makeBackup,parseBackup} from '../src/save-files.js';import {LOOT_TICKET_LIMIT} from '../src/loot-ticket-item.js';
const roster=JSON.parse(await readFile(new URL('../data/champions.json',import.meta.url))),first=CAMPAIGN_STAGES[0];
function fixture(e=first){const p=defaultProfile();return {...p,lootTickets:5,cleared:[e.id],campaignProgress:{...p.campaignProgress,[e.difficulty]:e.number},accountXp:accountThreshold(50),energy:100};}
test('all token currencies buy five tickets atomically, with storage and insufficient-funds protection',()=>{
 const offers=EXCHANGE_OFFERS.filter(o=>o.lootTickets);assert.equal(offers.length,4);
 for(const o of offers){const p={...fixture(),arenaTokens:50,eventTokens:{eclipse_sigil:50,frostwake_shard:50,veil_mark:50}},before=structuredClone(p),r=exchange(p,o.id);assert.ok(!r.error);assert.equal(r.profile.lootTickets,10);assert.equal(r.profile.gold,p.gold);assert.equal(r.profile.gems,p.gems);for(const currency of ['arenaTokens',...Object.keys(p.eventTokens)])assert.equal(currency==='arenaTokens'?r.profile.arenaTokens:r.profile.eventTokens[currency],50-(currency===o.currency?o.cost:0));assert.deepEqual(p,before);const full={...p,lootTickets:LOOT_TICKET_LIMIT-4};assert.equal(exchange(full,o.id).profile,full);assert.ok(exchange(defaultProfile(),o.id).error);}
});
test('every campaign stage and difficulty grants exactly ordinary replay settlement and normal Energy cost',()=>{
 for(const e of CAMPAIGN_STAGES){const p=fixture(e),before=structuredClone(p),paid=spendEnergy(p,e),expected=awardVictory(paid.profile,{id:'battle-replay',stageId:e.id,phase:'victory',sandbox:false,progression:true,heroes:p.team.map(id=>({id}))},roster);const r=useLootTicket(p,e.id,roster,{expectedUses:0});assert.ok(!r.error,e.id);assert.equal(r.cost,energyCost(e));assert.equal(r.profile.energy,p.energy-energyCost(e));assert.equal(r.profile.lootTickets,4);assert.equal(r.profile.lootTicketUses,1);for(const k of ['gold','gems','heroXp','accountXp','materials','wins','pathWins','campaignProgress','cleared'])assert.deepEqual(r.profile[k],expected[k],e.id+' '+k);assert.equal(r.reward.first,false);assert.equal(r.profile.gems,p.gems);assert.ok(validateProfile(r.profile,roster),e.id);assert.deepEqual(p,before);}
});
test('tickets reject uncleared difficulties, first clears, non-campaign, no tickets, no Energy and playtesting without mutation',()=>{
 for(const [p,id,options]of [[defaultProfile(),first.id,{}],[{...fixture(),cleared:[]},first.id,{}],[fixture(),CAMPAIGN_STAGES[25].id,{}],[fixture(),ENCOUNTERS.find(e=>e.mode==='dungeon').id,{}],[fixture(),'unknown',{}],[{...fixture(),lootTickets:0},first.id,{}],[{...fixture(),energy:0},first.id,{}],[{...fixture(),openRoster:true},first.id,{}],[fixture(),first.id,{activeBattle:true}]]){const before=structuredClone(p),r=useLootTicket(p,id,roster,{expectedUses:0,...options});assert.ok(r.error);assert.equal(r.profile,p);assert.deepEqual(p,before);}
 for(const e of CAMPAIGN_STAGES.filter(e=>e.number===1)){const p={...fixture(e),energy:energyCost(e)-1};assert.ok(useLootTicket(p,e.id,roster,{expectedUses:0}).error,e.difficulty);}
});
test('stale confirmations cannot grant rewards or consume another ticket, even after receipt history is pruned',()=>{
 const p=fixture(),q=lootTicketQuote(p,first.id,roster),one=useLootTicket(p,first.id,roster,{expectedUses:q.uses});assert.ok(!one.error);for(const next of [one.profile,{...one.profile,recorded:[]}]){const old=structuredClone(next),r=useLootTicket(next,first.id,roster,{expectedUses:q.uses});assert.ok(r.error);assert.deepEqual(r.profile,old);}const two=useLootTicket(one.profile,first.id,roster,{expectedUses:1});assert.ok(!two.error);assert.equal(two.profile.lootTickets,3);assert.equal(two.profile.wins,2);
});
test('five-victory Gems and lifetime quest progress advance once, with capped characters receiving no excess XP',()=>{
 const p={...fixture(),wins:4},q=lootTicketQuote(p,first.id,roster);assert.equal(q.reward.gems,50);const r=useLootTicket(p,first.id,roster,{expectedUses:0});assert.equal(r.profile.gems,p.gems+50);assert.equal(r.profile.wins,5);assert.equal(r.profile.dungeonWins,0);assert.deepEqual(r.profile.claimed,p.claimed);assert.equal(r.profile.pathWins,1);
 const capped={...fixture(),heroXp:Object.fromEntries(fixture().team.map(id=>{const c=roster.find(c=>c.id===id);return [id,xpForLevel(c,currentLevelCap(fixture(),c))];}))};const result=useLootTicket(capped,first.id,roster,{expectedUses:0});assert.deepEqual(result.profile.heroXp,capped.heroXp);
});
test('tickets and use sequence survive normalization and backup import; malformed values are rejected',()=>{
 const one=useLootTicket(fixture(),first.id,roster,{expectedUses:0}).profile;assert.deepEqual(normalizeProfile(one,roster),one);assert.deepEqual(parseBackup(JSON.stringify(makeBackup(one,null)),roster).profile,one);
 const old=defaultProfile();delete old.lootTickets;delete old.lootTicketUses;assert.ok(validateProfile(old,roster));assert.equal(normalizeProfile(old,roster).lootTickets,0);
 for(const value of [-1,1.5,NaN,Infinity,'5',LOOT_TICKET_LIMIT+1])assert.equal(validateProfile({...fixture(),lootTickets:value},roster),false);
 for(const value of [-1,1.5,'1',1000000000])assert.equal(validateProfile({...fixture(),lootTicketUses:value},roster),false);
});
test('replay XP belongs to the five active copies, not another owned copy of the same design',()=>{
 const p=fixture(),base=p.team[0],copy=base+'~1';p.collection[copy]=1;p.copySequence=1;p.team=[copy,...p.team.slice(1)];p.teamSlots[0]=[...p.team];const r=useLootTicket(p,first.id,roster,{expectedUses:0});assert.ok(!r.error);assert.ok(r.profile.heroXp[copy]>0);assert.equal(r.profile.heroXp[base],undefined);for(const id of p.team)assert.ok(r.profile.heroXp[id]>0);assert.ok(validateProfile(r.profile,roster));
});
