import {createRequire} from 'node:module';
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {defaultProfile} from '../src/progression.js';
import {PROFILE_KEY} from '../src/storage.js';
import {PREMIUM_ITEMS,BOOSTER_DURATION} from '../src/premium-items.js';
import {xpForLevel} from '../src/development.js';
const root=new URL('../',import.meta.url).pathname,roster=JSON.parse(await fs.readFile(root+'data/champions.json'));
const {chromium}=createRequire(import.meta.url)('playwright');
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
try{
 const context=await browser.newContext({viewport:{width:390,height:950},reducedMotion:'reduce'}),errors=[];
 await context.route('**/*',async route=>{try{const u=new URL(route.request().url()),file=path.join(root,'dist',u.pathname==='/'?'index.html':decodeURIComponent(u.pathname));await route.fulfill({body:await fs.readFile(file),contentType:({'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.webp':'image/webp','.png':'image/png','.svg':'image/svg+xml','.ttf':'font/ttf','.otf':'font/otf'})[path.extname(file)]});}catch{errors.push(route.request().url());await route.abort();}});
 const p={...defaultProfile(),helpSeen:true,premiumItems:Object.fromEntries(PREMIUM_ITEMS.map(i=>[i.id,2]))},[asc,limit]=roster.filter(c=>c.rarity==='legendary');
 p.collection[asc.id]=1;p.heroXp[asc.id]=xpForLevel(asc,40);
 p.collection[limit.id]=1;p.ascensions[limit.id]=3;p.heroXp[limit.id]=xpForLevel(limit,70);p.gold=0;p.materials={};
 await context.addInitScript(({key,p})=>{if(!localStorage.getItem(key))localStorage.setItem(key,JSON.stringify(p));},{key:PROFILE_KEY,p});
 const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
 const profile=()=>page.evaluate(key=>JSON.parse(localStorage.getItem(key)),PROFILE_KEY);
 await page.goto('http://premium.local/#/shop');await page.locator('[data-action="shop-tab"][data-tab="premium"]').click();
 for(const item of PREMIUM_ITEMS){const card=page.locator(`[data-offer="${item.id}"]`);assert.ok(await card.locator('button').isDisabled());await card.locator('img').evaluate(i=>i.decode());assert.ok(await card.locator('img').evaluate(i=>i.naturalWidth>=1000));}
 for(const width of [320,390,760,1440]){await page.setViewportSize({width,height:950});await page.locator('[data-offer="experience-booster"]').scrollIntoViewIfNeeded();assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));if(width===390||width===1440)await page.screenshot({path:root+`artifacts/premium-new-items-${width}.png`});}
 await page.setViewportSize({width:390,height:950});await page.goto('http://premium.local/#/inventory');
 for(const id of ['experience-booster','gold-booster']){
  const card=page.locator(`.premium-inventory [data-premium-item="${id}"]`),before=await profile();
  await card.locator('button').click();await page.locator('#modal [data-action="close"]').last().click();assert.deepEqual(await profile(),before);
  await card.locator('button').click();const at=Date.now();await page.locator('[data-action="premium-item-confirm"]').click();
  const after=await profile(),kind=id==='gold-booster'?'gold':'experience';assert.equal(after.premiumItems[id],1);assert.ok(after.boosters[kind]>=at+BOOSTER_DURATION-1000&&after.boosters[kind]<=Date.now()+BOOSTER_DURATION);
  assert.ok(await card.locator('button').isDisabled());assert.match(await card.innerText(),/Active/);
 }
 const active=await profile();await page.reload();await page.locator('.premium-inventory').waitFor();assert.deepEqual(await profile(),active);
 for(const [id,target,field]of [['tome-of-ascension',asc,'ascensions'],['tome-of-limit-break',limit,'awakenings']]){
  const before=await profile(),card=page.locator(`.premium-inventory [data-premium-item="${id}"]`);await card.locator('button').click();await page.locator('#premium-item-champion').selectOption(target.id);await page.locator('[data-action="premium-item-confirm"]').click();
  const after=await profile();assert.equal(after[field][target.id],1);assert.equal(after.premiumItems[id],1);assert.equal(after.gold,before.gold);assert.deepEqual(after.materials,before.materials);
  await card.locator('button').click();assert.ok(await page.locator('[data-action="premium-item-confirm"]').isDisabled());await page.locator('#modal [data-action="close"]').last().click();assert.deepEqual(await profile(),after);
 }
 for(const width of [320,390,760,1440]){await page.setViewportSize({width,height:950});await page.locator('.premium-inventory').scrollIntoViewIfNeeded();assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));if(width===390||width===1440)await page.screenshot({path:root+`artifacts/premium-inventory-${width}.png`});}
 await page.evaluate(key=>{const p=JSON.parse(localStorage.getItem(key));p.boosters.experience=Date.now()+3000;localStorage.setItem(key,JSON.stringify(p));},PROFILE_KEY);
 await page.reload();const xpCard=page.locator('.premium-inventory [data-premium-item="experience-booster"]');await xpCard.waitFor();assert.ok(await xpCard.locator('button').isDisabled());await page.waitForFunction(()=>!document.querySelector('.premium-inventory [data-premium-item="experience-booster"] button').disabled,{},{timeout:8000});assert.equal(await xpCard.locator('.booster-status').count(),0,'expiry refreshes inventory without reloading');
 await page.evaluate(key=>{const p=JSON.parse(localStorage.getItem(key));p.premiumItems={'epic-tome-experience':1};p.boosters={gold:Date.now()+86400000};localStorage.setItem(key,JSON.stringify(p));},PROFILE_KEY);
 await page.reload();await page.locator('.premium-inventory').waitFor();
 assert.equal(await page.locator('[data-premium-item]').count(),2,'only owned tome and active unowned booster');
 assert.ok(await page.locator('[data-premium-item="gold-booster"] button').isDisabled());
 const tome=page.locator('[data-premium-item="epic-tome-experience"]');await tome.locator('button').click();
 const target=await page.locator('#premium-item-champion').inputValue(),beforeTome=await profile();
 await page.locator('[data-action="premium-item-confirm"]').click();const afterTome=await profile();
 assert.equal(afterTome.premiumItems['epic-tome-experience'],0);assert.ok(afterTome.heroXp[target]>(beforeTome.heroXp[target]||0));
 assert.equal(await page.locator('[data-premium-item="epic-tome-experience"]').count(),0,'spent tome disappears');
 await page.evaluate(key=>{const p=JSON.parse(localStorage.getItem(key));p.boosters={};localStorage.setItem(key,JSON.stringify(p));},PROFILE_KEY);
 await page.reload();await page.locator('.inventory-grid').waitFor();assert.equal(await page.locator('.premium-inventory').count(),0,'empty premium section hidden');
 assert.deepEqual(errors,[]);console.log('PASS: HD preview art, disabled purchases, activation/cancel, independent 24-hour boosters, save/reload, live expiry, free tome use and blocked ineligible targets, phone/tablet/desktop layouts.');
}finally{await browser.close();}
