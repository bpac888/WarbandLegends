import test from 'node:test';import assert from 'node:assert/strict';import {readFile} from 'node:fs/promises';
import {QUESTS,questProgress,claimQuest} from '../src/quests.js';import {questsPage,questArtIndex} from '../src/quest-ui.js';import {defaultProfile} from '../src/progression.js';
const roster=JSON.parse(await readFile(new URL('../data/champions.json',import.meta.url))),added=QUESTS.slice(43);
test('seventeen new milestones require actual progress and award each reward only once',()=>{
 assert.equal(added.length,17);
 for(const q of added){let p=defaultProfile();const before=structuredClone(p);assert.ok(claimQuest(p,q.id,roster).error,q.id);assert.deepEqual(p,before);
  if(['hard','nightmare'].includes(q.metric))p.campaignProgress[q.metric]=q.goal;
  else if(q.metric==='collection')p.collection=Object.fromEntries(roster.slice(0,q.goal).map(c=>[c.id,1]));
  else if(q.metric==='totalXp')p.heroXp=Object.fromEntries(roster.slice(0,75).map(c=>[c.id,1000]));
  else if(q.metric==='ascensions')p.ascensions=Object.fromEntries(roster.slice(0,q.goal).map(c=>[c.id,1]));
  else if(q.metric==='awakenings')p.awakenings=Object.fromEntries(roster.slice(0,q.goal).map(c=>[c.id,1]));
  else p[q.metric]=q.goal;
  assert.equal(questProgress(p,q),q.goal,q.id);const r=claimQuest(p,q.id,roster);assert.ok(!r.error,q.id);assert.equal(r.profile.gems,p.gems+q.gems);assert.equal(r.profile.gold,p.gold+q.gold);assert.ok(r.profile.claimed.includes(q.id));for(const [id,n]of Object.entries(q.items))assert.equal(r.profile.materials[id],(p.materials[id]||0)+n);
  const snapshot=structuredClone(r.profile),again=claimQuest(r.profile,q.id,roster);assert.ok(again.error);assert.deepEqual(again.profile,snapshot);
 }
});
test('status filtering, empty states and the nine shared art variants reflect the quests shown',()=>{
 const p={...defaultProfile(),summons:1,claimed:['first-victory']};assert.deepEqual(new Set(QUESTS.map(questArtIndex)),new Set([0,1,2,3,4,5,6,7,8]));
 const ready=questsPage(p,{state:'ready'});assert.match(ready,/data-quest="first-summon"/);assert.ok(!ready.includes('data-quest="first-victory"'));
 const completed=questsPage(p,{state:'completed'});assert.match(completed,/data-quest="first-victory"/);assert.ok(!completed.includes('data-quest="first-summon"'));
 const empty=questsPage(defaultProfile(),{state:'completed'});assert.match(empty,/No quests here yet/);assert.ok(!empty.includes('data-quest='));
 const all=questsPage(defaultProfile(),{limit:100});assert.equal((all.match(/data-quest=/g)||[]).length,60);assert.ok(!all.includes('assets/champions/'));assert.match(all,/assets\/quests\/categories.webp/);
});
