import {createRequire} from 'node:module';
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {defaultProfile} from '../src/progression.js';
import {PROFILE_KEY} from '../src/storage.js';
const {chromium}=createRequire(import.meta.url)(process.env.PLAYWRIGHT_MODULE||'playwright');
const root=new URL('../',import.meta.url).pathname,roster=JSON.parse(await fs.readFile(root+'data/champions.json')),added=roster.slice(150);
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||undefined,args:['--no-sandbox']});
try{
 const context=await browser.newContext({viewport:{width:390,height:844}}),errors=[];
 await context.route('**/*',async route=>{const u=new URL(route.request().url());if(u.hostname!=='legends.local'){errors.push('external '+u.hostname);return route.abort();}try{const p=path.join(root,'dist',u.pathname==='/'?'index.html':decodeURIComponent(u.pathname));await route.fulfill({body:await fs.readFile(p),contentType:({'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.webp':'image/webp','.svg':'image/svg+xml','.otf':'font/otf','.ttf':'font/ttf'})[path.extname(p)]});}catch{errors.push('missing '+u.pathname);await route.fulfill({status:404,body:'missing'});}});
 const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
 const p={...defaultProfile(),helpSeen:true};await context.addInitScript(({p,key})=>{if(!localStorage.getItem(key))localStorage.setItem(key,JSON.stringify(p));},{p,key:PROFILE_KEY});
 const go=async route=>{await page.goto('http://legends.local/#/'+route);await page.locator('.topbar').waitFor();};
 await go('roster');await page.locator('[data-tab="all"]').click();assert.equal(await page.locator('#library-grid .library-card').count(),162);
 await page.locator('.library-art>img').evaluateAll(imgs=>imgs.forEach(i=>i.loading='eager'));
 await page.waitForFunction(()=>[...document.querySelectorAll('.library-art>img')].every(i=>i.complete&&i.naturalWidth>0));
 for(const c of added){const image=page.locator(`#library-grid [data-id="${c.id}"] .library-art>img`);assert.ok(await image.evaluate(i=>i.naturalWidth===768&&i.naturalHeight===1152&&getComputedStyle(i).filter==='none'&&getComputedStyle(i).opacity==='1'),c.id);}
 for(const width of [320,390,760,1440]){
  await page.setViewportSize({width,height:width>700?1000:844});
  for(const c of added){await go('champion/'+c.id);await page.locator('.champion-special').waitFor();assert.ok((await page.locator('body').innerText()).includes(c.name));assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),c.id+' overflow '+width);}
  await go('champion/nyrali_moon_pride');await page.screenshot({path:root+`artifacts/audit-nyrali-${width}.png`,fullPage:true});
 }
 await page.setViewportSize({width:390,height:844});await go('champion/nix_biosteel_hunter');await page.screenshot({path:root+'artifacts/audit-nix-phone.png',fullPage:true});
 assert.deepEqual(errors,[]);console.log('162 Codex portraits loaded; all 12 new full-resolution portraits and 48 dossiers checked across four viewports; no missing assets, overflow or browser errors');
}finally{await browser.close();}
