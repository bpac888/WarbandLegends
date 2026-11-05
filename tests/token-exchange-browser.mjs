import {createRequire} from 'node:module';
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {defaultProfile} from '../src/progression.js';
import {PROFILE_KEY} from '../src/storage.js';
import {EXCHANGE_OFFERS} from '../src/mode-progression.js';
const root=new URL('../',import.meta.url).pathname;
const {chromium}=createRequire(import.meta.url)('playwright');
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
try{
 const context=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'}),errors=[];
 await context.route('**/*',async route=>{try{const u=new URL(route.request().url()),file=path.join(root,'dist',u.pathname==='/'?'index.html':decodeURIComponent(u.pathname));await route.fulfill({body:await fs.readFile(file),contentType:({'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.webp':'image/webp','.png':'image/png','.svg':'image/svg+xml','.ttf':'font/ttf','.otf':'font/otf'})[path.extname(file)]});}catch{errors.push(route.request().url());await route.abort();}});
 const seed=defaultProfile();seed.helpSeen=true;seed.arenaTokens=100;for(const key of Object.keys(seed.eventTokens))seed.eventTokens[key]=100;
 await context.addInitScript(({p,key})=>{if(!localStorage.getItem(key))localStorage.setItem(key,JSON.stringify(p));},{p:seed,key:PROFILE_KEY});
 const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
 const profile=()=>page.evaluate(key=>JSON.parse(localStorage.getItem(key)),PROFILE_KEY);
 const group=o=>o.lootTickets?'tickets-'+o.lootTickets:o.gems?'gems-'+o.gems:'gold-'+o.gold;
 await page.goto('http://exchange.local/#/shop');await page.locator('[data-action="shop-tab"][data-tab="tokens"]').click();
 assert.equal(await page.locator('.exchange-offers>article').count(),3);
 for(const o of EXCHANGE_OFFERS){
  const card=page.locator(`[data-exchange-item="${group(o)}"]`);
  await card.locator('select').selectOption(o.id);
  assert.match(await card.locator('.exchange-cost').innerText(),new RegExp(`${o.cost} ${o.label}`));
  const before=await profile();await card.locator('[data-action="exchange-preview"]').click();
  assert.equal(await page.locator('[data-action="exchange-confirm"]').getAttribute('data-id'),o.id);
  await page.locator('#modal [data-action="close"]').last().click();assert.deepEqual(await profile(),before,'cancel does not spend tokens');
  await card.locator('[data-action="exchange-preview"]').click();await page.locator('[data-action="exchange-confirm"]').click();
  const after=await profile();
  assert.equal(after.arenaTokens,before.arenaTokens-(o.currency==='arenaTokens'?o.cost:0));
  for(const key of Object.keys(before.eventTokens))assert.equal(after.eventTokens[key],before.eventTokens[key]-(o.currency===key?o.cost:0));
  for(const key of ['gold','gems','lootTickets'])assert.equal(after[key],before[key]+(o[key]||0));
  assert.equal(await card.locator('select').inputValue(),o.id,'selected currency survives the purchase');
 }
 const saved=await profile();await page.reload();await page.locator('[data-action="shop-tab"][data-tab="tokens"]').click();assert.deepEqual(await profile(),saved);
 await page.evaluate(key=>{const p=JSON.parse(localStorage.getItem(key));p.arenaTokens=0;localStorage.setItem(key,JSON.stringify(p));},PROFILE_KEY);
 await page.reload();await page.locator('[data-action="shop-tab"][data-tab="tokens"]').click();
 const tickets=page.locator('[data-exchange-item="tickets-5"]');
 assert.notEqual(await tickets.locator('select').inputValue(),'arena-loot-tickets','defaults to an affordable currency');
 await tickets.locator('select').selectOption('arena-loot-tickets');assert.ok(await tickets.locator('button').isDisabled());
 await tickets.locator('select').selectOption(EXCHANGE_OFFERS.find(o=>o.lootTickets&&o.currency!=='arenaTokens').id);assert.ok(await tickets.locator('button').isEnabled());
 for(const width of [320,390,760,1440]){await page.setViewportSize({width,height:950});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));for(const select of await page.locator('.exchange-offers select').all()){const box=await select.boundingBox();assert.ok(box.width>0&&box.x>=0&&box.x+box.width<=width);}if(width===390||width===1440)await page.screenshot({path:root+`artifacts/token-exchange-grouped-${width}.png`});}
 assert.deepEqual(errors,[]);console.log('PASS: three grouped listings, every original token price and purchase, cancel, affordability, currency persistence, saved rewards, and four viewport sizes.');
}finally{await browser.close();}
