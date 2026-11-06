import {createRequire} from 'node:module';
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {defaultProfile} from '../src/progression.js';
import {PROFILE_KEY} from '../src/storage.js';
import {factionLabel} from '../src/collection.js';
const {chromium}=createRequire(import.meta.url)(process.env.PLAYWRIGHT_MODULE||'playwright');
const root=new URL('../',import.meta.url).pathname,roster=JSON.parse(await fs.readFile(root+'data/champions.json')),added=roster.slice(189);
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||undefined,args:['--no-sandbox']});
try{
 const context=await browser.newContext({viewport:{width:390,height:844}}),errors=[];
 await context.route('**/*',async route=>{const u=new URL(route.request().url());if(u.hostname!=='legends.local'){errors.push('external '+u.hostname);return route.abort();}try{const file=path.join(root,'dist',u.pathname==='/'?'index.html':decodeURIComponent(u.pathname));await route.fulfill({body:await fs.readFile(file),contentType:({'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.webp':'image/webp','.png':'image/png','.svg':'image/svg+xml','.otf':'font/otf','.ttf':'font/ttf'})[path.extname(file)]});}catch{errors.push('missing '+u.pathname);await route.fulfill({status:404,body:'missing'});}});
 await context.addInitScript(()=>{const Real=Date;globalThis.Date=class extends Real{constructor(...a){super(...(a.length?a:[localStorage.getItem('event-test-date')||'2026-10-28T19:00:00Z']));}static now(){return new Real('2026-10-28T19:00:00Z').getTime();}};});const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
 const profile={...defaultProfile(),helpSeen:true,eventAttempts:{'crimson_eclipse:2026-10':7}};for(const c of added)profile.collection[c.id]=1;
 await context.addInitScript(({p,key})=>{if(!localStorage.getItem(key))localStorage.setItem(key,JSON.stringify(p));},{p:profile,key:PROFILE_KEY});
 const settle=async()=>{await page.evaluate(()=>Promise.all(document.getAnimations().filter(a=>a.effect?.getTiming().iterations!==Infinity).map(a=>a.finished.catch(()=>{}))));};
 const go=async route=>{await page.goto('http://legends.local/#/'+route);await page.locator('.topbar').waitFor();await settle();};
 for(const width of [320,390,760,1440]){
  await page.setViewportSize({width,height:width>700?1000:844});await go('events');
  assert.equal(await page.locator('.event-landmark').count(),3);assert.equal(await page.locator('.event-map-heading').count(),0);assert.ok((await page.locator('.event-map').boundingBox()).width>width*.94||width>1400);
  const art=page.locator('.event-map>picture>img');await art.evaluate(i=>i.decode());
  assert.ok(await art.evaluate(i=>getComputedStyle(i).filter==='none'&&getComputedStyle(i).opacity==='1'));
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  if(width===390||width===1440){
   await page.evaluate(()=>document.fonts.ready);const map=page.locator('.event-map'),layer=page.locator('.event-map-magic');assert.equal(await layer.getAttribute('aria-hidden'),'true');assert.equal(await layer.evaluate(e=>getComputedStyle(e).pointerEvents),'none');
   const motion=()=>layer.evaluate(e=>[getComputedStyle(e.querySelector('.event-eclipse-glow'),'::before').opacity,getComputedStyle(e.querySelector('.event-aurora')).backgroundPosition,getComputedStyle(e.querySelector('.event-portal-swirl'),'::before').transform]);
   const before=await motion();await page.waitForTimeout(300);const after=await motion();assert.ok(after.every((v,i)=>v!==before[i]),'all three effects animate');
   await map.evaluate(e=>e.getAnimations({subtree:true}).forEach(a=>a.pause()));const painted=await map.screenshot({path:root+`artifacts/event-effects-${width}.png`});
   for(const selector of ['.event-eclipse-glow','.event-aurora','.event-portal-swirl']){const effect=layer.locator(selector);await effect.evaluate(e=>e.style.visibility='hidden');const hidden=await map.screenshot();assert.notEqual(Buffer.compare(painted,hidden),0,selector+' is painted over the artwork');await effect.evaluate(e=>e.style.visibility='');}
   await map.evaluate(e=>e.getAnimations({subtree:true}).forEach(a=>a.play()));
   await page.emulateMedia({reducedMotion:'reduce'});assert.equal(await layer.evaluate(e=>e.getAnimations({subtree:true}).length),0,'reduced motion stops the effects');await page.emulateMedia({reducedMotion:'no-preference'});
  }
  const text=await page.locator('.page-events').innerText();assert.ok(!/When the World|Three monthly|Between Windows|Edit Warband|Returns on days|Visit Shop/i.test(text));
  for(const id of ['crimson_eclipse','frostwake_siege','veil_of_umbra']){
   const target=page.locator('[data-event="'+id+'"]');assert.ok(await target.isEnabled());await target.click();
   const modal=page.locator('#modal[data-view="event-stage"]');await modal.waitFor();
   assert.equal(await modal.locator('.encounter-preview img').count(),1);assert.equal(await modal.locator('.event-attempts').innerText(),(id==='crimson_eclipse'?'13':'20')+'/20 attempts remaining');
   assert.ok(await modal.getByRole('button',{name:'Begin battle',exact:true}).isDisabled());assert.match(await modal.locator('.event-entry-note').innerText(),/Open days/);
   assert.equal(await modal.locator('.encounter-stats,.modal-header .eyebrow').count(),0);assert.ok(!(await modal.innerText()).includes('Victory grants'));
   assert.equal(await modal.locator('.modal-header').evaluate(e=>parseFloat(getComputedStyle(e).borderBottomWidth)),0);
   assert.ok(await modal.evaluate(e=>e.scrollWidth<=e.clientWidth));
   await page.locator('[data-action="close"]').first().click();
  }
  await page.screenshot({path:root+`artifacts/event-map-${width}.png`,fullPage:true});
 }
 for(const width of [390,1440])for(const [day,id] of [[5,'crimson_eclipse'],[12,'frostwake_siege'],[20,'veil_of_umbra']]){
  await page.setViewportSize({width,height:950});await page.evaluate(d=>localStorage.setItem('event-test-date',d),`2026-10-${String(day).padStart(2,'0')}T19:00:00Z`);
  await go('events');const before=await page.evaluate(k=>JSON.parse(localStorage.getItem(k)),PROFILE_KEY);await page.locator('[data-event="'+id+'"]').click();
  const modal=page.locator('#modal[data-view="event-stage"]');await modal.waitFor();assert.ok(await modal.getByRole('button',{name:'Begin battle',exact:true}).isEnabled());
  assert.equal(await modal.locator('.event-attempts').innerText(),(id==='crimson_eclipse'?'13':'20')+'/20 attempts remaining');
  assert.deepEqual(await page.evaluate(k=>JSON.parse(localStorage.getItem(k)),PROFILE_KEY),before,'preview spends no attempts');
  assert.equal(await modal.locator('.encounter-stats,.modal-header .eyebrow,.recommended-level').count(),0);assert.ok(!(await modal.innerText()).includes('Victory grants'));
  assert.ok(await modal.locator('#modal-title').evaluate(e=>parseFloat(getComputedStyle(e).fontSize)<=23));
  if(id==='crimson_eclipse')await modal.screenshot({path:root+`artifacts/event-confirm-clean-${width}.png`});await page.getByRole('button',{name:'Close dialog',exact:true}).click();
 }
 // Starting the direct confirmation spends exactly one attempt; empty windows stay locked.
 await page.evaluate(()=>localStorage.setItem('event-test-date','2026-10-05T19:00:00Z'));await go('events');await page.locator('[data-event="crimson_eclipse"]').click();await page.getByRole('button',{name:'Begin battle',exact:true}).click();await page.locator('.board').waitFor();assert.equal(await page.evaluate(k=>JSON.parse(localStorage.getItem(k)).eventAttempts['crimson_eclipse:2026-10'],PROFILE_KEY),8);
 await go('events');await page.locator('[data-event="crimson_eclipse"]').click();assert.equal(await page.locator('.event-attempts').innerText(),'12/20 attempts remaining');await page.getByRole('button',{name:'Close dialog',exact:true}).click();
 await page.evaluate(k=>{const p=JSON.parse(localStorage.getItem(k));p.eventAttempts['crimson_eclipse:2026-10']=20;localStorage.setItem(k,JSON.stringify(p));},PROFILE_KEY);await page.reload();await go('events');await page.locator('[data-event="crimson_eclipse"]').click();assert.equal(await page.locator('.event-attempts').innerText(),'0/20 attempts remaining');assert.ok(await page.getByRole('button',{name:'Begin battle',exact:true}).isDisabled());
 assert.deepEqual(errors,[]);console.log(JSON.stringify({passed:true,viewports:[320,390,760,1440],checks:['three bright accessible regions, including closed windows','one direct compact description dialog, real attempt count and no removed reward/stats copy','active and closed windows, cancel and exactly-one attempt spent on entry','no removed copy, overflow, missing assets or browser errors']},null,2));
}finally{await browser.close();}
