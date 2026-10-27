import {createRequire} from 'node:module';
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {defaultProfile} from '../src/progression.js';
import {PROFILE_KEY} from '../src/storage.js';
const require=createRequire(import.meta.url),{chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright'),root=new URL('../',import.meta.url).pathname;
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||undefined,args:['--no-sandbox']});
try{
 const context=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'}),errors=[];
 await context.route('**/*',async route=>{const u=new URL(route.request().url());if(u.hostname!=='legends.local'){errors.push('External '+u.href);return route.abort();}try{const p=path.join(root,'dist',u.pathname==='/'?'index.html':decodeURIComponent(u.pathname));await route.fulfill({body:await fs.readFile(p),contentType:({'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.webp':'image/webp','.svg':'image/svg+xml','.ttf':'font/ttf','.otf':'font/otf'})[path.extname(p)]});}catch{errors.push('Missing '+u.pathname);await route.fulfill({status:404,body:'missing'});}});
 const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));await page.clock.install({time:new Date('2026-10-18T12:00:00Z')});
 const go=async route=>{await page.goto('http://legends.local/#/'+route);await page.locator('.topbar').waitFor();};
 const read=()=>page.evaluate(k=>JSON.parse(localStorage.getItem(k)),PROFILE_KEY);
 const load=async p=>{await go('home');await page.evaluate(({k,p})=>localStorage.setItem(k,JSON.stringify(p)),{k:PROFILE_KEY,p});await page.reload();await page.locator('.topbar').waitFor();};
 let p={...defaultProfile(),helpSeen:true,energy:1,energyDate:'2026-10-18'};await load(p);
 assert.equal(await page.locator('.energy-amount').innerText(),'1/51');
 await go('campaign');await page.locator('.campaign-node[data-stage="ashen-gate"]').click();await page.getByRole('button',{name:'Confirm',exact:true}).click();await page.locator('.board').waitFor();assert.equal((await read()).energy,0);assert.equal(await page.locator('.game-energy').count(),0);
 await page.locator('.battle-exit').click();await page.getByRole('button',{name:'Stay in battle',exact:true}).click();assert.equal((await read()).energy,0);assert.equal(await page.locator('.board').count(),1);
 await page.locator('.battle-exit').click();await page.getByRole('button',{name:'Exit to Tavern',exact:true}).click();assert.equal(await page.locator('.energy-amount').innerText(),'0/51');
 await go('campaign');await page.locator('.campaign-node[data-stage="ashen-gate"]').click();await page.getByRole('button',{name:'Confirm',exact:true}).click();assert.equal(await page.locator('.board').count(),0);assert.match(await page.locator('#notice').innerText(),/Need 1 Energy/);assert.equal((await read()).energy,0);
 await page.clock.setFixedTime(new Date('2026-10-19T06:59:59Z'));await page.clock.runFor(15000);assert.equal(await page.locator('.energy-amount').innerText(),'0/51');
 await page.clock.setFixedTime(new Date('2026-10-19T07:00:00Z'));await page.clock.runFor(15000);assert.equal(await page.locator('.energy-amount').innerText(),'51/51');assert.equal((await read()).energyDate,'2026-10-19');
 p={...defaultProfile(),helpSeen:true,energy:0,energyDate:'2026-10-19',accountXp:99,summons:1};await load(p);await go('quests');await page.locator('[data-action="claim-quest"][data-id="first-summon"]').click();assert.equal((await read()).energy,52);assert.equal(await page.locator('.energy-amount').innerText(),'52/52');
 p={...defaultProfile(),helpSeen:true,energy:0,energyDate:'2026-10-19'};await load(p);await go('events');await page.locator('.event-actions [data-action="preview-encounter"]').click();await page.getByRole('button',{name:'Begin battle',exact:true}).click();await page.locator('.board').waitFor();assert.equal((await read()).energy,0);assert.equal((await read()).eventAttempts['veil_of_umbra:2026-10'],1);
 await page.locator('.battle-exit').click();await page.getByRole('button',{name:'Exit to Tavern',exact:true}).click();assert.equal((await read()).energy,0);
 p={...defaultProfile(),helpSeen:true,energy:0,energyDate:'2026-10-19',dailyLastDate:'2026-10-19'};await load(p);await go('daily');assert.match(await page.locator('.daily-vista').innerText(),/midnight PST/);assert.doesNotMatch(await page.locator('body').innerText(),/Los Angeles/);
 assert.deepEqual(errors,[]);console.log('Energy spending, exit/no-refund, insufficient-energy block, live midnight refill, level-up refill and free event entry passed');
}finally{await browser.close();}
