import {createRequire} from 'node:module';
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {defaultProfile} from '../src/progression.js';
import {PROFILE_KEY} from '../src/storage.js';
const {chromium}=createRequire(import.meta.url)(process.env.PLAYWRIGHT_MODULE||'playwright');
const root=new URL('../',import.meta.url).pathname,roster=JSON.parse(await fs.readFile(root+'data/champions.json')),added=roster.filter(c=>["transmuter_prime", "azure_sovereign", "neon_god_overlord", "berserker_ulf", "executor_model_z", "brimstone_witch", "jarl_bjorn_ironhide", "necropolis_titan", "wraith_archer", "steel_oracle", "crimson_praetor", "dragon_samurai_kenshin", "chem_tank_brax", "plague_doctor", "shade_prince"].includes(c.id));
const nameAudit=JSON.parse(await fs.readFile(root+'data/roster-name-audit.json'));
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||undefined,args:['--no-sandbox']});
try{
 const context=await browser.newContext({viewport:{width:390,height:844}}),errors=[];
 await context.route('**/*',async route=>{const u=new URL(route.request().url());if(u.hostname!=='legends.local'){errors.push('external '+u.hostname);return route.abort();}try{const p=path.join(root,'dist',u.pathname==='/'?'index.html':decodeURIComponent(u.pathname));await route.fulfill({body:await fs.readFile(p),contentType:({'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.webp':'image/webp','.svg':'image/svg+xml','.otf':'font/otf','.ttf':'font/ttf'})[path.extname(p)]});}catch{errors.push('missing '+u.pathname);await route.fulfill({status:404,body:'missing'});}});
 const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
 const p={...defaultProfile(),helpSeen:true};await context.addInitScript(({p,key})=>{if(!localStorage.getItem(key))localStorage.setItem(key,JSON.stringify(p));},{p,key:PROFILE_KEY});
 const go=async route=>{await page.goto('http://legends.local/#/'+route);await page.locator('.topbar').waitFor();};
 await go('roster');await page.locator('[data-tab="all"]').click();assert.equal(await page.locator('#library-grid .library-card').count(),189);
 await page.locator('.library-art>img').evaluateAll(imgs=>imgs.forEach(i=>i.loading='eager'));
 await page.waitForFunction(()=>[...document.querySelectorAll('.library-art>img')].every(i=>i.complete&&i.naturalWidth>0));
 for(const c of added){const image=page.locator(`#library-grid [data-id="${c.id}"] .library-art>img`);assert.ok(await image.evaluate(i=>i.naturalWidth>=768&&i.naturalHeight>=1000&&getComputedStyle(i).filter==='none'&&getComputedStyle(i).opacity==='1'),c.id);}
 for(const width of [320,390,760,1440]){
  await page.setViewportSize({width,height:width>700?1000:844});
  for(const c of added){await go('champion/'+c.id);await page.locator('.champion-special').waitFor();assert.ok((await page.locator('body').innerText()).includes(c.name));assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),c.id+' overflow '+width);}
  await go('champion/transmuter_prime');await page.screenshot({path:root+`artifacts/refined-auroline-${width}.png`,fullPage:true});
 }
 await page.setViewportSize({width:390,height:844});await go('champion/necropolis_titan');await page.screenshot({path:root+'artifacts/refined-ossir-phone.png',fullPage:true});
 await page.setViewportSize({width:390,height:844});await go('champion/ophira_seed_of_worlds');
 assert.match(await page.locator('body').innerText(),/Astral Concord/i);
 await go('roster');await page.locator('[data-tab="all"]').click();
 const emblem=page.locator('#library-grid [data-id="ophira_seed_of_worlds"] .faction-emblem');await emblem.scrollIntoViewIfNeeded();
 await page.waitForFunction(()=>{const i=document.querySelector('[data-id="ophira_seed_of_worlds"] .faction-emblem');return i?.complete&&i.naturalWidth>0;});assert.ok(await emblem.evaluate(i=>i.naturalWidth>=512));
 assert.deepEqual(errors,[]);console.log('189 Codex portraits loaded; all11 refined Legendary and4 revised Rare portraits and60 dossiers checked across four viewports; Astral Concord emblem and faction labels resolve; no missing assets, overflow or browser errors');
}finally{await browser.close();}
