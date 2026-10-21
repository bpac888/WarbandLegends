import {referenceProfile} from './reference-team.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {normalizeProfile,validateProfile,summon,summonBatch,victoryRewards} from '../src/progression.js';
import {heroForId} from '../src/hero-copies.js';
import {developedChampion,addHeroXp,heroDevelopment,trainChampion,development} from '../src/development.js';
import {consumeCommons,feedingQuote} from '../src/feeding.js';
import {QUESTS} from '../src/quests.js';
import {summonResults} from '../src/summoning-ui.js';
const roster=JSON.parse(await readFile(new URL('../data/champions.json',import.meta.url)));
const promoted=['venn_sablethread','tali_scrapshot','tovin_glassheart','nima_dewthread','redknife_tavin','rimebow_tessa','mavra_dusktrail','kesh_duststep','gallows_marksman_oren','fjordwatch_hald','edrik_mournwall','neon_glitch_weaver','succubus_lilth','neon_scrap_enforcer'];
test('fourteen named Commons become viable Rares and the remaining 20 Commons divide evenly among five elements',()=>{
 for(const id of promoted){const c=roster.find(h=>h.id===id);assert.equal(c.rarity,'rare',id);assert.ok(c.atk>=501&&c.def>=440&&c.hp>=835,id);assert.ok(c.special.levels[0].damage>0||c.special.levels[0].healing>0||c.special.levels[0].effects.length>0,id);}
 for(const id of ['tovin_glassheart','nima_dewthread','neon_glitch_weaver'])assert.ok(roster.find(c=>c.id===id).special.levels[0].healing>=.3,id);
 for(const id of ['fjordwatch_hald','edrik_mournwall','neon_scrap_enforcer'])assert.ok(roster.find(c=>c.id===id).special.levels[0].effects.some(e=>e.id==='shield'&&e.scope==='allies'),id);
 const commons=roster.filter(c=>c.rarity==='common');assert.equal(commons.length,20);
 for(const color of ['red','blue','green','yellow','purple']){assert.equal(commons.filter(c=>c.color===color).length,4,color);assert.equal(roster.filter(c=>c.color===color).length,27,color);}
 assert.equal(roster.length,135);assert.equal(new Set(roster.map(c=>c.id)).size,135);
});
test('three Mythicals become Fast with eight-tile Specials',()=>{for(const id of ['Ashwind Warden','frost_sage','pale_matriarch']){const c=roster.find(h=>h.id===id);assert.equal(c.rarity,'mythical');assert.equal(c.manaSpeed,'fast');assert.equal(c.special.levels[0].tiles,8);}});
test('twin-Common outcome gives two independent heroes for one 100-Gem call',()=>{
 const p=referenceProfile(),before=structuredClone(p),r=summon(p,roster,()=>.99);assert.equal(r.results.length,2);assert.equal(r.profile.gems,p.gems-100);assert.equal(r.profile.summons,2);assert.equal(r.profile.history.length,2);assert.notEqual(r.results[0].copyId,r.results[1].copyId);assert.equal(r.results.every(x=>x.champion.rarity==='common'),true);assert.ok(validateProfile(r.profile,roster));assert.deepEqual(p,before);
 const html=summonResults({...r,count:1,twinCount:1});assert.equal((html.match(/class="summon-result-card/g)||[]).length,2);assert.match(html,/twin-Common bonus/);assert.ok(r.results.every(x=>html.includes(`data-id="${x.copyId}"`)));
});
test('ten calls can award extra Commons and still guarantee a Rare',()=>{const p={...referenceProfile(),gems:900},r=summonBatch(p,roster,()=>.99,10);assert.equal(r.count,10);assert.equal(r.results.length,19);assert.equal(r.twinCount,9);assert.equal(r.results.at(-1).champion.rarity,'rare');assert.equal(r.profile.gems,0);assert.equal(r.profile.summons,19);assert.ok(validateProfile(r.profile,roster));});
test('battle XP levels heroes directly and feeding triples Common donor XP',()=>{
 let p={...referenceProfile(),gems:5000};const target=roster.find(c=>c.id===p.team[0]);p=addHeroXp(p,target,2000);assert.equal(heroDevelopment(p,target).level,development(target,2000,30).level);assert.ok(trainChampion(p,target,0).error);
 const donor=summon(p,roster,()=>0);p=donor.profile;const q=feedingQuote(p,target,[donor.copyId],roster);assert.ok(!q.error);assert.equal(q.xp,donor.champion.color===target.color?450:360);const r=consumeCommons(p,target,[donor.copyId],roster,{expectedXp:p.heroXp[target.id]});assert.ok(!r.error);assert.equal(r.profile.heroXp[target.id],p.heroXp[target.id]+q.gained);assert.equal(heroDevelopment(r.profile,target).level,q.after.level);assert.equal(r.profile.collection[donor.copyId],undefined);assert.ok(validateProfile(r.profile,roster));
});
test('old Legends saves retain XP and no longer have a feeding limit',()=>{const c=roster.find(h=>h.id==='dragonmage'),p=referenceProfile();p.profileVersion=10;p.heroXp[c.id]=1000;p.feedLevels={[c.id]:1};const migrated=normalizeProfile(p,roster);assert.equal(migrated.profileVersion,12);assert.equal(migrated.feedLevels,undefined);assert.equal(heroDevelopment(migrated,c).level,development(c,1000,40).level);assert.ok(validateProfile(migrated,roster));});
test('first-clear campaign and selected quests give more Gems for feeding summons',()=>{const p=referenceProfile(),reward=victoryRewards(p,{phase:'victory',stageId:'ashen-gate'});assert.equal(reward.gems,200);assert.equal(QUESTS.find(q=>q.id==='first-victory').gems,300);assert.equal(QUESTS.find(q=>q.id==='normal-5').gems,200);});
