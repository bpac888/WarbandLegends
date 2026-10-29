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
 const profile={...defaultProfile(),helpSeen:true};for(const c of added)profile.collection[c.id]=1;
 await context.addInitScript(({p,key})=>{if(!localStorage.getItem(key))localStorage.setItem(key,JSON.stringify(p));},{p:profile,key:PROFILE_KEY});
 const settle=async()=>{await page.evaluate(()=>Promise.all(document.getAnimations().filter(a=>a.effect?.getTiming().iterations!==Infinity).map(a=>a.finished.catch(()=>{}))));};
 const go=async route=>{await page.goto('http://legends.local/#/'+route);await page.locator('.topbar').waitFor();await settle();};
 for(const width of [320,390,760,1440]){
  await page.setViewportSize({width,height:width>700?1000:844});await go('events');
  assert.equal(await page.locator('.event-landmark').count(),3);
  const art=page.locator('.event-map>picture>img');await art.evaluate(i=>i.decode());
  assert.ok(await art.evaluate(i=>getComputedStyle(i).filter==='none'&&getComputedStyle(i).opacity==='1'));
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  const text=await page.locator('.page-events').innerText();assert.ok(!/When the World|Three monthly|Between Windows|Edit Warband|Returns on days|Visit Shop/i.test(text));
  for(const id of ['crimson_eclipse','frostwake_siege','veil_of_umbra']){
   const target=page.locator('[data-event="'+id+'"]');assert.ok(await target.isEnabled());await target.click();
   const play=page.locator('.event-play');await play.waitFor();assert.equal(await page.locator('#modal .modal-body img,#modal .modal-body h3,#modal .event-attempts').count(),0);assert.ok((await page.locator('#modal').boundingBox()).height<180);assert.ok(await play.isDisabled());assert.match(await play.innerText(),/Open Days/);
   await page.locator('[data-action="close"]').first().click();
  }
  await page.screenshot({path:root+`artifacts/event-map-${width}.png`,fullPage:true});
 }
 for(const [day,id] of [[5,'crimson_eclipse'],[12,'frostwake_siege'],[20,'veil_of_umbra']]){
  await page.evaluate(d=>localStorage.setItem('event-test-date',d),`2026-10-${String(day).padStart(2,'0')}T19:00:00Z`);
  await go('events');await page.locator('[data-event="'+id+'"]').click();assert.ok(await page.locator('.event-play').isEnabled());assert.match(await page.locator('.event-play').innerText(),/Fight/);await page.locator('.event-play').click();await page.getByRole('button',{name:'Begin battle',exact:true}).waitFor();assert.ok(await page.getByRole('button',{name:'Begin battle',exact:true}).isEnabled());await page.locator('[data-action="close"]').first().click();
 }
 assert.deepEqual(errors,[]);console.log(JSON.stringify({passed:true,viewports:[320,390,760,1440],checks:['three bright accessible regions, including closed windows','compact area panels with schedule on disabled battle buttons','active battles reach confirmation in all three monthly windows','no removed copy, overflow, missing assets or browser errors']},null,2));
}finally{await browser.close();}
