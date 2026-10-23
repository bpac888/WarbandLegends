import {battleFixtureResponse} from './battle-fixture.mjs';
import {createRequire} from 'node:module';
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {defaultProfile,STARTER_TEAM} from '../src/progression.js';
import {createBattle,skillDescription} from '../src/engine.js';
import {xpForLevel} from '../src/development.js';
import {PROFILE_KEY,BATTLE_KEY} from '../src/storage.js';
import {HERO_INSIGHTS} from '../src/hero-insights.js';
import {playToOutcome} from './browser-play.mjs';
const require=createRequire(import.meta.url),{chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const root=new URL('../',import.meta.url).pathname,roster=JSON.parse(await fs.readFile(root+'data/champions.json','utf8'));
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||undefined,args:['--no-sandbox']});
try{
 const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'}),errors=[];
 await context.route('**/*',async route=>{
  const u=new URL(route.request().url());if(u.hostname!=='legends.local'){errors.push('External '+u.hostname);return route.abort();}
  try{const p=path.join(root,'dist',u.pathname==='/'?'index.html':decodeURIComponent(u.pathname));await route.fulfill({body:battleFixtureResponse(p,await fs.readFile(p)),contentType:({'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.webp':'image/webp','.svg':'image/svg+xml'})[path.extname(p)]});}
  catch{errors.push('Missing '+u.pathname);await route.fulfill({status:404,body:'missing'});}
 });
 const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
 const go=async route=>{await page.goto('http://legends.local/#/'+route);await page.locator('.topbar').waitFor();};
 const read=k=>page.evaluate(key=>JSON.parse(localStorage.getItem(key)),k);
 await go('home');
 const p=defaultProfile();p.helpSeen=true;p.reducedMotion=true;p.campaignProgress.normal=4;p.unlocked=4;
 p.cleared=['ashen-gate','frozen-pass','veil-sanctum','campaign-normal-04'];
 p.heroXp=Object.fromEntries(STARTER_TEAM.map(id=>[id,xpForLevel(roster.find(c=>c.id===id),10)]));
 await page.evaluate(({k,p})=>localStorage.setItem(k,JSON.stringify(p)),{k:PROFILE_KEY,p});await page.reload();await page.locator('.topbar').waitFor();
 // Every displayed step matches its source plan; ordering is visible, not buried in a tooltip.
 for(const id of Object.keys(HERO_INSIGHTS)){
  await go('champion/'+id);await page.locator('.hero-tactics summary').click();assert.ok(await page.locator('.hero-tactics').evaluate(n=>n.open));
  const c=roster.find(c=>c.id===id);for(const level of c.special.levels){const row=page.locator(`[data-charge-level="${level.level}"]`);assert.deepEqual(await row.locator('[data-step-kind]').evaluateAll(nodes=>nodes.map(n=>n.dataset.stepKind)),skillDescription(c,{},level.level).steps.map(s=>s.kind));}
 }
 await go('champion/dragonmage');await page.locator('.hero-tactics summary').click();await page.locator('#hero-special').screenshot({path:root+'artifacts/tactics-1440-dragon-special.png'});
 for(const width of [760,390,320]){
  await page.setViewportSize({width,height:844});
  for(const id of ['dragonmage','grove_druid','frost_sage','shieldmaiden_runa']){await go('champion/'+id);await page.locator('.hero-tactics summary').click();assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${width} ${id}`);}
  await page.locator('#hero-special').screenshot({path:`${root}artifacts/tactics-${width}-runa-special.png`});
  await go('campaign');await page.locator('.campaign-node[data-stage="campaign-normal-05"]').click();await page.getByRole('region',{name:'Encounter tactics'}).waitFor();assert.match(await page.locator('.encounter-tactics').textContent(),/Overpressure/);assert.ok(await page.locator('#modal').evaluate(n=>n.scrollWidth<=n.clientWidth));await page.screenshot({path:`${root}artifacts/tactics-${width}-boss-preview.png`,fullPage:true});await page.getByRole('button',{name:'Back',exact:true}).click();
 }
 await page.setViewportSize({width:1440,height:1000});await go('campaign');await page.locator('.campaign-node[data-stage="frozen-pass"]').click();assert.match(await page.locator('.encounter-tactics').textContent(),/Defense Up for 2/);await page.getByRole('button',{name:'Back',exact:true}).click();await page.locator('.campaign-node[data-stage="veil-sanctum"]').click();assert.match(await page.locator('.encounter-tactics').textContent(),/4 tile charge/);await page.getByRole('button',{name:'Back',exact:true}).click();
 // A seeded, legitimate level-10 battle. Only public swaps and Special controls resolve it.
 const initial=createBattle(roster,STARTER_TEAM,'campaign-normal-05',1,{progression:true,levels:Object.fromEntries(STARTER_TEAM.map(id=>[id,10]))});
 await page.evaluate(({k,b})=>localStorage.setItem(k,JSON.stringify(b)),{k:BATTLE_KEY,b:initial});await page.reload();await page.locator('.topbar').waitFor();await go('battle');
 await page.getByRole('button',{name:'Encounter tactics',exact:true}).click();assert.equal(await page.locator('.scenario-state').getAttribute('data-scenario-phase'),'waiting');await page.getByRole('button',{name:'Close dialog',exact:true}).click();
 let captured=false,atTrigger=null;const phaseEvents=new Set();
 const outcome=await playToOutcome(page,BATTLE_KEY,120,async b=>{
  for(const event of b.log)if(event.text.includes('Overpressure ·'))phaseEvents.add(event.id);
  if(captured||!b.scenario?.triggered||b.phase!=='playing')return;captured=true;atTrigger=b;
  assert.equal(await page.locator('.overpressure-active').count(),1);await page.screenshot({path:root+'artifacts/tactics-boss-overpressure.png',fullPage:true});
  await page.getByRole('button',{name:'Encounter tactics',exact:true}).click();assert.equal(await page.locator('.scenario-state').getAttribute('data-scenario-phase'),'triggered');await page.screenshot({path:root+'artifacts/tactics-boss-phase-detail.png',fullPage:true});await page.getByRole('button',{name:'Close dialog',exact:true}).click();
  const current=await read(BATTLE_KEY);assert.deepEqual(current.scenario,b.scenario);assert.equal(current.moves,b.moves);
 });
 assert.ok(captured,'real UI fight crosses the phase threshold');assert.equal(outcome.phase,'victory');assert.ok(outcome.scenario.triggered);assert.equal(phaseEvents.size,1);assert.equal((await read(PROFILE_KEY)).campaignProgress.normal,5);const rewarded=await read(PROFILE_KEY);await page.reload();await page.locator('.topbar').waitFor();assert.equal(await page.locator('.board').count(),0);assert.deepEqual(await read(PROFILE_KEY),rewarded);
 // Legacy engine fixtures never gain a new phase. New preview still describes the new encounter.
 const legacy=structuredClone(atTrigger);delete legacy.scenario;await page.evaluate(({k,b})=>localStorage.setItem(k,JSON.stringify(b)),{k:BATTLE_KEY,b:legacy});await page.reload();await go('battle');await page.locator('.board').waitFor();await page.getByRole('button',{name:'Encounter tactics',exact:true}).click();assert.match(await page.locator('.encounter-tactics').textContent(),/keeps its original rules/);await page.getByRole('button',{name:'Close dialog',exact:true}).click();
 for(const width of [390,320]){await page.setViewportSize({width,height:844});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));const tactics=await page.getByRole('button',{name:'Encounter tactics',exact:true}).boundingBox(),back=await page.getByRole('button',{name:'Abandon battle and return home'}).boundingBox();assert.ok(tactics.x>=back.x+back.width);await page.screenshot({path:`${root}artifacts/tactics-${width}-battle.png`,fullPage:true});}
 assert.deepEqual(errors,[]);
 console.log(JSON.stringify({passed:true,checks:['twenty reviewed identities, all displayed resolution orders','desktop/tablet/390/320 detailed Specials','ward/ritual/guardian previews','real level10 boss UI victory with one-time Overpressure','phase survives inspection and cannot rearm','one-time chapter rewards and progression','legacy fights keep original rules','mobile controls and overflow','no missing assets/external calls/browser errors']},null,2));
}finally{await browser.close();}
