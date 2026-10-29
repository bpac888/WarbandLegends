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
 const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
 const profile={...defaultProfile(),helpSeen:true};for(const c of added)profile.collection[c.id]=1;
 await context.addInitScript(({p,key})=>{if(!localStorage.getItem(key))localStorage.setItem(key,JSON.stringify(p));},{p:profile,key:PROFILE_KEY});
 const settle=async()=>{await page.evaluate(()=>Promise.all(document.getAnimations().filter(a=>a.effect?.getTiming().iterations!==Infinity).map(a=>a.finished.catch(()=>{}))));};
 const go=async route=>{await page.goto('http://legends.local/#/'+route);await page.locator('.topbar').waitFor();await settle();};
 await go('roster');await page.locator('[data-tab="all"]').click();assert.equal(await page.locator('#library-grid .library-card').count(),200);
 await page.locator('#library-grid .library-art>img').evaluateAll(imgs=>imgs.forEach(i=>i.loading='eager'));
 await page.waitForFunction(()=>[...document.querySelectorAll('#library-grid .library-art>img')].every(i=>i.complete&&i.naturalWidth>0));
 for(const c of added){const card=page.locator(`#library-grid [data-id="${c.id}"]`),image=card.locator('.library-art>img');assert.ok(await image.evaluate(i=>i.naturalWidth===1024&&i.naturalHeight===1536&&getComputedStyle(i).filter==='none'&&getComputedStyle(i).opacity==='1'),c.id);assert.ok((await card.getAttribute('aria-label')).includes(c.rarity));assert.ok((await card.getAttribute('aria-label')).includes(c.role));}
 await page.locator('.collection-filters summary').click();
 for(const color of ['red','blue','green','yellow','purple']){await page.locator('#collection-color').selectOption(color);assert.equal(await page.locator('#library-grid .library-card').count(),roster.filter(c=>c.color===color).length);}
 await page.locator('#collection-color').selectOption('all');await page.locator('#collection-rarity').selectOption('legendary');assert.equal(await page.locator('#library-grid .library-card').count(),88);
 await page.locator('#collection-rarity').selectOption('rare');assert.equal(await page.locator('#library-grid .library-card').count(),68);
 await page.locator('#collection-rarity').selectOption('all');await page.locator('#collection-sort').selectOption('element');
 const elements=await page.locator('#library-grid .library-card').evaluateAll(cards=>cards.map(c=>['red','blue','green','yellow','purple'].findIndex(v=>c.classList.contains(v))));assert.deepEqual(elements,[...elements].sort((a,b)=>a-b));
 await page.locator('[data-tab="owned"]').click();for(const c of added)assert.equal(await page.locator(`#library-grid [data-id="${c.id}"]`).count(),1);
 for(const width of [320,390,760,1440]){
  await page.setViewportSize({width,height:width>700?1000:844});
  for(const c of added){
   await go('champion/'+c.id);await page.locator('.champion-special').waitFor();
   assert.equal(await page.locator('.champion-biography h1').textContent(),c.name);
   assert.equal(await page.locator('.champion-special h2').textContent(),c.special.name);
   assert.ok((await page.locator('.champion-biography>.eyebrow').textContent()).includes(factionLabel(c.faction)));
   const art=page.locator('.champion-showcase>img');await art.evaluate(i=>i.decode());
   assert.ok(await art.evaluate(i=>i.naturalWidth===1024&&i.naturalHeight===1536&&getComputedStyle(i).filter==='none'&&getComputedStyle(i).opacity==='1'),c.id+' detail art');
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),c.id+' overflow '+width);
   assert.equal(await page.locator('.advancement-menu').count(),2,c.id+' ascension/Limit Break');
  }
  await go('champion/'+added[width<700?0:10].id);await page.screenshot({path:root+`artifacts/roster200-dossier-${width}.png`,fullPage:true});
 }
 await page.setViewportSize({width:390,height:844});await go('roster');await page.locator('[data-tab="all"]').click();await page.screenshot({path:root+'artifacts/roster200-codex-phone.png',fullPage:true});
 assert.deepEqual(errors,[]);console.log(JSON.stringify({passed:true,characters:200,newPortraits:11,dossiers:44,viewports:[320,390,760,1440],checks:['all 200 Codex portraits load','native 1024x1536 art with no tint or filter','owned collection and all element/rarity filters','element sorting','names, faction labels and Specials','ascension and Limit Break menus','no overflow, missing assets, external calls or browser errors']},null,2));
}finally{await browser.close();}
