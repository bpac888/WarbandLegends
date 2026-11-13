import {campaignMilestone} from '../src/campaign-milestones.js';
import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs/promises';
import {CAMPAIGN_ARCS,STORY_DIFFICULTIES,campaignScene,narrativeKey,sceneViewed} from '../src/campaign-story.js';
import {dialogueHTML,openingStoryHTML,storyHTML,chapterGiftHTML,journalHTML,normalizeJournal,claimChapter,aftermathHTML} from '../src/campaign-journal.js';
import {defaultProfile,normalizeProfile,validateProfile} from '../src/progression.js';import {getEncounter} from '../src/encounters.js';
const roster=JSON.parse(await fs.readFile(new URL('../data/champions.json',import.meta.url))),manifest=JSON.parse(await fs.readFile(new URL('../data/cinematic-manifest.json',import.meta.url)));
test('all 75 stages belong to three distinct map-led acts with five complete chapters and 33 concise static scenes',()=>{
 const texts=new Set(),clips=new Map();let scenes=0;for(const d of STORY_DIFFICULTIES){const arc=CAMPAIGN_ARCS[d];assert.equal(arc.chapters.length,5);assert.ok(arc.opening.length>=2);scenes++;for(const scene of arc.chapters){assert.equal(scene.end,scene.id*5);assert.ok(scene.before.length>=2);assert.ok(scene.after.length>=2);for(const lines of [scene.before,scene.after]){const text=JSON.stringify(lines);assert.ok(!texts.has(text));texts.add(text);assert.ok(lines.every(([speaker,text])=>speaker&&text.trim().length>0));}scenes+=2;if(scene.media){assert.ok(!clips.has(scene.media.clip),'No story video is reused across acts');clips.set(scene.media.clip,d);assert.ok(manifest.clips.some(m=>m.id===scene.media.clip&&m.characterId===scene.media.character));}}
 assert.ok(!openingStoryHTML('',{difficulty:d}).includes('story-realm-art'));assert.ok(!storyHTML(1,{difficulty:d}).includes('story-realm-art'));assert.ok(storyHTML(1,{difficulty:d}).includes('story-continue'));assert.ok(!storyHTML(1,{difficulty:d}).includes('Begin battle'));for(let id=1;id<=5;id++){assert.match(storyHTML(id,{difficulty:d}),new RegExp('data-story-difficulty="'+d+'"'));assert.ok(aftermathHTML(d,id).includes(campaignMilestone(d,id*5).art));}}
 assert.equal(scenes,33);assert.notEqual(CAMPAIGN_ARCS.normal.art,CAMPAIGN_ARCS.hard.art);assert.notEqual(CAMPAIGN_ARCS.hard.art,CAMPAIGN_ARCS.nightmare.art);assert.equal(clips.size,0);for(const d of STORY_DIFFICULTIES)assert.ok(!storyHTML(1,{difficulty:d}).includes('<video'));
});
test('rewritten scenes use new seen keys, while old rewards and seen flags survive save normalization',()=>{
 const p=defaultProfile();p.storySeen=['normal:opening','normal:1','normal:map:opening','hard:map:4'];p.chapterClaims=['normal:1','hard:2'];const n=normalizeProfile(p,roster);assert.deepEqual(n.chapterClaims,p.chapterClaims);assert.deepEqual(n.storySeen,p.storySeen);assert.ok(validateProfile(n,roster));assert.ok(sceneViewed(n,getEncounter('ashen-gate')));assert.ok(!sceneViewed(n,getEncounter('campaign-normal-05')));assert.equal(narrativeKey(getEncounter('campaign-nightmare-25')),'nightmare:map:5');assert.deepEqual(normalizeJournal({storySeen:['oops'],chapterClaims:['nightmare:6']}),{storySeen:[],chapterClaims:[]});
});
test('last two chapter gifts require their actual difficulty progress and never repeat',()=>{let p=defaultProfile();assert.ok(claimChapter(p,'normal:4').error);p.campaignProgress.normal=20;let r=claimChapter(p,'normal:4');assert.equal(r.profile.gems,p.gems+25);assert.ok(claimChapter(r.profile,'normal:4').error);assert.ok(claimChapter(r.profile,'normal:5').error);assert.ok(claimChapter(r.profile,'hard:4').error);r.profile.campaignProgress.normal=25;const final=claimChapter(r.profile,'normal:5');assert.equal(final.profile.gems,p.gems+50);assert.ok(validateProfile(normalizeProfile(final.profile,roster),roster));const e=getEncounter('campaign-normal-25'),html=chapterGiftHTML(final.profile,e);assert.ok(html.includes('Chapter gift claimed'));assert.ok(html.includes(CAMPAIGN_ARCS.normal.chapters[4].after[0][1]));assert.ok(chapterGiftHTML({...p,campaignProgress:{nightmare:25}},getEncounter('campaign-nightmare-25')).includes('nightmare-crown-confrontation.webp'));});
test('journal groups the three acts and gates later scenes and aftermaths by progress',()=>{const p=defaultProfile(),html=journalHTML(p,{difficulty:'hard'});assert.equal((html.match(/class="journal-arc"/g)||[]).length,3);assert.equal((html.match(/class="journal-chapter"/g)||[]).length,15);assert.ok(html.includes('data-story-difficulty="hard" open'));assert.ok(html.includes('Read Hard opening'));assert.ok(!html.includes('data-action="chapter-claim"'));});

test('story guardians match the actual milestone battles and scenes stay brief',()=>{
 for(const d of STORY_DIFFICULTIES){const arc=CAMPAIGN_ARCS[d];for(const scene of arc.chapters){const encounter=getEncounter(`campaign-${d}-${String(scene.end).padStart(2,'0')}`);assert.equal(scene.guardianId,encounter.enemyIds[1],`${d} stage ${scene.end}`);for(const lines of [scene.before,scene.after])assert.ok(lines.map(l=>l[1]).join(' ').split(/\s+/).length<=75,`${d} chapter ${scene.id} stays readable on phones`);}}
});

test('the finale confronts Yshmir directly with Hald present, and Quill threatens Rootmother beforehand',async()=>{
 const {createBattle,validateSave}=await import('../src/engine.js');
 const {REFERENCE_TEAM}=await import('./reference-team.mjs');
 const garden=createBattle(roster,REFERENCE_TEAM,'campaign-nightmare-20',42),finale=createBattle(roster,REFERENCE_TEAM,'campaign-nightmare-25',42);
 assert.equal(garden.enemies[1].baseId||garden.enemies[1].id,'plague_doctor');
 assert.equal(finale.enemies[1].baseId||finale.enemies[1].id,'yshmir_worldwound');
 assert.ok(finale.enemies.some(c=>(c.baseId||c.id)==='fjordwatch_hald'));
 assert.ok(validateSave(garden,roster));assert.ok(validateSave(finale,roster));
 assert.equal(CAMPAIGN_ARCS.nightmare.chapters[4].after.at(-1)[0],'Runa');
});

test('campaign dialogue uses the player name safely and legacy default profiles become Commander',()=>{const a=openingStoryHTML('',{playerName:'A <B> & C'});assert.ok(a.includes('A &lt;B&gt; &amp; C'));assert.ok(!a.includes('>Keeper<'));assert.equal(defaultProfile().name,'Commander');assert.equal(normalizeProfile({...defaultProfile(),name:'Rune Keeper'},roster).name,'Commander');assert.equal(normalizeProfile({...defaultProfile(),name:'My Name'},roster).name,'My Name');});

test('conversation turns alternate left/right even with three or more speakers',()=>{const html=dialogueHTML([['Runa','One'],['Commander','Two'],['Auroline','Three'],['Hald','Four']]);assert.deepEqual([...html.matchAll(/class="dialogue-turn dialogue-(left|right)[^"]*"/g)].map(m=>m[1]),['left','right','left','right']);});

test('Hald replaces Brukk consistently without changing the champion catalogue',()=>{assert.ok(!JSON.stringify(CAMPAIGN_ARCS).includes('Brukk'));assert.ok(JSON.stringify(CAMPAIGN_ARCS).includes('Hald'));assert.equal(roster.find(c=>c.id==='fjordwatch_hald').rarity,'rare');});

test('the rescue-party starters never appear among campaign enemies',async()=>{const {STARTER_TEAM}=await import('../src/progression.js'),{CAMPAIGN_STAGES}=await import('../src/encounters.js');for(const stage of CAMPAIGN_STAGES)assert.ok(stage.enemyIds.every(id=>!STARTER_TEAM.includes(id)),stage.id);assert.ok(STARTER_TEAM.includes('shieldmaiden_runa'));});
