import {battleFixtureResponse} from './battle-fixture.mjs';
import {createRequire} from 'node:module';import fs from 'node:fs/promises';import path from 'node:path';import assert from 'node:assert/strict';
import {defaultProfile,summon} from '../src/progression.js';import {heroForId,nextCopyId} from '../src/hero-copies.js';
import {feedingQuote} from '../src/feeding.js';
import {PROFILE_KEY} from '../src/storage.js';
const require=createRequire(import.meta.url),{chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright'),root=new URL('../',import.meta.url).pathname,roster=JSON.parse(await fs.readFile(root+'data/champions.json','utf8'));
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||undefined,args:['--no-sandbox']});
try{
 const context=await browser.newContext({viewport:{width:1440,height:900},reducedMotion:'reduce'}),errors=[];await fs.mkdir(root+'artifacts',{recursive:true});
 await context.route('**/*',async route=>{const u=new URL(route.request().url());if(u.hostname!=='legends.local'){errors.push('External '+u.href);return route.abort();}try{const p=path.join(root,'dist',u.pathname==='/'?'index.html':decodeURIComponent(u.pathname));await route.fulfill({body:battleFixtureResponse(p,await fs.readFile(p)),contentType:({'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.webp':'image/webp','.svg':'image/svg+xml'})[path.extname(p)]});}catch{errors.push('Missing '+u.pathname);await route.fulfill({status:404,body:'missing'});}});
 const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));const go=async route=>{await page.goto('http://legends.local/#/'+route);await page.locator('.topbar').waitFor();};


 const initial={...defaultProfile(),gold:10000,helpSeen:true,onboardingDismissed:true},target=heroForId(roster,initial.team[0]);
 const spare=nextCopyId(initial,target.id);initial.copySequence=spare.sequence;initial.collection[spare.id]=1;initial.heroXp[spare.id]=0;initial.ascensions[spare.id]=0;initial.awakenings[spare.id]=0;
 await go('home');await page.evaluate(({k,p})=>localStorage.setItem(k,JSON.stringify(p)),{k:PROFILE_KEY,p:initial});await page.reload();
 for(const width of [320,390,1440]){
  await page.setViewportSize({width,height:844});await go('quests');await page.locator('[data-action="quest-status"][data-state="ready"]').click();
  await page.locator('.empty-state').waitFor();assert.equal(await page.locator('.empty-state p').evaluate(e=>getComputedStyle(e).color),'rgb(65, 70, 80)');
  if(width===390)await page.screenshot({path:root+'artifacts/quest-empty-contrast-phone.png'});
  await page.getByRole('button',{name:'Guide',exact:true}).click();
  const dialog=page.locator('#modal');assert.equal(await dialog.evaluate(e=>getComputedStyle(e).backgroundColor),'rgb(191, 187, 197)');
  for(const topic of ['battles','growth','factions','effects','tools','summon']){
   await page.locator('[data-action="guide-topic"][data-topic="'+topic+'"]').click();
   if(topic==='factions')await dialog.locator('.faction-guide-list summary').first().click();
   if(topic==='effects')for(const kind of ['buff','debuff','action']){await dialog.locator('[data-action="guide-effects"][data-kind="'+kind+'"]').click();assert.ok(await dialog.locator('.codex-card p').evaluateAll(ns=>ns.length>0&&ns.every(e=>getComputedStyle(e).color==='rgb(65, 70, 80)')));}
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
   if(width===390)await dialog.screenshot({path:root+'artifacts/guide-'+topic+'-parchment-phone.png'});
  }
  await dialog.locator('[data-action="close"]').click();await go('champion/'+target.id);
  await page.locator('[data-action="feed-preview"]').click();await page.locator('#modal[data-view=feeding][open]').waitFor();assert.equal(await dialog.evaluate(e=>getComputedStyle(e).backgroundColor),'rgb(191, 187, 197)');
  await dialog.locator('[name="feed-copy"]').first().check();assert.ok(await dialog.locator('[data-action="feed-confirm"]').isEnabled());
  assert.equal(await dialog.locator('.feeding-list label').first().evaluate(e=>getComputedStyle(e).backgroundColor),'rgb(234, 211, 187)');
  assert.ok(await dialog.locator('[data-action="feed-confirm"]').isVisible());
  if(width===390)await page.screenshot({path:root+'artifacts/feeding-parchment-phone.png'});
  await dialog.getByRole('button',{name:'Cancel',exact:true}).click();
 }
 assert.deepEqual(errors,[]);console.log('PASS: empty quests, all Guide topics and effect categories, feeding selection and fixed actions at 320/390/1440.');
}finally{await browser.close();}
