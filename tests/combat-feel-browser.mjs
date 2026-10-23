import {battleFixtureResponse} from './battle-fixture.mjs';
import {REFERENCE_TEAM} from './reference-team.mjs';
import {createRequire} from 'node:module';
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createBattle} from '../src/engine.js';
import {PROFILE_KEY,BATTLE_KEY} from '../src/storage.js';
const require=createRequire(import.meta.url),{chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const root=new URL('../',import.meta.url).pathname,roster=JSON.parse(await fs.readFile(root+'data/champions.json','utf8'));
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||undefined,args:['--no-sandbox']});
try{
 const context=await browser.newContext({viewport:{width:1440,height:1100},reducedMotion:'no-preference'}),errors=[];
 await context.route('**/*',async route=>{const u=new URL(route.request().url());if(u.hostname!=='legends.local'){errors.push('external '+u.host);return route.abort();}try{const p=path.join(root,'dist',u.pathname==='/'?'index.html':decodeURIComponent(u.pathname));await route.fulfill({body:battleFixtureResponse(p,await fs.readFile(p)),contentType:({'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.webp':'image/webp','.svg':'image/svg+xml'})[path.extname(p)]});}catch{errors.push('missing '+u.pathname);await route.fulfill({status:404,body:'missing'});}});
 const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));await fs.mkdir(root+'artifacts',{recursive:true});
 await page.goto('http://legends.local/#/home');await page.locator('.citadel-destinations').waitFor();
 async function loadBattle(state){await page.evaluate(({state,pk,bk})=>{const p=JSON.parse(localStorage.getItem(pk));p.helpSeen=true;localStorage.setItem(pk,JSON.stringify(p));localStorage.setItem(bk,JSON.stringify(state));},{state,pk:PROFILE_KEY,bk:BATTLE_KEY});await page.reload();await page.locator('.topbar').waitFor();await page.goto('http://legends.local/#/battle');await page.locator('.board').waitFor({timeout:5000}).catch(async e=>{console.error(JSON.stringify({errors,body:await page.locator('body').innerText()}));await page.screenshot({path:root+'artifacts/experience-load-error.png',fullPage:true});throw e;});}

 const state=createBattle(roster,REFERENCE_TEAM,'ashen-gate',945);
 state.heroes[0].rarity='mythical';state.heroes[0].mana=state.heroes[0].manaMax;state.moves=20;
 for(const h of state.heroes)h.hp=Math.ceil(h.maxHp*.25);
 for(const width of [1440,390,320]){
  await page.setViewportSize({width,height:900});await loadBattle(state);
  assert.ok(Number(await page.locator('.battle-pressure-vignette').evaluate(n=>n.style.getPropertyValue('--battle-pressure')))>.5);
  await page.locator('[data-action="hero"][data-uid="hero-0"]').click();await page.getByRole('button',{name:'Cast Charge 2'}).click();await page.locator('[data-action="enemy"][data-uid="enemy-0"]').click();
  await page.locator('.mythic-cinematic').waitFor();assert.equal(await page.locator('.mythic-copy small').textContent(),'MYTHICAL');
  const r=await page.locator('.mythic-cinematic').boundingBox();assert.ok(r.x>=0&&r.x+r.width<=width+1);
  await page.locator('.combat-contact').first().waitFor();
  await page.locator('.mythic-cinematic').evaluate(n=>{for(const a of n.getAnimations()){a.pause();a.currentTime=300;}});
  await page.screenshot({path:root+'artifacts/combat-mythical-'+width+'.png'});
  await page.goto('http://legends.local/#/home');await page.locator('.citadel-destinations').waitFor();assert.equal(await page.locator('#effects-layer>*').count(),0);assert.equal(await page.locator('.battle-pressure-vignette').count(),0);
 }
 await loadBattle(state);
 // Exercise health and shield contact separately against real battle portraits.
 for(const guard of [false,true]){
  await page.evaluate(async({state,guard})=>{const fx=await import('/src/battle-fx.js'),before=structuredClone(state),after=structuredClone(state);if(guard){before.heroes[0].shield=100;after.heroes[0].shield=40;}else after.heroes[0].hp-=20;fx.animateBattleFeedback(before,after,{kind:'enemy',actor:after.enemies[0].uid},document.querySelector('#app'));},{state,guard});
  await page.locator('.battle-hit-flash.'+(guard?'hit-guard':'hit-health')).waitFor();assert.ok(await page.locator('.battle-center').evaluate(n=>n.getAnimations().length>0));await page.waitForTimeout(350);
 }
 await page.emulateMedia({reducedMotion:'reduce'});await loadBattle(state);
 await page.locator('[data-action="hero"][data-uid="hero-0"]').click();await page.getByRole('button',{name:'Cast Charge 2'}).click();await page.locator('[data-action="enemy"][data-uid="enemy-0"]').click();await page.locator('.special-announcement').waitFor();assert.equal(await page.locator('.mythic-cinematic,.special-orb').count(),0);
 assert.deepEqual(errors,[]);console.log('Mythical presentation, phone layouts, pressure, health/shield recoil, reduced motion and abandonment cleanup passed');
}finally{await browser.close();}
