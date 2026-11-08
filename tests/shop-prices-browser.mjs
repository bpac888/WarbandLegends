import {battleFixtureResponse} from './battle-fixture.mjs';
import {createRequire} from 'node:module';import fs from 'node:fs/promises';import path from 'node:path';import assert from 'node:assert/strict';import {createBattle} from '../src/engine.js';import {developedChampion} from '../src/development.js';import {accountDevelopment} from '../src/keeper.js';import {PROFILE_KEY,BATTLE_KEY} from '../src/storage.js';import {playToOutcome} from './browser-play.mjs';
const require=createRequire(import.meta.url),{chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright'),root=new URL('../',import.meta.url).pathname,roster=JSON.parse(await fs.readFile(root+'data/champions.json','utf8'));
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||undefined,args:['--no-sandbox']});
try{const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'}),errors=[];await fs.mkdir(root+'artifacts',{recursive:true});await context.route('**/*',async route=>{const u=new URL(route.request().url());if(u.hostname!=='legends.local'){errors.push('External request');return route.abort();}try{const p=path.join(root,'dist',u.pathname==='/'?'index.html':decodeURIComponent(u.pathname));await route.fulfill({body:battleFixtureResponse(p,await fs.readFile(p)),contentType:({'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.webp':'image/webp','.svg':'image/svg+xml'})[path.extname(p)]});}catch{errors.push('Missing '+u.pathname);await route.fulfill({status:404,body:'missing'});}});const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));await page.clock.setFixedTime(new Date('2026-10-19T12:00:00Z'));const go=async r=>{await page.goto('http://legends.local/#/'+r);await page.locator('.topbar').waitFor();};const profile=()=>page.evaluate(k=>JSON.parse(localStorage.getItem(k)),PROFILE_KEY);
await go('shop');
const before=await profile();
await page.locator('[data-action="gem-preview"][data-id="star-thread"]').click();
await page.getByRole('button',{name:'Cancel',exact:true}).click();assert.deepEqual(await profile(),before);
await page.locator('[data-action="gem-preview"][data-id="star-thread"]').click();
await page.locator('[data-action="gem-confirm"]').click();assert.equal((await profile()).gems,488);assert.equal((await profile()).materials['star-thread'],1);
await page.locator('[data-action="shop-tab"][data-tab="premium"]').click();
const prices=page.locator('.premium-price');assert.equal(await prices.count(),24);
for(const b of await prices.all()){assert.ok(await b.isDisabled());assert.match(await b.textContent(),/^\$\d+\.\d{2} USD$/);}
assert.equal(await page.locator('[data-offer="tome-of-ascension"] .premium-price').textContent(),'$9.99 USD');
assert.equal(await page.locator('[data-offer="tome-of-limit-break"] .premium-price').textContent(),'$14.99 USD');
for(const width of [390,1440]){await page.setViewportSize({width,height:844});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await page.screenshot({path:root+'artifacts/premium-prices-'+width+'.png',fullPage:true});}
assert.deepEqual(errors,[]);console.log('PASS: new material charge, purchase cancellation, all 24 USD preview prices disabled, phone and desktop layouts');
}finally{await browser.close();}
