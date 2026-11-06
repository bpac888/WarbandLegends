import {makeBackup,parseBackup} from '../src/save-files.js';
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {defaultProfile,normalizeProfile,validateProfile,victoryRewards,awardVictory} from '../src/progression.js';
import {BOOSTER_DURATION,activateBooster,boosterActive,normalizePremiumItems} from '../src/premium-items.js';
import {feedingQuote,consumeHeroes} from '../src/feeding.js';
import {ascendChampion,awakenChampion,xpForLevel} from '../src/development.js';
import {ASCENSION_CAPS,currentLevelCap} from '../src/ascension.js';
import {ENCOUNTERS} from '../src/encounters.js';
import {experienceTomeQuote,useExperienceTome} from '../src/experience-tomes.js';
import {premiumInventory} from '../src/premium-items-ui.js';
const roster=JSON.parse(fs.readFileSync(new URL('../data/champions.json',import.meta.url))),now=Date.UTC(2026,10,5,12);
const stock=()=>({...defaultProfile(),premiumItems:{'experience-booster':2,'gold-booster':2,'tome-of-ascension':2,'tome-of-limit-break':2}});

test('inventory shows only owned items or active boosters, and hides exhausted and expired items',()=>{
 const p=defaultProfile();assert.equal(premiumInventory(p,now),'');
 p.premiumItems={'epic-tome-experience':1,'gold-booster':0};p.boosters={gold:now+1};
 assert.match(premiumInventory(p,now),/epic-tome-experience/);assert.match(premiumInventory(p,now),/gold-booster/);
 assert.doesNotMatch(premiumInventory(p,now),/experience-booster/);
 p.premiumItems['epic-tome-experience']=0;assert.equal(premiumInventory(p,now+1),'');
});

test('owned experience tomes respect elements and caps, spend one item, persist, and advance Daily Path',()=>{
 const c=roster.find(c=>c.rarity==='legendary'&&c.color==='red'),p=defaultProfile();
 p.collection[c.id]=1;p.gold=0;p.premiumItems={'epic-tome-experience':1,'greater-red-tome':1,'lesser-blue-tome':1};
 assert.ok(validateProfile(p,roster));assert.deepEqual(normalizeProfile(p,roster).premiumItems,p.premiumItems);
 assert.ok(useExperienceTome(p,'lesser-blue-tome',c).error);assert.equal(useExperienceTome(p,'lesser-blue-tome',c).profile,p);
 const q=experienceTomeQuote(p,'epic-tome-experience',c),used=useExperienceTome(p,'epic-tome-experience',c,new Date(now));
 assert.equal(q.level,21);assert.equal(used.profile.heroXp[c.id],xpForLevel(c,21));assert.equal(used.profile.premiumItems['epic-tome-experience'],0);assert.equal(used.profile.pathHeroLevels[c.id],3);assert.equal(used.profile.gold,0);
 assert.ok(useExperienceTome(used.profile,'epic-tome-experience',c).error);
 const capped=useExperienceTome(used.profile,'greater-red-tome',c,new Date(now));assert.equal(capped.profile.heroXp[c.id],xpForLevel(c,currentLevelCap(p,c)));
 assert.ok(experienceTomeQuote(capped.profile,'greater-red-tome',c).error);
 assert.deepEqual(parseBackup(JSON.stringify(makeBackup(capped.profile,null)),roster).profile,capped.profile);
});

test('boosters consume one item for exactly 24 hours, survive saves, and cannot stack or waste stock',()=>{
 const p=stock(),active=activateBooster(p,'experience-booster',now).profile;
 assert.equal(active.premiumItems['experience-booster'],1);assert.equal(p.premiumItems['experience-booster'],2);
 assert.equal(active.boosters.experience,now+BOOSTER_DURATION);
 assert.ok(boosterActive(active,'experience',now+BOOSTER_DURATION-1));assert.equal(boosterActive(active,'experience',now+BOOSTER_DURATION),false);
 assert.equal(activateBooster(active,'experience-booster',now+1).profile,active);
 const both=activateBooster(active,'gold-booster',now+1000).profile;
 assert.equal(both.boosters.experience,active.boosters.experience);assert.equal(both.boosters.gold,now+1000+BOOSTER_DURATION);
 assert.ok(validateProfile(both,roster));assert.deepEqual(normalizeProfile(JSON.parse(JSON.stringify(both)),roster),both);assert.deepEqual(parseBackup(JSON.stringify(makeBackup(both,null)),roster).profile,both);
 const renewed=activateBooster(active,'experience-booster',now+BOOSTER_DURATION).profile;
 assert.equal(renewed.premiumItems['experience-booster'],0);assert.equal(renewed.boosters.experience,now+2*BOOSTER_DURATION);
 assert.ok(activateBooster(defaultProfile(),'gold-booster',now).error);
 assert.ok(activateBooster(p,'gold-booster',NaN).error);
});

test('feeding gets 25% bonus XP only during the experience blessing, retaining caps and normal donor costs',()=>{
 const target=roster.find(c=>c.rarity==='legendary'),donor=roster.find(c=>c.rarity==='common'&&!defaultProfile().team.includes(c.id));
 const p=stock();p.collection={...p.collection,[target.id]:1,[donor.id]:1};
 const baseline=feedingQuote(p,target,[donor.id],roster,{now}),active=activateBooster(p,'experience-booster',now).profile;
 const quote=feedingQuote(active,target,[donor.id],roster,{now:now+1});
 assert.equal(quote.error,null);assert.equal(quote.xp,Math.floor(baseline.xp*1.25));assert.equal(quote.gold,baseline.gold);
 const fed=consumeHeroes(active,target,[donor.id],roster,{expectedXp:0,now:now+1});
 assert.equal(fed.gained,quote.gained);assert.equal(fed.profile.heroXp[target.id],quote.gained);assert.equal(fed.profile.gold,p.gold-25);assert.equal(fed.profile.collection[donor.id],undefined);
 assert.equal(feedingQuote(active,target,[donor.id],roster,{now:now+BOOSTER_DURATION}).xp,baseline.xp);
 active.heroXp={[target.id]:xpForLevel(target,currentLevelCap(active,target))-1};
 assert.equal(feedingQuote(active,target,[donor.id],roster,{now:now+1}).gained,1);
});

test('gold blessing applies once to campaign, dungeon, arena and event rewards and expires exactly on time',()=>{
 for(const mode of ['campaign','dungeon','arena','event']){
  const encounter=ENCOUNTERS.find(e=>e.mode===mode&&(mode!=='dungeon'||e.difficulty==='normal'));
  const battle={id:'boost-'+mode,stageId:encounter.id,phase:'victory',sandbox:false,progression:false,heroes:[]};
  const p=stock();
  if(mode==='event'){battle.eventWindow=encounter.eventId+':2026-11';p.eventEntry={battleId:battle.id,key:battle.eventWindow};p.eventAttempts={[battle.eventWindow]:1};}
  const active=activateBooster(p,'gold-booster',now).profile,base=victoryRewards(p,battle,now),boosted=victoryRewards(active,battle,now+1);
  assert.equal(boosted.gold,Math.floor(base.gold*1.25),mode);assert.equal(boosted.xp,base.xp);assert.equal(boosted.gems,base.gems);
  assert.equal(victoryRewards(active,battle,now+BOOSTER_DURATION).gold,base.gold);
  assert.equal(victoryRewards(active,{...battle,sandbox:true},now+1).gold,0);
  const won=awardVictory(active,battle,roster,now+1);assert.equal(won.gold,active.gold+boosted.gold,mode);
  assert.equal(awardVictory(won,battle,roster,now+2),won);
 }
});

test('advancement tomes bypass materials and Gold for one step but preserve level, rarity and stale-confirmation rules',()=>{
 const c=roster.find(c=>c.rarity==='legendary'),p=stock();p.gold=0;p.materials={};p.collection[c.id]=1;p.heroXp[c.id]=xpForLevel(c,ASCENSION_CAPS[c.rarity][0]);
 const ascended=ascendChampion(p,c,0,{tome:true});assert.equal(ascended.error,undefined);assert.equal(ascended.profile.ascensions[c.id],1);assert.equal(ascended.profile.premiumItems['tome-of-ascension'],1);assert.equal(ascended.profile.gold,0);assert.deepEqual(ascended.profile.materials,{});assert.deepEqual(ascended.profile.heroXp,p.heroXp);
 assert.equal(ascendChampion(ascended.profile,c,1,{tome:true}).profile,ascended.profile,'cannot skip the next level requirement');
 assert.equal(ascendChampion(p,c,1,{tome:true}).profile,p,'stale tier cannot spend a tome');
 assert.ok(ascendChampion({...p,premiumItems:{}},c,0,{tome:true}).error);
 p.ascensions[c.id]=ASCENSION_CAPS[c.rarity].length-1;p.heroXp[c.id]=xpForLevel(c,70);
 const first=awakenChampion(p,c,0,{tome:true});assert.equal(first.profile.awakenings[c.id],1);assert.equal(currentLevelCap(first.profile,c),75);assert.equal(first.profile.premiumItems['tome-of-limit-break'],1);assert.equal(first.profile.gold,0);assert.deepEqual(first.profile.materials,{});
 assert.equal(awakenChampion(first.profile,c,1,{tome:true}).profile,first.profile);
 first.profile.heroXp[c.id]=xpForLevel(c,75);const second=awakenChampion(first.profile,c,1,{tome:true});assert.equal(second.profile.awakenings[c.id],2);assert.equal(second.profile.premiumItems['tome-of-limit-break'],0);assert.equal(currentLevelCap(second.profile,c),80);assert.ok(validateProfile(second.profile,roster));
 assert.equal(awakenChampion(second.profile,c,2,{tome:true}).profile,second.profile);
 const common=roster.find(c=>c.rarity==='common');p.collection[common.id]=1;assert.equal(awakenChampion(p,common,0,{tome:true}).profile,p);
});

test('malformed premium inventory and booster timestamps cannot enter saves',()=>{
 for(const premiumItems of [[],{'gold-booster':-1},{'gold-booster':1.5},{unknown:3}])assert.equal(validateProfile({...stock(),premiumItems},roster),false);
 for(const boosters of [[],{gold:Infinity},{gold:-1},{unknown:now}])assert.equal(validateProfile({...stock(),boosters},roster),false);
 assert.deepEqual(normalizePremiumItems({premiumItems:{'gold-booster':-1},boosters:{gold:'forever'}}),{premiumItems:{},boosters:{}});
 const legacy=defaultProfile();delete legacy.premiumItems;delete legacy.boosters;assert.ok(validateProfile(legacy,roster));assert.deepEqual(normalizeProfile(legacy,roster).premiumItems,{});
});
