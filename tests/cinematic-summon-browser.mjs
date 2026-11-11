import {createRequire} from 'node:module';import fs from 'node:fs/promises';import path from 'node:path';import assert from 'node:assert/strict';
import {defaultProfile} from '../src/progression.js';import {PROFILE_KEY} from '../src/storage.js';import {ASCENSION_CAPS} from '../src/ascension.js';
const root=new URL('../',import.meta.url).pathname,{chromium}=createRequire(import.meta.url)('playwright'),roster=JSON.parse(await fs.readFile(root+'data/champions.json'));
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
try{
 const context=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'}),errors=[],videos=[];
 await fs.mkdir(root+'artifacts',{recursive:true});
 await context.route('**/*',async r=>{const u=new URL(r.request().url());if(u.pathname.endsWith('.mp4'))videos.push(u.pathname);try{const f=path.join(root,'dist',u.pathname==='/'?'index.html':decodeURIComponent(u.pathname));await r.fulfill({body:await fs.readFile(f),contentType:({'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.webp':'image/webp','.svg':'image/svg+xml','.png':'image/png','.mp4':'video/mp4','.ttf':'font/ttf','.otf':'font/otf'})[path.extname(f)]});}catch{errors.push('Missing '+u.pathname);await r.abort();}});

 const p={...defaultProfile(),onboardingDismissed:true,helpSeen:true,gems:1000};
 await context.addInitScript(({p,key})=>{if(!localStorage.getItem(key))localStorage.setItem(key,JSON.stringify(p));sessionStorage.setItem('warband-intro-seen','1');},{p,key:PROFILE_KEY});
 const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));await page.emulateMedia({reducedMotion:'no-preference'});await page.goto('http://upgrade.local/#/summon');await page.locator('.altar-actions').waitFor();
 const pool=roster.filter(c=>c.rarity==='legendary'),index=pool.findIndex(c=>c.id==='bronze_juggernaut');
 await page.evaluate(values=>{const native=crypto.getRandomValues.bind(crypto);crypto.getRandomValues=array=>{if(values.length){array[0]=values.shift();return array;}return native(array);};},[Math.floor(.82*4294967296),Math.floor((index+.5)/pool.length*4294967296)]);
 await page.locator('[data-action="summon"]').click();await page.locator('.cinematic-overlay').waitFor({timeout:15000});assert.match(await page.locator('.cinematic-overlay video').getAttribute('src'),/juggernaut/);await page.locator('.cinematic-skip').click();await page.locator('#modal[data-view="summon-results"]').waitFor();assert.match(await page.locator('#modal').innerText(),/Bronze Juggernaut/);const saved=()=>page.evaluate(k=>JSON.parse(localStorage.getItem(k)),PROFILE_KEY);assert.equal((await saved()).gems,900);assert.equal((await saved()).summons,1);await page.locator('#modal [data-action="close"]').first().click();
 await page.evaluate(values=>{const native=crypto.getRandomValues.bind(crypto);crypto.getRandomValues=array=>{if(values.length){array[0]=values.shift();return array;}return native(array);};},[Math.floor(.82*4294967296),Math.floor((index+.5)/pool.length*4294967296)]);
 const priorVideoRequests=videos.length;await page.locator('[data-action="summon"]').click();await page.locator('[data-action="skip-ritual"]').click();await page.locator('#modal[data-view="summon-results"]').waitFor();assert.equal(videos.length,priorVideoRequests,'Skip Ritual bypasses cinematic');assert.equal((await saved()).gems,800);assert.equal((await saved()).summons,2);await page.locator('#modal [data-action="close"]').first().click();
 for(const clip of ['iseldra','juggernaut','vex','jade-dragon']){
  await page.evaluate(clip=>{window.cinematicDone=false;import('./src/cinematics.js').then(m=>m.playCinematic(clip,{profile:{},duration:2000})).then(()=>window.cinematicDone=true);},clip);
  await page.waitForFunction(()=>document.querySelector('.cinematic-overlay video')?.readyState>=2);await page.locator('.cinematic-skip').click();await page.waitForFunction(()=>window.cinematicDone);
 }
 // A missing clip resolves to the still-image game immediately instead of trapping input.
 await context.route('**/jade-dragon.mp4',r=>r.abort());await page.evaluate(()=>{window.cinematicDone=false;import('./src/cinematics.js').then(m=>m.playCinematic('jade-dragon',{profile:{},duration:1000})).then(()=>window.cinematicDone=true);});await page.waitForFunction(()=>window.cinematicDone,{timeout:6000});assert.equal(await page.locator('.cinematic-overlay').count(),0);
 assert.deepEqual(errors,[]);console.log('PASS: real seeded Legendary summon with video reveal, Skip Ritual bypass, once-only charges/awards, four playable clips and missing-video fallback.');
}finally{await browser.close();}
